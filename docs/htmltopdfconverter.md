<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional PDF Converter</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #f8fafc;
            --border-color: #e2e8f0;
            --text-color: #1e293b;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: var(--text-color);
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .panel {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .panel h2 {
            color: var(--primary-color);
            margin-bottom: 20px;
            font-size: 1.3rem;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 10px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-color);
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .input-group textarea {
            min-height: 400px;
            font-family: 'Courier New', monospace;
            resize: vertical;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .btn {
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-secondary {
            background: #6b7280;
        }

        .btn-secondary:hover {
            background: #4b5563;
        }

        .file-input {
            position: relative;
            overflow: hidden;
            display: inline-block;
        }

        .file-input input[type=file] {
            position: absolute;
            left: -9999px;
        }

        .watermark-preview {
            max-width: 100px;
            max-height: 100px;
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            margin-top: 10px;
        }

        .preview-container {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-top: 30px;
        }

        .preview-content {
            border: 2px solid var(--border-color);
            border-radius: 8px;
            min-height: 400px;
            padding: 20px;
            background: #fafafa;
            overflow: auto;
        }

        /* PDF Print Styles */
        @media print {
            body * {
                visibility: hidden;
            }
            
            .pdf-content, .pdf-content * {
                visibility: visible;
            }
            
            .pdf-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
            }
            
            @page {
                size: A4;
                margin: 2cm;
                
                @top-center {
                    content: var(--header-content, "");
                    font-size: 12px;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }
                
                @bottom-center {
                    content: var(--footer-content, "") " - Page " counter(page) " of " counter(pages);
                    font-size: 12px;
                    border-top: 1px solid #ccc;
                    padding-top: 5px;
                }
                
                @bottom-right {
                    content: var(--watermark-content, "");
                    font-size: 10px;
                    opacity: 0.3;
                }
            }
            
            .page-break {
                page-break-before: always;
            }
            
            .avoid-break {
                page-break-inside: avoid;
            }
        }

        .pdf-settings {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }

        .loading {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .loading.show {
            display: flex;
        }

        .loading-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .status {
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            display: none;
        }

        .status.success {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .status.error {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Professional PDF Converter</h1>
            <p>HTML과 Markdown을 상용 수준의 PDF로 변환</p>
        </div>

        <div class="main-content">
            <div class="panel">
                <h2>📝 Content Input</h2>
                
                <div class="input-group">
                    <label>Input Type:</label>
                    <select id="inputType">
                        <option value="html">HTML</option>
                        <option value="markdown">Markdown</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Content:</label>
                    <textarea id="contentInput" placeholder="HTML 또는 Markdown 콘텐츠를 입력하세요...">
<!DOCTYPE html>
<html>
<head>
    <title>Sample Document</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; }
        .highlight { background-color: #fef3c7; padding: 10px; }
        .chapter { margin-top: 30px; }
    </style>
</head>
<body>
    <h1>Chapter 1: Introduction</h1>
    <p>This is a sample document to demonstrate PDF conversion capabilities.</p>
    <div class="highlight">
        <p>This is a highlighted section with custom styling.</p>
    </div>

    <div class="chapter">
        <h1>Chapter 2: Features</h1>
        <p>Our converter supports:</p>
        <ul>
            <li>CSS styling preservation</li>
            <li>JavaScript execution</li>
            <li>Custom headers and footers</li>
            <li>Watermarks and logos</li>
        </ul>
    </div>
</body>
</html>
                    </textarea>
                </div>

                <div class="input-group">
                    <label>File Upload (선택사항):</label>
                    <div class="file-input">
                        <input type="file" id="fileInput" accept=".html,.md,.txt">
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('fileInput').click()">
                            📁 파일 선택
                        </button>
                    </div>
                </div>
            </div>

            <div class="panel">
                <h2>⚙️ PDF Settings</h2>
                
                <div class="pdf-settings">
                    <div class="input-group">
                        <label>Page Size:</label>
                        <select id="pageSize">
                            <option value="A4">A4</option>
                            <option value="A3">A3</option>
                            <option value="A5">A5</option>
                            <option value="Letter">Letter</option>
                            <option value="Legal">Legal</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>Orientation:</label>
                        <select id="orientation">
                            <option value="portrait">세로</option>
                            <option value="landscape">가로</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>Top Margin (mm):</label>
                        <input type="number" id="marginTop" value="20" min="0" max="50">
                    </div>

                    <div class="input-group">
                        <label>Bottom Margin (mm):</label>
                        <input type="number" id="marginBottom" value="20" min="0" max="50">
                    </div>

                    <div class="input-group">
                        <label>Left Margin (mm):</label>
                        <input type="number" id="marginLeft" value="20" min="0" max="50">
                    </div>

                    <div class="input-group">
                        <label>Right Margin (mm):</label>
                        <input type="number" id="marginRight" value="20" min="0" max="50">
                    </div>

                    <div class="input-group">
                        <label>Header Text:</label>
                        <input type="text" id="headerText" placeholder="문서 제목 또는 챕터명">
                    </div>

                    <div class="input-group">
                        <label>Footer Text:</label>
                        <input type="text" id="footerText" placeholder="회사명 또는 저작권 정보">
                    </div>

                    <div class="input-group">
                        <label>Watermark Text:</label>
                        <input type="text" id="watermarkText" placeholder="CONFIDENTIAL 등">
                    </div>

                    <div class="input-group">
                        <label>Watermark Image:</label>
                        <div class="file-input">
                            <input type="file" id="watermarkImage" accept="image/*">
                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('watermarkImage').click()">
                                🖼️ 이미지 선택
                            </button>
                        </div>
                        <img id="watermarkPreview" class="watermark-preview" style="display: none;">
                    </div>

                    <div class="input-group">
                        <label>
                            <input type="checkbox" id="enablePageNumbers" checked>
                            페이지 번호 표시
                        </label>
                    </div>

                    <div class="input-group">
                        <label>
                            <input type="checkbox" id="enableTableOfContents">
                            목차 자동 생성
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn" onclick="previewContent()">
                👁️ 미리보기
            </button>
            <button class="btn" onclick="generatePDF()">
                📄 PDF 생성
            </button>
            <button class="btn btn-secondary" onclick="clearContent()">
                🗑️ 초기화
            </button>
        </div>

        <div id="status" class="status"></div>

        <div class="preview-container">
            <h2>📖 Preview</h2>
            <div id="previewContent" class="preview-content">
                <p style="text-align: center; color: #6b7280;">미리보기 버튼을 클릭하여 콘텐츠를 확인하세요.</p>
            </div>
        </div>
    </div>

    <div id="loadingModal" class="loading">
        <div class="loading-content">
            <div class="spinner"></div>
            <h3>PDF 생성 중...</h3>
            <p>잠시만 기다려주세요.</p>
        </div>
    </div>

    <script>
        class PDFConverter {
            constructor() {
                this.setupEventListeners();
                this.watermarkImageData = null;
            }

            setupEventListeners() {
                document.getElementById('fileInput').addEventListener('change', this.handleFileUpload.bind(this));
                document.getElementById('watermarkImage').addEventListener('change', this.handleWatermarkUpload.bind(this));
                document.getElementById('inputType').addEventListener('change', this.updatePlaceholder.bind(this));
            }

            handleFileUpload(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('contentInput').value = e.target.result;
                    this.showStatus('파일이 로드되었습니다.', 'success');
                };
                reader.readAsText(file);
            }

            handleWatermarkUpload(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.watermarkImageData = e.target.result;
                    const preview = document.getElementById('watermarkPreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    this.showStatus('워터마크 이미지가 업로드되었습니다.', 'success');
                };
                reader.readAsDataURL(file);
            }

            updatePlaceholder() {
                const inputType = document.getElementById('inputType').value;
                const textarea = document.getElementById('contentInput');
                
                if (inputType === 'markdown') {
                    textarea.placeholder = 'Markdown 콘텐츠를 입력하세요...';
                    textarea.value = `# Chapter 1: Introduction

This is a **sample document** to demonstrate PDF conversion capabilities.

> This is a highlighted section with custom styling.

## Chapter 2: Features

Our converter supports:

- CSS styling preservation
- JavaScript execution  
- Custom headers and footers
- Watermarks and logos

### Code Example

\`\`\`javascript
function generatePDF() {
    console.log("PDF 생성 시작");
}
\`\`\`

---

**Bold text** and *italic text* are supported.

[Link example](https://example.com)`;
                } else {
                    textarea.placeholder = 'HTML 콘텐츠를 입력하세요...';
                }
            }

            showStatus(message, type) {
                const status = document.getElementById('status');
                status.textContent = message;
                status.className = `status ${type}`;
                status.style.display = 'block';
                
                setTimeout(() => {
                    status.style.display = 'none';
                }, 3000);
            }

            processContent(content) {
                const inputType = document.getElementById('inputType').value;
                
                if (inputType === 'markdown') {
                    return marked.parse(content);
                }
                
                return content;
            }

            generateTableOfContents(html) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
                if (headings.length === 0) return html;

                let toc = '<div class="table-of-contents"><h2>목차</h2><ul>';
                let currentLevel = 1;
                
                headings.forEach((heading, index) => {
                    const level = parseInt(heading.tagName.charAt(1));
                    const id = `heading-${index}`;
                    heading.id = id;
                    
                    if (level > currentLevel) {
                        toc += '<ul>'.repeat(level - currentLevel);
                    } else if (level < currentLevel) {
                        toc += '</ul>'.repeat(currentLevel - level);
                    }
                    
                    toc += `<li><a href="#${id}">${heading.textContent}</a></li>`;
                    currentLevel = level;
                });
                
                toc += '</ul></div><div class="page-break"></div>';
                
                return html.replace('<body>', '<body>' + toc);
            }

            applyPDFStyles(html) {
                const settings = this.getSettings();
                
                let styles = `
                    <style>
                        @page {
                            size: ${settings.pageSize} ${settings.orientation};
                            margin: ${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm;
                        }
                        
                        body {
                            font-family: 'Malgun Gothic', Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        
                        .table-of-contents {
                            border: 1px solid #ddd;
                            padding: 20px;
                            margin-bottom: 30px;
                            border-radius: 5px;
                        }
                        
                        .table-of-contents ul {
                            list-style-type: none;
                            padding-left: 20px;
                        }
                        
                        .table-of-contents a {
                            text-decoration: none;
                            color: #2563eb;
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
                        }
                        
                        ${settings.watermarkText ? `
                        body::before {
                            content: "${settings.watermarkText}";
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-45deg);
                            font-size: 72px;
                            color: rgba(0,0,0,0.1);
                            z-index: -1;
                            white-space: nowrap;
                        }` : ''}
                        
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                        }
                    </style>
                `;
                
                return html.replace('</head>', styles + '</head>');
            }

            getSettings() {
                return {
                    pageSize: document.getElementById('pageSize').value,
                    orientation: document.getElementById('orientation').value,
                    marginTop: document.getElementById('marginTop').value,
                    marginBottom: document.getElementById('marginBottom').value,
                    marginLeft: document.getElementById('marginLeft').value,
                    marginRight: document.getElementById('marginRight').value,
                    headerText: document.getElementById('headerText').value,
                    footerText: document.getElementById('footerText').value,
                    watermarkText: document.getElementById('watermarkText').value,
                    enablePageNumbers: document.getElementById('enablePageNumbers').checked,
                    enableTableOfContents: document.getElementById('enableTableOfContents').checked
                };
            }

            async previewContent() {
                try {
                    const content = document.getElementById('contentInput').value;
                    if (!content.trim()) {
                        this.showStatus('콘텐츠를 입력해주세요.', 'error');
                        return;
                    }

                    let processedContent = this.processContent(content);
                    
                    if (document.getElementById('enableTableOfContents').checked) {
                        processedContent = this.generateTableOfContents(processedContent);
                    }
                    
                    processedContent = this.applyPDFStyles(processedContent);

                    document.getElementById('previewContent').innerHTML = processedContent;
                    this.showStatus('미리보기가 업데이트되었습니다.', 'success');
                } catch (error) {
                    console.error('Preview error:', error);
                    this.showStatus('미리보기 생성 중 오류가 발생했습니다.', 'error');
                }
            }

            async generatePDF() {
                try {
                    this.showLoading(true);
                    
                    const content = document.getElementById('contentInput').value;
                    if (!content.trim()) {
                        this.showStatus('콘텐츠를 입력해주세요.', 'error');
                        this.showLoading(false);
                        return;
                    }

                    let processedContent = this.processContent(content);
                    
                    if (document.getElementById('enableTableOfContents').checked) {
                        processedContent = this.generateTableOfContents(processedContent);
                    }
                    
                    processedContent = this.applyPDFStyles(processedContent);

                    // 임시 컨테이너 생성
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = processedContent;
                    tempContainer.style.position = 'absolute';
                    tempContainer.style.left = '-9999px';
                    tempContainer.style.width = '210mm'; // A4 width
                    tempContainer.style.background = 'white';
                    document.body.appendChild(tempContainer);

                    // JavaScript 실행 대기
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // PDF 생성 (브라우저 print 기능 사용)
                    const originalContent = document.body.innerHTML;
                    document.body.innerHTML = tempContainer.innerHTML;
                    document.body.className = 'pdf-content';

                    window.print();

                    // 원래 내용 복원
                    document.body.innerHTML = originalContent;
                    document.body.className = '';

                    this.showStatus('PDF 생성이 완료되었습니다. 브라우저의 인쇄 대화상자에서 PDF로 저장하세요.', 'success');
                    
                } catch (error) {
                    console.error('PDF generation error:', error);
                    this.showStatus('PDF 생성 중 오류가 발생했습니다.', 'error');
                } finally {
                    this.showLoading(false);
                }
            }

            showLoading(show) {
                const modal = document.getElementById('loadingModal');
                modal.classList.toggle('show', show);
            }

            clearContent() {
                document.getElementById('contentInput').value = '';
                document.getElementById('previewContent').innerHTML = '<p style="text-align: center; color: #6b7280;">미리보기 버튼을 클릭하여 콘텐츠를 확인하세요.</p>';
                document.getElementById('headerText').value = '';
                document.getElementById('footerText').value = '';
                document.getElementById('watermarkText').value = '';
                document.getElementById('watermarkPreview').style.display = 'none';
                this.watermarkImageData = null;
                this.showStatus('콘텐츠가 초기화되었습니다.', 'success');
            }
        }

        // 전역 함수들
        const converter = new PDFConverter();

        function previewContent() {
            converter.previewContent();
        }

        function generatePDF() {
            converter.generatePDF();
        }

        function clearContent() {
            converter.clearContent();
        }

        // 초기 미리보기
        window.addEventListener('load', () => {
            converter.previewContent();
        });
    </script>
</body>
</html>