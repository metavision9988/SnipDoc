const PDFConverter = require('./PDFConverter');

describe('PDFConverter', () => {
  let converter;

  beforeEach(() => {
    converter = new PDFConverter();
  });

  describe('processContent', () => {
    test('should process HTML content as-is', () => {
      const htmlContent = '<h1>Test</h1><p>Content</p>';
      const result = converter.processContent(htmlContent, 'html');
      expect(result).toBe(htmlContent);
    });

    test('should convert Markdown to HTML', () => {
      const markdownContent = '# Test\n\nContent';
      const result = converter.processContent(markdownContent, 'markdown');
      expect(result).toContain('<h1');
      expect(result).toContain('Test');
      expect(result).toContain('<p>Content</p>');
    });

    test('should handle empty content', () => {
      const result = converter.processContent('', 'html');
      expect(result).toBe('');
    });

    test('should handle complex Markdown with code blocks', () => {
      const markdownContent = '# Title\n\n```javascript\nconst test = "value";\n```';
      const result = converter.processContent(markdownContent, 'markdown');
      expect(result).toContain('<h1');
      expect(result).toContain('<code');
    });
  });

  describe('generateTableOfContents', () => {
    test('should generate TOC from headings', () => {
      const html = '<h1 id="h1">Chapter 1</h1><h2 id="h2">Section 1.1</h2><p>Content</p>';
      const result = converter.generateTableOfContents(html);
      expect(result).toContain('table-of-contents');
      expect(result).toContain('Chapter 1');
      expect(result).toContain('Section 1.1');
      expect(result).toContain('#h1');
      expect(result).toContain('#h2');
    });

    test('should handle HTML without headings', () => {
      const html = '<p>Just paragraph content</p>';
      const result = converter.generateTableOfContents(html);
      expect(result).toBe(html);
    });

    test('should add IDs to headings without them', () => {
      const html = '<h1>Title Without ID</h1>';
      const result = converter.generateTableOfContents(html);
      expect(result).toContain('id="heading-0"');
      expect(result).toContain('#heading-0');
    });

    test('should handle nested heading levels correctly', () => {
      const html = '<h1>Level 1</h1><h3>Level 3</h3><h2>Level 2</h2>';
      const result = converter.generateTableOfContents(html);
      expect(result).toContain('table-of-contents');
      const tocSection = result.substring(0, result.indexOf('</div>'));
      expect(tocSection).toContain('<ul');
    });
  });

  describe('applyPDFStyles', () => {
    test('should apply basic PDF styles', () => {
      const html = '<html><head></head><body>Content</body></html>';
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15
      };
      const result = converter.applyPDFStyles(html, settings);
      expect(result).toContain('@page');
      expect(result).toContain('size: A4 portrait');
      expect(result).toContain('margin: 20mm 15mm 20mm 15mm');
    });

    test('should add watermark when provided', () => {
      const html = '<html><head></head><body>Content</body></html>';
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        watermarkText: 'CONFIDENTIAL'
      };
      const result = converter.applyPDFStyles(html, settings);
      expect(result).toContain('CONFIDENTIAL');
      expect(result).toContain('body::before');
      expect(result).toContain('rotate(-45deg)');
    });

    test('should handle landscape orientation', () => {
      const html = '<html><head></head><body>Content</body></html>';
      const settings = {
        pageSize: 'Letter',
        orientation: 'landscape',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
      };
      const result = converter.applyPDFStyles(html, settings);
      expect(result).toContain('size: Letter landscape');
    });
  });

  describe('validateSettings', () => {
    test('should accept valid settings', () => {
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
      };
      expect(() => converter.validateSettings(settings)).not.toThrow();
    });

    test('should throw error for invalid page size', () => {
      const settings = {
        pageSize: 'InvalidSize',
        orientation: 'portrait'
      };
      expect(() => converter.validateSettings(settings)).toThrow('Invalid page size');
    });

    test('should throw error for invalid orientation', () => {
      const settings = {
        pageSize: 'A4',
        orientation: 'diagonal'
      };
      expect(() => converter.validateSettings(settings)).toThrow('Invalid orientation');
    });

    test('should throw error for negative margins', () => {
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: -5
      };
      expect(() => converter.validateSettings(settings)).toThrow('Invalid margin');
    });
  });

  describe('generatePDF', () => {
    test('should generate PDF from HTML content', async () => {
      const content = '<h1>Test Document</h1><p>Test content</p>';
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        enableTableOfContents: false
      };
      
      const result = await converter.generatePDF(content, 'html', settings);
      expect(result).toBeTruthy();
      expect(result.buffer).toBeDefined();
    });

    test('should generate PDF with table of contents', async () => {
      const content = '<h1>Chapter 1</h1><p>Content</p><h2>Section 1.1</h2><p>More content</p>';
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        enableTableOfContents: true
      };
      
      const result = await converter.generatePDF(content, 'html', settings);
      expect(result).toBeTruthy();
      expect(result.processedHTML).toContain('table-of-contents');
    });

    test('should handle Markdown input', async () => {
      const content = '# Test Document\n\nThis is **bold** text.';
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
      };
      
      const result = await converter.generatePDF(content, 'markdown', settings);
      expect(result).toBeTruthy();
      expect(result.processedHTML).toContain('<h1');
      expect(result.processedHTML).toContain('<strong>');
    });

    test('should throw error for empty content', async () => {
      const settings = {
        pageSize: 'A4',
        orientation: 'portrait'
      };
      
      await expect(converter.generatePDF('', 'html', settings))
        .rejects.toThrow('Content cannot be empty');
    });
  });
});