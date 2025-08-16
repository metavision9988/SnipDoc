# 📖 SnipDoc 사용자 매뉴얼

## 🎯 소개

**SnipDoc**은 HTML과 Markdown 문서를 고품질 PDF로 변환하는 웹 기반 도구입니다. 브라우저에서 바로 사용할 수 있으며, CSS 스타일과 JavaScript를 완벽하게 지원합니다.

## 🚀 빠른 시작

### 1. 웹사이트 접속
- 브라우저에서 `http://localhost:3000` 접속
- 또는 배포된 서비스 URL 접속

### 2. 첫 번째 PDF 생성
1. **콘텐츠 입력**: 왼쪽 패널에 HTML 또는 Markdown 입력
2. **미리보기**: '👁️ 미리보기' 버튼 클릭하여 결과 확인
3. **PDF 생성**: '📄 PDF 생성' 버튼 클릭하여 다운로드

## 📝 기본 사용법

### 콘텐츠 입력 방법

#### **방법 1: 직접 입력**
1. **입력 형식 선택**: HTML 또는 Markdown 선택
2. **텍스트 입력**: 텍스트 영역에 콘텐츠 작성
3. **실시간 편집**: 입력하면서 즉시 변경사항 반영

#### **방법 2: 파일 업로드**
1. **파일 선택**: '📁 파일 선택' 버튼 클릭
2. **지원 형식**: .html, .md, .txt 파일
3. **자동 인식**: 파일 확장자에 따라 형식 자동 설정

### 미리보기 사용법

#### **미리보기 기능**
- **실시간 확인**: PDF 생성 전 결과 미리 확인
- **스타일 적용**: CSS 스타일이 그대로 적용된 상태로 표시
- **반응형**: 다양한 화면 크기에서 확인 가능

#### **미리보기 팁**
- 목차가 너무 길면 페이지 나누기 고려
- 이미지 크기가 페이지를 벗어나지 않는지 확인
- 테이블이 페이지 경계에서 깨지지 않는지 점검

## ⚙️ PDF 설정 가이드

### 페이지 설정

#### **페이지 크기**
- **A4**: 210 × 297mm (가장 일반적)
- **A3**: 297 × 420mm (큰 문서용)
- **A5**: 148 × 210mm (소형 문서)
- **Letter**: 215.9 × 279.4mm (미국 표준)
- **Legal**: 215.9 × 355.6mm (법률 문서)

#### **페이지 방향**
- **세로 (Portrait)**: 일반 문서, 텍스트 중심
- **가로 (Landscape)**: 표, 차트, 프레젠테이션

#### **여백 설정**
- **범위**: 0-100mm
- **기본값**: 20mm (모든 방향)
- **권장값**: 
  - 일반 문서: 20-25mm
  - 공식 문서: 25-30mm
  - 브로셔: 10-15mm

### 헤더/푸터 설정

#### **헤더 텍스트**
```
예시:
- "회사 기밀 문서"
- "2025년 사업 계획서"
- "프로젝트 보고서 - 1차"
```

#### **푸터 텍스트**
```
예시:
- "© 2025 회사명. All rights reserved."
- "문의: contact@company.com"
- "최종 수정일: 2025-08-14"
```

#### **페이지 번호**
- **자동 삽입**: 체크박스 활성화
- **형식**: "Page 1 of 5" 형태로 표시
- **위치**: 푸터 우측에 자동 배치

### 워터마크 설정

#### **텍스트 워터마크**
```
일반적인 예시:
- "CONFIDENTIAL" (기밀)
- "DRAFT" (초안)
- "COPY" (사본)
- "FOR REVIEW" (검토용)
```

#### **워터마크 특징**
- **투명도**: 10% (배경에 은은하게 표시)
- **각도**: 45도 대각선
- **크기**: 자동 조정
- **색상**: 회색

### 목차 설정

#### **자동 목차 생성**
- **H1-H6 태그**: 자동으로 스캔하여 목차 생성
- **링크 연결**: 목차 항목 클릭시 해당 섹션으로 이동
- **계층 구조**: 제목 레벨에 따라 들여쓰기 적용

#### **목차 사용 팁**
```html
<!-- 좋은 예시 -->
<h1>1. 개요</h1>
<h2>1.1 프로젝트 배경</h2>
<h2>1.2 목적</h2>
<h1>2. 상세 내용</h1>
<h2>2.1 기능 명세</h2>
<h3>2.1.1 핵심 기능</h3>
```

## 📄 문서 작성 가이드

### HTML 문서 작성

