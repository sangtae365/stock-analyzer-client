import type {
  StockListResponse,
  StockAnalysisResponse,
  StockDetail,
  StockChartResponse,
  InvestorTrendResponse,
  StockRankingResponse,
  PopularKeywordResponse,
} from '../types/stock';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function fetchAllStocks(page = 0, size = 20): Promise<StockListResponse> {
  const res = await fetch(`${BASE}/stocks?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('종목 조회 실패');
  return res.json();
}

export async function analyzeByKeyword(keyword: string): Promise<StockAnalysisResponse> {
  const res = await fetch(`${BASE}/stocks/analyze?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('분석 실패');
  return res.json();
}

export async function fetchStockDetail(ticker: string): Promise<StockDetail> {
  const res = await fetch(`${BASE}/stocks/${ticker}`);
  if (!res.ok) throw new Error('종목 상세 조회 실패');
  return res.json();
}

export async function fetchStockChart(
  ticker: string,
  startDate: string,
  endDate: string,
  period = 'D'
): Promise<StockChartResponse> {
  const url = `${BASE}/stocks/${ticker}/chart?startDate=${startDate}&endDate=${endDate}&period=${period}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('차트 조회 실패');
  return res.json();
}

export async function fetchInvestorTrend(ticker: string, date: string): Promise<InvestorTrendResponse> {
  const res = await fetch(`${BASE}/stocks/${ticker}/investor-trend?date=${date}`);
  if (!res.ok) throw new Error('투자자동향 조회 실패');
  return res.json();
}

export async function fetchVolumeRanking(market = '0000'): Promise<StockRankingResponse> {
  const res = await fetch(`${BASE}/stocks/ranking/volume?market=${market}`);
  if (!res.ok) throw new Error('거래량 순위 조회 실패');
  return res.json();
}

export async function fetchChangeRateRanking(sort = '0', market = '0000'): Promise<StockRankingResponse> {
  const res = await fetch(`${BASE}/stocks/ranking/change-rate?sort=${sort}&market=${market}`);
  if (!res.ok) throw new Error('등락률 순위 조회 실패');
  return res.json();
}

export async function fetchPopularKeywords(): Promise<PopularKeywordResponse> {
  const res = await fetch(`${BASE}/keywords/popular`);
  if (!res.ok) throw new Error('인기 키워드 조회 실패');
  return res.json();
}
