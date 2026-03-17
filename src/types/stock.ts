// ── 기본 종목 ─────────────────────────────────────────────────────────────
export interface Stock {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
  marketCap: number;
  sector: string;
}

export interface StockListResponse {
  totalCount: number;
  page: number;
  size: number;
  stocks: Stock[];
}

// ── 키워드 분석 ───────────────────────────────────────────────────────────
export interface AnalyzedStock {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
  summary: string;
}

export interface Category {
  category: string;
  stocks: AnalyzedStock[];
}

export interface StockAnalysisResponse {
  keyword: string;
  analyzedAt: string;
  totalCount: number;
  categories: Category[];
}

// ── 종목 상세 (강화) ──────────────────────────────────────────────────────
export interface StockDetail {
  // 기본 정보
  ticker: string;
  name: string;
  sector: string;
  marketName: string | null;

  // 실시간 시세
  currentPrice: number;
  changeAmount: number;
  changeRate: number;
  changeSign: string | null;    // 1:상한 2:상승 3:보합 4:하락 5:하한
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  upperLimitPrice: number;
  lowerLimitPrice: number;
  volume: number;
  amount: number;

  // 시가총액 / 기업 지표
  marketCap: number;
  per: number;
  pbr: number;
  eps: number;
  bps: number;
  listedShares: number;
  faceValue: number;
  fiscalMonth: string | null;
  volumeTurnover: number;

  // 52주 고저가
  w52HighPrice: number;
  w52HighPriceDate: string | null;
  w52HighPriceRate: number;
  w52LowPrice: number;
  w52LowPriceDate: string | null;
  w52LowPriceRate: number;

  // 연중 고저가
  yearHighPrice: number;
  yearHighPriceDate: string | null;
  yearHighPriceRate: number;
  yearLowPrice: number;
  yearLowPriceDate: string | null;
  yearLowPriceRate: number;

  // 외국인
  foreignExhaustionRate: number;
  foreignNetBuyQty: number;

  // 융자
  loanRatio: number;

  // 종목 상태
  statusCode: string | null;
  marketWarnCode: string | null;
  viCode: string | null;
  shortSellAvailable: boolean;

  // 피벗 포인트
  pivotPoint: number;
  pivot1Resist: number;
  pivot1Support: number;
}

// ── 차트 ─────────────────────────────────────────────────────────────────
export interface ChartCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
  exDivCode: string | null;
}

export interface ChartSummary {
  currentPrice: number;
  changeRate: number;
  changeAmount: number;
  volume: number;
  marketCapBil: number;
  per: number;
  pbr: number;
  eps: number;
  listedShares: number;
  capital: number;
  faceValue: number;
  volumeTurnover: number;
}

export interface StockChartResponse {
  ticker: string;
  name: string;
  period: string;
  summary: ChartSummary;
  candles: ChartCandle[];
}

// ── 투자자매매동향 ─────────────────────────────────────────────────────────
export interface InvestorDailyData {
  date: string;
  closePrice: number;
  volume: number;
  amount: number;

  // 순매수 수량
  foreignNetQty: number;
  personNetQty: number;
  instNetQty: number;
  securitiesNetQty: number;
  trustNetQty: number;
  peFundNetQty: number;
  bankNetQty: number;
  insuranceNetQty: number;
  pensionNetQty: number;
  etcCorpNetQty: number;

  // 순매수 금액 (백만원)
  foreignNetAmt: number;
  personNetAmt: number;
  instNetAmt: number;
  securitiesNetAmt: number;
  trustNetAmt: number;
  peFundNetAmt: number;
  bankNetAmt: number;
  insuranceNetAmt: number;
  pensionNetAmt: number;
  etcCorpNetAmt: number;
}

export interface InvestorTrendResponse {
  ticker: string;
  date: string;
  summary: { currentPrice: number; changeRate: number; volume: number };
  dailyData: InvestorDailyData[];
}

// ── 순위 ─────────────────────────────────────────────────────────────────
export interface RankedStock {
  rank: number;
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  changeAmount: number;
  volume: number;
  totalAmount: number;
  volumeIncRate: number;
  consecutiveRiseDays: number;
  consecutiveFallDays: number;
}

export interface StockRankingResponse {
  rankType: string;
  sortBy: string;
  stocks: RankedStock[];
}

// ── 키워드 ────────────────────────────────────────────────────────────────
export interface KeywordDto {
  rank: number;
  keyword: string;
  searchCount: number;
}

export interface PopularKeywordResponse {
  keywords: KeywordDto[];
}
