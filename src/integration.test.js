const request = require('supertest');
const app = require('./server');
const PDFConverter = require('./converters/PDFConverter');

describe('Integration Tests', () => {
  let converter;

  beforeEach(() => {
    converter = new PDFConverter();
  });

  describe('Complete PDF Generation Workflow', () => {
    test('should handle complete HTML to PDF workflow', async () => {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Integration Test</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { color: #2563eb; border-bottom: 2px solid #2563eb; }
            .content { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1 class="header">Integration Test Document</h1>
          <div class="content">
            <p>This document tests the complete workflow from HTML to PDF.</p>
            <ul>
              <li>CSS styling preservation</li>
              <li>HTML structure maintenance</li>
              <li>PDF generation functionality</li>
            </ul>
          </div>
        </body>
        </html>
      `;

      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        enableTableOfContents: false,
        enablePageNumbers: true,
        headerText: 'Integration Test',
        footerText: 'Test Footer'
      };

      // Test API conversion
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: htmlContent,
          inputType: 'html',
          settings: settings
        })
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/pdf/);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0);
    }, 15000);

    test('should handle complete Markdown to PDF workflow', async () => {
      const markdownContent = `
# Integration Test Document

This document tests the complete workflow from **Markdown** to PDF.

## Features Tested

- *Markdown parsing*
- **Bold and italic text**
- Lists and structure
- Code blocks

\`\`\`javascript
function testFunction() {
  return "Hello World";
}
\`\`\`

## Links and References

[GitHub](https://github.com)

> This is a blockquote to test styling.

---

### Summary

All features should be preserved in the PDF output.
      `;

      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 25,
        marginBottom: 25,
        marginLeft: 25,
        marginRight: 25,
        enableTableOfContents: true,
        enablePageNumbers: true,
        watermarkText: 'DRAFT'
      };

      // Test API conversion
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: markdownContent,
          inputType: 'markdown',
          settings: settings
        })
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/pdf/);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0);
    }, 15000);

    test('should handle preview workflow', async () => {
      const content = '# Test Preview\n\nThis is a **test** for preview functionality.';

      const response = await request(app)
        .post('/api/preview')
        .send({
          content: content,
          inputType: 'markdown',
          settings: {
            pageSize: 'A4',
            orientation: 'portrait',
            enableTableOfContents: true
          }
        })
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/html/);
      expect(response.text).toContain('<h1');
      expect(response.text).toContain('Test Preview');
      expect(response.text).toContain('<strong>test</strong>');
      expect(response.text).toContain('table-of-contents');
      expect(response.text).toContain('@page');
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle API validation errors gracefully', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: '',
          inputType: 'html',
          settings: {}
        })
        .expect(400);

      expect(response.body.error).toContain('Content');
    });

    test('should handle invalid settings in API', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: '<h1>Test</h1>',
          inputType: 'html',
          settings: {
            pageSize: 'InvalidSize',
            marginTop: -10
          }
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid');
    });

    test('should handle malformed JSON in API', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send('invalid json')
        .expect(400);

      expect(response.body).toBeDefined();
    });
  });

  describe('File Upload Integration', () => {
    test('should handle HTML file upload', async () => {
      const htmlContent = '<h1>Uploaded File</h1><p>Content from file</p>';
      
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from(htmlContent), 'test.html')
        .expect(200);

      expect(response.body.content).toBe(htmlContent);
      expect(response.body.inputType).toBe('html');
      expect(response.body.filename).toBe('test.html');
    });

    test('should handle Markdown file upload', async () => {
      const markdownContent = '# Uploaded Markdown\n\nThis is from a file.';
      
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from(markdownContent), 'test.md')
        .expect(200);

      expect(response.body.content).toBe(markdownContent);
      expect(response.body.inputType).toBe('markdown');
      expect(response.body.filename).toBe('test.md');
    });

    test('should reject invalid file types', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('invalid content'), 'test.exe')
        .expect(500);

      expect(response.body.error).toContain('Invalid file type');
    });

    test('should handle missing file in upload', async () => {
      const response = await request(app)
        .post('/api/upload')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('No file uploaded');
    });
  });

  describe('Health Check', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Static File Serving', () => {
    test('should serve index.html', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/html/);
      expect(response.text).toContain('PDF Converter');
    });
  });
});