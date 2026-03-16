import type {
  StockListResponse,
  StockAnalysisResponse,
  StockDetail,
  PopularKeywordResponse,
} from '../types/stock';

const BASE = '/api';

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

export async function fetchPopularKeywords(): Promise<PopularKeywordResponse> {
  const res = await fetch(`${BASE}/keywords/popular`);
  if (!res.ok) throw new Error('인기 키워드 조회 실패');
  return res.json();
}
