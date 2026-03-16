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

export interface StockDetail extends Stock {
  aiAnalysis: string;
  relatedKeywords: string[];
}

export interface KeywordDto {
  rank: number;
  keyword: string;
  searchCount: number;
}

export interface PopularKeywordResponse {
  keywords: KeywordDto[];
}
