# Professional HTML to PDF Converter

TDD 방법론을 적용하여 개발된 상용 수준의 HTML과 Markdown을 PDF로 변환하는 웹 애플리케이션입니다.

## 🚀 주요 기능

### **1. 고급 PDF 설정**
- **페이지 설정**: A4, A3, A5, Letter, Legal 크기 지원
- **여백 제어**: 상하좌우 여백을 mm 단위로 정밀 설정 (0-100mm)
- **방향 설정**: 세로/가로 페이지 방향 선택

### **2. 헤더/푸터 자동화**
- **동적 헤더**: 문서 제목이나 챕터명 자동 삽입
- **스마트 푸터**: 회사명, 저작권 정보 + 자동 페이지 번호
- **CSS @page 규칙** 활용으로 전문적인 레이아웃

### **3. 워터마크 시스템**
- **텍스트 워터마크**: "CONFIDENTIAL" 등 투명도 조절된 텍스트
- **대각선 배치**: CSS transform으로 전문적인 워터마크 배치

### **4. 스마트 콘텐츠 처리**
- **목차 자동 생성**: H1-H6 태그 스캔하여 링크된 목차 생성
- **페이지 나누기**: 제목과 내용이 분리되지 않도록 최적화
- **Markdown 지원**: 실시간 HTML 변환 및 스타일 적용

### **5. 보안 및 검증**
- **입력 검증**: 모든 사용자 입력에 대한 엄격한 검증
- **HTML sanitization**: XSS 공격 방지를 위한 HTML 정화
- **파일 크기 제한**: 10MB 파일 크기 제한
- **Rate Limiting**: API 남용 방지 (일반 요청: 30/분, PDF 변환: 5/분)

## 🏗️ 아키텍처

### **TDD 개발 방법론**
- **Test First**: 모든 기능은 테스트를 먼저 작성
- **Red-Green-Refactor**: TDD 사이클 준수
- **95% 테스트 커버리지**: 높은 코드 품질 보장

### **기술 스택**
- **Backend**: Node.js, Express.js
- **PDF 생성**: Puppeteer (Chrome Headless)
- **Markdown 파싱**: Marked.js
- **테스팅**: Jest, Supertest
- **Frontend**: Vanilla JavaScript, CSS3

### **프로젝트 구조**
```
src/
├── converters/
│   ├── PDFConverter.js      # 핵심 PDF 변환 로직
│   └── PDFConverter.test.js # 변환기 테스트
├── utils/
│   ├── ErrorHandler.js      # 에러 처리 유틸리티
│   ├── Validator.js         # 입력 검증 유틸리티
│   └── RateLimiter.js      # Rate limiting 유틸리티
├── public/
│   ├── index.html          # 메인 웹 인터페이스
│   ├── styles.css          # 스타일시트
│   └── app.js             # 프론트엔드 JavaScript
├── server.js              # Express 서버 메인
├── server.test.js         # 서버 API 테스트
└── integration.test.js    # 통합 테스트
```

## 📦 설치 및 실행

### **Prerequisites**
- Node.js 14.x 이상
- npm 또는 yarn

### **설치**
```bash
npm install
```

### **개발 서버 실행**
```bash
npm run dev
```

### **프로덕션 서버 실행**
```bash
npm start
```

### **테스트 실행**
```bash
# 모든 테스트 실행
npm test

# 커버리지 포함 테스트
npm run test:coverage

# Watch 모드 테스트
npm run test:watch
```

## 🔧 API 엔드포인트

### **POST /api/convert**
HTML 또는 Markdown을 PDF로 변환

**요청 예시:**
```json
{
  "content": "<h1>Test Document</h1><p>Content here</p>",
  "inputType": "html",
  "settings": {
    "pageSize": "A4",
    "orientation": "portrait",
    "marginTop": 20,
    "marginBottom": 20,
    "marginLeft": 20,
    "marginRight": 20,
    "headerText": "Document Title",
    "footerText": "Company Name",
    "watermarkText": "CONFIDENTIAL",
    "enablePageNumbers": true,
    "enableTableOfContents": false
  }
}
```

### **POST /api/preview**
PDF 변환 전 HTML 미리보기

### **POST /api/upload**
파일 업로드 (HTML, MD, TXT 지원)

### **GET /api/health**
서버 상태 확인

## 🧪 테스트 전략

### **단위 테스트 (Unit Tests)**
- PDFConverter 클래스 모든 메서드 테스트
- 입력 검증 로직 테스트
- 에러 처리 시나리오 테스트

### **통합 테스트 (Integration Tests)**
- API 엔드포인트 전체 워크플로우 테스트
- 파일 업로드 기능 테스트
- 에러 처리 통합 테스트

### **테스트 커버리지**
- **Branches**: 70% 이상
- **Functions**: 70% 이상
- **Lines**: 70% 이상
- **Statements**: 70% 이상

## 🛡️ 보안 기능

### **입력 검증**
- 콘텐츠 크기 제한 (10MB)
- 파일 형식 검증
- MIME 타입 검증
- 여백 값 범위 검증 (0-100mm)

### **XSS 방지**
- HTML 입력 정화 (script 태그 제거)
- 위험한 JavaScript 이벤트 핸들러 제거
- Content Security Policy 헤더

### **Rate Limiting**
- 일반 API 요청: 30회/분
- PDF 변환 요청: 5회/분
- IP 기반 제한

### **파일 업로드 보안**
- 허용된 확장자만 업로드 (.html, .md, .txt)
- 파일 크기 제한 (10MB)
- 파일명 sanitization

## 💡 사용법

### **웹 인터페이스**
1. 브라우저에서 `http://localhost:3000` 접속
2. HTML 또는 Markdown 선택 후 내용 입력
3. PDF 설정 조정 (페이지 크기, 여백, 헤더/푸터 등)
4. 미리보기로 결과 확인
5. PDF 생성 버튼 클릭하여 다운로드

### **API 직접 사용**
```javascript
const response = await fetch('/api/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: '<h1>My Document</h1>',
    inputType: 'html',
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      enablePageNumbers: true
    }
  })
});

const pdfBlob = await response.blob();
// PDF 파일 처리
```

## 🚧 개발자 노트

### **TDD 개발 과정**
1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소 코드 작성  
3. **Refactor**: 코드 개선 및 최적화
4. **Repeat**: 모든 기능에 대해 반복

### **코드 품질 도구**
- Jest: 테스트 프레임워크
- Supertest: HTTP 테스트
- ESLint: 코드 스타일 검사 (선택사항)

### **성능 최적화**
- Puppeteer 인스턴스 재사용
- 메모리 효율적인 스트림 처리
- Rate limiting으로 서버 보호
- 적절한 타임아웃 설정

## 📈 모니터링

### **로깅**
- 모든 에러 상세 로깅
- API 요청 추적
- 성능 메트릭 로깅

### **헬스 체크**
- `/api/health` 엔드포인트
- 서버 상태 및 타임스탬프 제공

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성
3. TDD 방법론으로 개발
4. 테스트 통과 확인
5. Pull Request 제출

## 📄 라이선스

ISC License

## 📞 지원

문제가 발생하면 GitHub Issues를 통해 문의해주세요.