# 🛠️ SnipDoc 설치 가이드

## 📋 시스템 요구사항

### 최소 요구사항
- **Node.js**: 14.x 이상
- **npm**: 6.x 이상  
- **메모리**: 2GB RAM
- **저장공간**: 500MB
- **OS**: Windows 10, macOS 10.14, Ubuntu 18.04 이상

### 권장 요구사항
- **Node.js**: 18.x LTS
- **npm**: 8.x 이상
- **메모리**: 4GB RAM
- **저장공간**: 1GB
- **브라우저**: Chrome 90+, Firefox 88+, Safari 14+

## 🚀 로컬 설치 (개발/테스트)

### 1. 저장소 복제
```bash
git clone https://github.com/metavision9988/SnipDoc.git
cd SnipDoc
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 애플리케이션 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 4. 브라우저 접속
```
http://localhost:3000
```

## 🧪 테스트 실행

### 전체 테스트 실행
```bash
npm test
```

### 커버리지 포함 테스트
```bash
npm run test:coverage
```

### Watch 모드 테스트
```bash
npm run test:watch
```

## 🐳 Docker 설치

### Dockerfile 생성
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 애플리케이션 실행
CMD ["npm", "start"]
```

### Docker 이미지 빌드
```bash
docker build -t snipdoc .
```

### Docker 컨테이너 실행
```bash
docker run -p 3000:3000 snipdoc
```

## 🌐 배포 가이드

### Heroku 배포

#### 1. Heroku CLI 설치
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows (Chocolatey)
choco install heroku-cli

# Ubuntu
sudo snap install --classic heroku
```

#### 2. Heroku 앱 생성
```bash
heroku login
heroku create your-app-name
```

#### 3. 환경 변수 설정
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

#### 4. 배포
```bash
git push heroku main
```

### Vercel 배포

#### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

#### 2. 배포
```bash
vercel --prod
```

#### 3. vercel.json 설정
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### AWS EC2 배포

#### 1. EC2 인스턴스 생성
- **AMI**: Ubuntu 20.04 LTS
- **Instance Type**: t3.micro (프리티어)
- **Security Group**: 3000 포트 오픈

#### 2. 서버 설정
```bash
# SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git 설치
sudo apt-get install git

# 프로젝트 클론
git clone https://github.com/metavision9988/SnipDoc.git
cd SnipDoc

# 의존성 설치
npm install --production

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# 애플리케이션 실행
pm2 start src/server.js --name "snipdoc"
pm2 startup
pm2 save
```

#### 3. Nginx 설정 (선택사항)
```bash
# Nginx 설치
sudo apt-get install nginx

# 설정 파일 생성
sudo nano /etc/nginx/sites-available/snipdoc
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 설정 활성화
sudo ln -s /etc/nginx/sites-available/snipdoc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 환경 설정

### 환경 변수

#### .env 파일 생성
```env
# 서버 설정
PORT=3000
NODE_ENV=production

# 보안 설정
SESSION_SECRET=your-secret-key-here

# 데이터베이스 (향후 확장용)
# DATABASE_URL=postgresql://user:password@localhost:5432/snipdoc

# 외부 서비스 (향후 확장용)
# REDIS_URL=redis://localhost:6379
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 프로덕션 최적화 설정

#### package.json 스크립트 추가
```json
{
  "scripts": {
    "start": "NODE_ENV=production node src/server.js",
    "dev": "NODE_ENV=development nodemon src/server.js",
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "build": "echo 'No build step required'",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

## 📊 모니터링 설정

### PM2 모니터링
```bash
# 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs snipdoc

# 메모리/CPU 모니터링
pm2 monit

# 재시작
pm2 restart snipdoc
```

### 헬스체크 설정
```bash
# 헬스체크 스크립트
curl -f http://localhost:3000/api/health || exit 1

# 크론탭에 등록 (5분마다)
*/5 * * * * curl -f http://localhost:3000/api/health || echo "Service down" | mail -s "SnipDoc Alert" admin@yourcompany.com
```

## 🛡️ 보안 설정

### HTTPS 설정 (Let's Encrypt)
```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo crontab -e
# 추가: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 방화벽 설정
```bash
# UFW 활성화
sudo ufw enable

# 필요한 포트만 오픈
sudo ufw allow 22   # SSH
sudo ufw allow 80   # HTTP
sudo ufw allow 443  # HTTPS

# 상태 확인
sudo ufw status
```

## 🔄 업데이트 가이드

### 애플리케이션 업데이트
```bash
# 최신 코드 가져오기
git pull origin main

# 의존성 업데이트
npm install

# 테스트 실행
npm test

# 서비스 재시작
pm2 restart snipdoc
```

### 롤백 방법
```bash
# 이전 버전으로 롤백
git log --oneline  # 커밋 확인
git checkout <previous-commit>

# 서비스 재시작
pm2 restart snipdoc
```

## 🚨 문제 해결

### 일반적인 문제

#### Node.js 버전 문제
```bash
# Node.js 버전 확인
node --version

# nvm으로 버전 관리
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 권한 문제
```bash
# npm 권한 문제
sudo chown -R $(whoami) ~/.npm

# 포트 권한 문제 (1024 이하 포트)
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```

#### 메모리 부족
```bash
# Node.js 메모리 증가
node --max-old-space-size=4096 src/server.js

# PM2로 메모리 제한 설정
pm2 start src/server.js --name "snipdoc" --max-memory-restart 500M
```

### 로그 분석
```bash
# 애플리케이션 로그
pm2 logs snipdoc

# 시스템 로그
sudo journalctl -u nginx
sudo tail -f /var/log/nginx/error.log

# 디스크 사용량 확인
df -h
du -sh /path/to/snipdoc/
```

## 📞 지원

### 문제 신고
- **GitHub Issues**: https://github.com/metavision9988/SnipDoc/issues
- **이메일**: metavision9988@gmail.com

### 커뮤니티
- **기술 지원**: GitHub Discussions
- **사용자 가이드**: README.md 및 USER_MANUAL.md

---

*설치 가이드 버전: 1.0*  
*최종 업데이트: 2025년 8월 14일*