#### **기본 구조**
```html
<!DOCTYPE html>
<html>
<head>
    <title>문서 제목</title>
    <style>
        body { 
            font-family: '맑은 고딕', Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        h1 { 
            color: #2563eb; 
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
        }
        .highlight { 
            background-color: #fef3c7; 
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>문서 제목</h1>
    <div class="highlight">
        <p>중요한 내용은 이렇게 강조할 수 있습니다.</p>
    </div>
    <p>일반적인 본문 내용입니다.</p>
</body>
</html>
```

#### **PDF 최적화 CSS**
```css
/* 페이지 나누기 제어 */
.page-break {
    page-break-before: always;
}

.avoid-break {
    page-break-inside: avoid;
}

/* 인쇄용 스타일 */
@media print {
    body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
}
```

### Markdown 문서 작성

#### **기본 문법**
```markdown
# 주제목 (H1)

## 부제목 (H2)

### 소제목 (H3)

**굵은 글씨** 또는 __굵은 글씨__

*기울임 글씨* 또는 _기울임 글씨_

~~취소선~~

> 인용문
> 여러 줄 인용문

- 목록 항목 1
- 목록 항목 2
  - 하위 목록

1. 번호 목록 1
2. 번호 목록 2

[링크 텍스트](https://example.com)

![이미지 설명](이미지URL)
```

#### **고급 문법**
```markdown
### 코드 블록
```javascript
function example() {
    console.log("Hello World");
}
```

### 표 만들기
| 헤더1 | 헤더2 | 헤더3 |
|-------|-------|-------|
| 내용1 | 내용2 | 내용3 |
| 내용4 | 내용5 | 내용6 |

### 구분선
---

### 체크리스트
- [x] 완료된 작업
- [ ] 진행중인 작업
- [ ] 예정된 작업
```

## 🎨 디자인 및 스타일링

### 색상 가이드

#### **권장 색상 조합**
```css
/* 비즈니스 문서 */
.business {
    color: #1f2937;
    background: #ffffff;
    accent: #2563eb;
}

/* 학술 문서 */
.academic {
    color: #374151;
    background: #f9fafb;
    accent: #059669;
}

/* 창의적 문서 */
.creative {
    color: #1f2937;
    background: #ffffff;
    accent: #7c3aed;
}
```

#### **색상 사용 팁**
- **고대비**: 검은 글씨에 흰 배경
- **브랜드 색상**: 회사 CI에 맞는 색상 사용
- **인쇄 고려**: CMYK 색상에서도 잘 보이는 색상 선택

### 폰트 가이드

#### **한글 폰트**
```css
/* 권장 폰트 스택 */
font-family: 
    '맑은 고딕',        /* Windows */
    'Apple SD Gothic Neo', /* macOS */
    'Noto Sans KR',      /* 웹폰트 */
    sans-serif;          /* 기본 */
```

#### **영문 폰트**
```css
/* 세리프 (정식 문서) */
font-family: 
    'Times New Roman',
    Georgia,
    serif;

/* 산세리프 (현대적) */
font-family: 
    'Helvetica Neue',
    Arial,
    sans-serif;

/* 코드용 */
font-family: 
    'Consolas',
    'Monaco',
    monospace;
```

### 레이아웃 가이드

#### **기본 레이아웃**
```css
body {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    font-size: 14px;
    line-height: 1.6;
}

h1, h2, h3 {
    margin-top: 2em;
    margin-bottom: 1em;
}

p {
    margin-bottom: 1em;
    text-align: justify;
}
```

#### **반응형 이미지**
```css
img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
```

## 🔧 고급 기능

### 페이지 제어

#### **페이지 나누기**
```html
<!-- HTML -->
<div class="page-break"></div>

<!-- CSS -->
<style>
.page-break {
    page-break-before: always;
}
</style>
```

#### **페이지 나누기 방지**
```html
<!-- 표나 이미지를 페이지 경계에서 분리되지 않게 -->
<div class="avoid-break">
    <table>
        <tr><td>데이터</td></tr>
    </table>
</div>
```

### 특수 기능

#### **QR 코드 삽입**
```html
<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://yourwebsite.com" 
     alt="QR 코드" 
     style="width: 150px; height: 150px;">
```

#### **차트 및 그래프**
```html
<!-- Chart.js 사용 예시 -->
<canvas id="myChart" width="400" height="200"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
// 차트 생성 코드
</script>
```

## 📱 모바일 사용법

### 모바일 브라우저

#### **터치 제스처**
- **스크롤**: 위아래로 드래그
- **확대/축소**: 핀치 제스처
- **텍스트 선택**: 길게 터치 후 드래그

