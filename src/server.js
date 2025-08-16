const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const PDFConverter = require('./converters/PDFConverter');
const ErrorHandler = require('./utils/ErrorHandler');
const Validator = require('./utils/Validator');
const RateLimiter = require('./utils/RateLimiter');

const app = express();
const converter = new PDFConverter();

// Create rate limiter instances
const generalLimiter = new RateLimiter(60000, 30); // 30 requests per minute
const conversionLimiter = new RateLimiter(60000, 5); // 5 conversions per minute

// Start cleanup for rate limiters
generalLimiter.startCleanup();
conversionLimiter.startCleanup();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use('/api', generalLimiter.middleware());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /html|md|txt|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/convert', conversionLimiter.middleware(), async (req, res) => {
  try {
    const { content, inputType = 'html', settings = {} } = req.body;
    
    // Validate input
    Validator.validateContent(content);
    Validator.validateInputType(inputType);
    
    const defaultSettings = {
      pageSize: 'A4',
      orientation: 'portrait',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      ...settings
    };
    
    Validator.validatePDFSettings(defaultSettings);

    // Sanitize HTML content if needed
    const sanitizedContent = inputType === 'html' ? 
      Validator.sanitizeHTML(content) : content;

    const result = await converter.generatePDF(sanitizedContent, inputType, defaultSettings);
    
    const filename = Validator.sanitizeFilename(settings.filename) || 'converted.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', result.buffer.length);
    res.send(result.buffer);
  } catch (error) {
    ErrorHandler.logError(error, { 
      endpoint: '/api/convert',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json(ErrorHandler.formatErrorResponse(error));
  }
});

app.post('/api/preview', async (req, res) => {
  try {
    const { content, inputType = 'html', settings = {} } = req.body;
    
    // Validate input
    Validator.validateContent(content);
    Validator.validateInputType(inputType);

    const defaultSettings = {
      pageSize: 'A4',
      orientation: 'portrait',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      ...settings
    };
    
    Validator.validatePDFSettings(defaultSettings);

    // Sanitize HTML content if needed
    const sanitizedContent = inputType === 'html' ? 
      Validator.sanitizeHTML(content) : content;

    // Process content
    let processedContent = converter.processContent(sanitizedContent, inputType);
    
    // Generate table of contents if enabled
    if (settings?.enableTableOfContents) {
      processedContent = converter.generateTableOfContents(processedContent);
    }
    
    // Apply PDF styles
    processedContent = converter.applyPDFStyles(processedContent, defaultSettings);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(processedContent);
  } catch (error) {
    ErrorHandler.logError(error, { 
      endpoint: '/api/preview',
      ip: req.ip
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json(ErrorHandler.formatErrorResponse(error));
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw ErrorHandler.handleFileError('No file uploaded');
    }

    // Validate uploaded file
    Validator.validateFile(req.file);

    const content = req.file.buffer.toString('utf-8');
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let inputType = 'html';
    if (fileExt === '.md' || fileExt === '.markdown') {
      inputType = 'markdown';
    }

    // Validate content
    Validator.validateContent(content);

    res.json({
      content: content,
      inputType: inputType,
      filename: Validator.sanitizeFilename(req.file.originalname),
      size: req.file.size
    });
  } catch (error) {
    ErrorHandler.logError(error, { 
      endpoint: '/api/upload',
      ip: req.ip,
      filename: req.file?.originalname
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json(ErrorHandler.formatErrorResponse(error));
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  ErrorHandler.logError(error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json(ErrorHandler.formatErrorResponse(
      ErrorHandler.handleFileError('File too large. Maximum size is 10MB.')
    ));
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json(ErrorHandler.formatErrorResponse(
      ErrorHandler.handleFileError('Unexpected file field.')
    ));
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json(ErrorHandler.formatErrorResponse(
      ErrorHandler.handleValidationError('JSON', 'malformed', 'Invalid JSON format')
    ));
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json(ErrorHandler.formatErrorResponse(error));
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  generalLimiter.stopCleanup();
  conversionLimiter.stopCleanup();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  generalLimiter.stopCleanup();
  conversionLimiter.stopCleanup();
  process.exit(0);
});

// For testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`PDF Converter server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the converter`);
  });
}

module.exports = app;