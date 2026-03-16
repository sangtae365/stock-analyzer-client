# stock-analyzer-client

주식 섹터 키워드를 입력하면 AI가 관련 종목을 **대장주·성장 기대주·소외주**로 분류해주는 서비스의 **프론트엔드 클라이언트**입니다.

🔗 **[라이브 데모 (GitHub Pages)](https://sangtae365.github.io/stock-analyzer-client/)**

> ⚠️ GitHub Pages 데모는 백엔드 없이 동작하여 API 호출이 실패합니다.
> 실제 데이터를 보려면 [백엔드 서버](https://github.com/sangtae365/stock-analyzer-api)를 함께 실행하세요.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Language | TypeScript |
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |

## 주요 기능

- 🔍 **키워드 검색** — 섹터 키워드로 관련 종목 AI 분석
- 📊 **카테고리 분류** — 대장주 / 성장 기대주 / 소외주 카드 뷰
- 🔥 **인기 키워드** — 빠른 검색을 위한 인기 키워드 태그
- 💹 **실시간 등락률** — 상승/하락 색상 구분 표시

## 프로젝트 구조

```
src/
├── api/
│   └── stockApi.ts         # 백엔드 API 호출 함수 (VITE_API_BASE_URL 환경변수 지원)
├── types/
│   └── stock.ts            # TypeScript 타입 정의
├── components/
│   ├── SearchBar.tsx        # 키워드 검색창
│   ├── PopularKeywords.tsx  # 인기 키워드 태그
│   ├── CategorySection.tsx  # 카테고리별 종목 섹션 (대장주/성장기대주/소외주)
│   └── StockCard.tsx        # 개별 종목 카드 (가격, 등락률, AI 요약)
└── App.tsx                  # 메인 페이지 레이아웃
```

## 실행 방법

### 사전 요구사항

- Node.js 18+
- [stock-analyzer-api](https://github.com/sangtae365/stock-analyzer-api) 백엔드 서버 실행 중

### 설치 및 실행

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 빌드

```bash
npm run build
```

### 환경변수 (선택)

백엔드가 `localhost:8080`이 아닌 경우 `.env.local` 파일 생성:

```env
VITE_API_BASE_URL=http://백엔드주소/api
```

## 백엔드 연동 구조

```
브라우저 → localhost:5173/api/... → (Vite proxy) → localhost:8080/api/...
```

## GitHub Pages 배포

`master` 브랜치에 push 시 GitHub Actions가 자동으로 빌드 후 배포합니다.

```
.github/workflows/deploy.yml → Vite build → GitHub Pages
```
