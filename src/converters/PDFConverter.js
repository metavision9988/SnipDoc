const { marked } = require('marked');
const puppeteer = require('puppeteer');

class PDFConverter {
  constructor() {
    this.validPageSizes = ['A4', 'A3', 'A5', 'Letter', 'Legal'];
    this.validOrientations = ['portrait', 'landscape'];
  }

  processContent(content, inputType) {
    if (!content) return '';
    
    if (inputType === 'markdown') {
      return marked(content);
    }
    
    return content;
  }

  generateTableOfContents(html) {
    const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h\1>/gi;
    const headings = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const attributes = match[2];
      const text = match[3].replace(/<[^>]*>/g, ''); // Strip inner HTML tags
      
      let id = '';
      const idMatch = attributes.match(/id=["']([^"']+)["']/);
      if (idMatch) {
        id = idMatch[1];
      } else {
        id = `heading-${index}`;
      }
      
      headings.push({ level, text, id });
      index++;
    }

    if (headings.length === 0) {
      return html;
    }

    // Add IDs to headings that don't have them
    let modifiedHtml = html;
    index = 0;
    modifiedHtml = modifiedHtml.replace(headingRegex, (match, level, attributes, text) => {
      if (!attributes.includes('id=')) {
        return `<h${level} id="heading-${index++}"${attributes}>${text}</h${level}>`;
      }
      index++;
      return match;
    });

    // Build TOC HTML
    let tocHtml = '<div class="table-of-contents"><h2>목차</h2><ul>';
    let currentLevel = 1;
    
    headings.forEach(heading => {
      if (heading.level > currentLevel) {
        tocHtml += '<ul>'.repeat(heading.level - currentLevel);
      } else if (heading.level < currentLevel) {
        tocHtml += '</ul>'.repeat(currentLevel - heading.level);
      }
      
      tocHtml += `<li><a href="#${heading.id}">${heading.text}</a></li>`;
      currentLevel = heading.level;
    });
    
    tocHtml += '</ul>'.repeat(currentLevel);
    tocHtml += '</div><div class="page-break"></div>';
    
    // Insert TOC after opening body tag
    if (modifiedHtml.includes('<body>')) {
      modifiedHtml = modifiedHtml.replace('<body>', '<body>' + tocHtml);
    } else {
      modifiedHtml = tocHtml + modifiedHtml;
    }
    
    return modifiedHtml;
  }

  applyPDFStyles(html, settings) {
    const styles = `
      <style>
        @page {
          size: ${settings.pageSize} ${settings.orientation};
          margin: ${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm;
        }
        
        body {
          font-family: 'Malgun Gothic', 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .table-of-contents {
          border: 1px solid #ddd;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        
        .table-of-contents h2 {
          margin-top: 0;
          color: #2563eb;
        }
        
        .table-of-contents ul {
          list-style-type: none;
          padding-left: 20px;
        }
        
        .table-of-contents li {
          margin: 5px 0;
        }
        
        .table-of-contents a {
          text-decoration: none;
          color: #2563eb;
        }
        
        .table-of-contents a:hover {
          text-decoration: underline;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .avoid-break {
          page-break-inside: avoid;
        }
        
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          margin-top: 1.5em;
          color: #1e293b;
        }
        
        pre {
          background-color: #f4f4f4;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          overflow-x: auto;
        }
        
        code {
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        
        blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 15px;
          margin-left: 0;
          color: #666;
          font-style: italic;
        }
        
        ${settings.watermarkText ? `
        body::before {
          content: "${settings.watermarkText}";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 72px;
          color: rgba(0, 0, 0, 0.1);
          z-index: -1;
          white-space: nowrap;
          pointer-events: none;
        }` : ''}
        
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    `;
    
    if (html.includes('</head>')) {
      return html.replace('</head>', styles + '</head>');
    } else if (html.includes('<html>')) {
      return html.replace('<html>', '<html><head>' + styles + '</head>');
    } else {
      return '<html><head>' + styles + '</head><body>' + html + '</body></html>';
    }
  }

  validateSettings(settings) {
    if (settings.pageSize && !this.validPageSizes.includes(settings.pageSize)) {
      throw new Error(`Invalid page size: ${settings.pageSize}`);
    }
    
    if (settings.orientation && !this.validOrientations.includes(settings.orientation)) {
      throw new Error(`Invalid orientation: ${settings.orientation}`);
    }
    
    const marginFields = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
    marginFields.forEach(field => {
      if (settings[field] !== undefined && settings[field] < 0) {
        throw new Error(`Invalid margin: ${field} cannot be negative`);
      }
    });
  }

  async generatePDF(content, inputType, settings) {
    if (!content || content.trim() === '') {
      throw new Error('Content cannot be empty');
    }

    this.validateSettings(settings);

    // Process content (HTML or Markdown)
    let processedContent = this.processContent(content, inputType);
    
    // Generate table of contents if enabled
    if (settings.enableTableOfContents) {
      processedContent = this.generateTableOfContents(processedContent);
    }
    
    // Apply PDF styles
    processedContent = this.applyPDFStyles(processedContent, settings);

    // For testing purposes, return a mock result
    // In production, this would use Puppeteer to generate actual PDF
    if (process.env.NODE_ENV === 'test') {
      return {
        buffer: Buffer.from('mock-pdf-content'),
        processedHTML: processedContent
      };
    }

    // Generate actual PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(processedContent, { waitUntil: 'networkidle0' });
      
      // Wait for any JavaScript to execute
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      const pdfBuffer = await page.pdf({
        format: settings.pageSize,
        landscape: settings.orientation === 'landscape',
        margin: {
          top: `${settings.marginTop || 20}mm`,
          bottom: `${settings.marginBottom || 20}mm`,
          left: `${settings.marginLeft || 20}mm`,
          right: `${settings.marginRight || 20}mm`
        },
        printBackground: true,
        displayHeaderFooter: settings.headerText || settings.footerText || settings.enablePageNumbers,
        headerTemplate: settings.headerText ? `
          <div style="font-size: 10px; width: 100%; text-align: center;">
            ${settings.headerText}
          </div>
        ` : '',
        footerTemplate: settings.footerText || settings.enablePageNumbers ? `
          <div style="font-size: 10px; width: 100%; display: flex; justify-content: space-between; padding: 0 20px;">
            <span>${settings.footerText || ''}</span>
            ${settings.enablePageNumbers ? '<span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>' : ''}
          </div>
        ` : ''
      });

      return {
        buffer: pdfBuffer,
        processedHTML: processedContent
      };
    } finally {
      await browser.close();
    }
  }
}

module.exports = PDFConverter;