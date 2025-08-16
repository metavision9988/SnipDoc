const ErrorHandler = require('./ErrorHandler');

class Validator {
  static validateContent(content) {
    if (!content || typeof content !== 'string') {
      throw ErrorHandler.handleContentError('Content must be a non-empty string');
    }
    
    if (content.trim().length === 0) {
      throw ErrorHandler.handleContentError('Content cannot be empty');
    }
    
    if (content.length > 10 * 1024 * 1024) { // 10MB limit
      throw ErrorHandler.handleContentError('Content size exceeds 10MB limit');
    }
    
    return true;
  }

  static validateInputType(inputType) {
    const validTypes = ['html', 'markdown'];
    if (!validTypes.includes(inputType)) {
      throw ErrorHandler.handleValidationError(
        'inputType',
        inputType,
        'Must be either "html" or "markdown"'
      );
    }
    
    return true;
  }

  static validatePDFSettings(settings) {
    if (!settings || typeof settings !== 'object') {
      throw ErrorHandler.handleValidationError(
        'settings',
        typeof settings,
        'Must be an object'
      );
    }

    // Validate page size
    if (settings.pageSize) {
      const validPageSizes = ['A4', 'A3', 'A5', 'Letter', 'Legal'];
      if (!validPageSizes.includes(settings.pageSize)) {
        throw ErrorHandler.handleValidationError(
          'pageSize',
          settings.pageSize,
          `Must be one of: ${validPageSizes.join(', ')}`
        );
      }
    }

    // Validate orientation
    if (settings.orientation) {
      const validOrientations = ['portrait', 'landscape'];
      if (!validOrientations.includes(settings.orientation)) {
        throw ErrorHandler.handleValidationError(
          'orientation',
          settings.orientation,
          `Must be one of: ${validOrientations.join(', ')}`
        );
      }
    }

    // Validate margins
    const marginFields = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
    marginFields.forEach(field => {
      if (settings[field] !== undefined) {
        const value = Number(settings[field]);
        if (isNaN(value) || value < 0 || value > 100) {
          throw ErrorHandler.handleValidationError(
            field,
            settings[field],
            'Must be a number between 0 and 100'
          );
        }
      }
    });

    // Validate text fields
    const textFields = ['headerText', 'footerText', 'watermarkText'];
    textFields.forEach(field => {
      if (settings[field] && typeof settings[field] !== 'string') {
        throw ErrorHandler.handleValidationError(
          field,
          typeof settings[field],
          'Must be a string'
        );
      }
      
      if (settings[field] && settings[field].length > 500) {
        throw ErrorHandler.handleValidationError(
          field,
          settings[field].length,
          'Must be less than 500 characters'
        );
      }
    });

    // Validate boolean fields
    const booleanFields = ['enablePageNumbers', 'enableTableOfContents'];
    booleanFields.forEach(field => {
      if (settings[field] !== undefined && typeof settings[field] !== 'boolean') {
        throw ErrorHandler.handleValidationError(
          field,
          typeof settings[field],
          'Must be a boolean'
        );
      }
    });

    return true;
  }

  static validateFile(file) {
    if (!file) {
      throw ErrorHandler.handleFileError('No file provided');
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      throw ErrorHandler.handleFileError('File size exceeds 10MB limit');
    }

    const allowedExtensions = ['.html', '.htm', '.md', '.markdown', '.txt'];
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      throw ErrorHandler.handleFileError(
        `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
      );
    }

    const allowedMimeTypes = [
      'text/html',
      'text/markdown',
      'text/plain',
      'application/octet-stream'
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw ErrorHandler.handleFileError(
        `Invalid MIME type: ${file.mimetype}`
      );
    }

    return true;
  }

  static sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    // Basic HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, 'data:text/plain')
      .replace(/vbscript:/gi, '');
  }

  static sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return 'converted.pdf';
    }

    // Remove dangerous characters and ensure safe filename
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100); // Limit length
  }
}

module.exports = Validator;