#### **모바일 최적화 팁**
- 텍스트 크기를 충분히 크게 설정
- 버튼 크기를 터치하기 쉽게 조정
- 가로 스크롤이 발생하지 않도록 주의

### 태블릿 사용

#### **더 나은 경험**
- 키보드 연결시 단축키 사용 가능
- 더 큰 화면에서 미리보기 확인
- 멀티태스킹으로 참고 자료와 함께 작업

## 🚨 문제 해결

### 일반적인 문제

#### **PDF가 생성되지 않는 경우**
1. **콘텐츠 확인**: 빈 내용이 아닌지 확인
2. **브라우저 새로고침**: F5 키로 페이지 새로고침
3. **다른 브라우저**: Chrome, Firefox, Safari 등으로 시도
4. **JavaScript 활성화**: 브라우저 설정에서 JavaScript 허용

#### **스타일이 적용되지 않는 경우**
1. **CSS 문법 확인**: 올바른 CSS 문법 사용
2. **인코딩 확인**: UTF-8 인코딩 사용
3. **외부 CSS**: 인터넷 연결이 필요한 외부 CSS 파일 확인

#### **이미지가 표시되지 않는 경우**
1. **이미지 URL**: 접근 가능한 URL인지 확인
2. **이미지 형식**: JPG, PNG, GIF, SVG 지원
3. **파일 크기**: 너무 큰 이미지는 로딩 시간 지연

### 성능 최적화

#### **큰 문서 처리**
- **분할 처리**: 문서를 여러 부분으로 나누어 처리
- **이미지 최적화**: 이미지 크기와 품질 조정
- **불필요한 스타일 제거**: 사용하지 않는 CSS 제거

#### **메모리 사용량 줄이기**
- **브라우저 탭 정리**: 불필요한 탭 닫기
- **확장 프로그램 비활성화**: 일시적으로 확장 프로그램 끄기
- **캐시 정리**: 브라우저 캐시 삭제

## 💡 사용 팁

### 효율적인 작업 방법

#### **템플릿 활용**
```html
<!-- 기본 템플릿 저장 -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>문서 제목</title>
    <style>
        /* 자주 사용하는 스타일 */
    </style>
</head>
<body>
    <!-- 문서 내용 -->
</body>
</html>
```

#### **단축키 활용**
- **Ctrl+A**: 전체 선택
- **Ctrl+C**: 복사
- **Ctrl+V**: 붙여넣기
- **Ctrl+Z**: 실행 취소
- **Ctrl+Y**: 다시 실행

#### **작업 순서**
1. **내용 작성**: 텍스트 먼저 완성
2. **구조 정리**: 제목과 단락 구조화
3. **스타일 적용**: CSS로 디자인 완성
4. **미리보기**: 결과 확인 및 수정
5. **PDF 생성**: 최종 파일 다운로드

### 품질 향상 팁

#### **가독성 개선**
```css
/* 읽기 좋은 텍스트 설정 */
body {
    font-size: 12pt;        /* 인쇄 적합 크기 */
    line-height: 1.5;       /* 줄 간격 */
    text-align: justify;    /* 양쪽 정렬 */
    word-break: keep-all;   /* 한글 단어 분리 방지 */
}
```

#### **전문적인 외관**
```css
/* 비즈니스 문서 스타일 */
h1 {
    font-size: 18pt;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
}

.signature {
    margin-top: 50px;
    text-align: right;
    font-style: italic;
}
```

## 📞 지원 및 도움말

### 추가 도움이 필요한 경우

#### **온라인 리소스**
- **GitHub Repository**: 소스 코드 및 이슈 트래킹
- **사용자 커뮤니티**: 질문과 답변 공유
- **튜토리얼 비디오**: 단계별 사용법 영상

#### **기술 지원**
- **이메일**: support@snipdoc.com
- **응답 시간**: 24-48시간 내
- **지원 언어**: 한국어, 영어

#### **자주 묻는 질문**
1. **Q**: 생성된 PDF의 해상도는?
   **A**: 300 DPI 고해상도로 생성됩니다.

2. **Q**: 상업적 사용이 가능한가요?
   **A**: 네, 제한 없이 상업적 사용 가능합니다.

3. **Q**: 오프라인에서도 사용할 수 있나요?
   **A**: 현재는 인터넷 연결이 필요합니다.

---

*매뉴얼 버전: 1.0*  
*최종 업데이트: 2025년 8월 14일*  
*문의: metavision9988@gmail.com*