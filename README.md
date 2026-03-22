# Frontend — Stock Analyzer

한국 주식 AI 분석 서비스의 프론트엔드 클라이언트.
키워드 검색 또는 특정 종목명으로 Gemini AI가 관련 종목을 **대장주·성장 기대주·소외주**로 분류하고, 종목 간 **AI 에이전트 토론**을 통해 투자 관점에서 비교 분석합니다.

---

## 기술 스택

| 항목 | 내용 |
|---|---|
| Language | TypeScript |
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |

---

## 실행

```bash
npm install
npm run dev
# → http://localhost:5173
```

백엔드 서버(`localhost:8080`)가 함께 실행 중이어야 합니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 키워드 검색 | 테마 키워드 또는 종목명으로 AI 분석 |
| 예시 키워드 | 검색창 아래 클릭 가능한 예시 키워드 태그 |
| 인기 키워드 | 서버에서 가져온 인기 검색 키워드 (있을 경우) |
| 카테고리 분류 | 대장주 / 성장 기대주 / 소외주 카드 뷰 |
| 시가총액 상위 종목 | 검색 전 기본 화면에 KIS 실시간 시가총액 순위 표시 |
| 종목 상세 모달 | 클릭 시 현재가·PER·PBR·52주 지표·투자자 동향 등 표시 |
| 실시간 순위 탭 | 거래량 순위 / 상승률 순위 / 하락률 순위 조회 |
| AI 토론 탭 | 2~5개 종목 입력 → AI 에이전트 팀이 4라운드 토론 후 점수로 승자 선정 |
| 목업 폴백 | 백엔드 연결 불가 시에도 목업 데이터로 UI 동작 |

---

## 프로젝트 구조

```
src/
├── api/
│   ├── stockApi.ts              # 백엔드 API 호출 함수
│   └── debateApi.ts             # AI 토론 SSE 스트리밍 API
├── types/
│   ├── stock.ts                 # TypeScript 타입 정의
│   └── debate.ts                # 토론 이벤트 타입 정의
├── components/
│   ├── SearchBar.tsx            # 키워드 검색창
│   ├── PopularKeywords.tsx      # 인기 키워드 태그
│   ├── CategorySection.tsx      # 카테고리별 종목 섹션
│   ├── StockCard.tsx            # 개별 종목 카드
│   ├── StockRanking.tsx         # 실시간 순위 탭
│   ├── StockDetailModal.tsx     # 종목 상세 모달
│   ├── DebateSetup.tsx          # AI 토론 종목 입력 폼
│   ├── DebateChat.tsx           # 토론 채팅 UI (라운드별 말풍선)
│   └── DebateConclusion.tsx     # 토론 결론 (점수 바 차트)
└── App.tsx                      # 메인 레이아웃 및 상태 관리
```

---

## 백엔드 연동

Vite 개발 서버의 프록시 설정으로 API 요청을 백엔드로 전달합니다.

```
브라우저 → localhost:5173/api/... → (Vite proxy) → localhost:8080/api/...
```

백엔드 주소가 다를 경우 `vite.config.ts`의 proxy 설정을 수정하세요.

---

## AI 토론 기능

`DebateSetup` → `debateApi.ts` → 백엔드 SSE 스트리밍 → `DebateChat` + `DebateConclusion`

1. 종목명 2~5개 입력 (한국어 이름, 종목코드 불필요)
2. 백엔드 POST 요청 후 SSE 스트리밍으로 실시간 이벤트 수신
3. `loading` 이벤트: 준비 단계 진행 상황 메시지
4. `message` 이벤트: 에이전트 발언을 라운드별 말풍선으로 렌더링
5. `conclusion` 이벤트: 종목별 점수 바 차트 + 종합 요약

| Round | 이름 | 내용 |
|---|---|---|
| 1 | 입장 발표 | 각 종목 지지자가 장점 발표 |
| 2 | 비판적 검토 | 비평가(critic)가 리스크 지적 |
| 3 | 교차 반박 | 지지자들이 상대 종목과 직접 비교·반박 |
| 4 | 최종 평가 | 종합 투자 의견 제시 |

---

## 빌드

```bash
npm run build
# dist/ 폴더에 빌드 결과물 생성
```
