import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, LayoutList, TrendingUp } from 'lucide-react';
import SearchBar from './components/SearchBar';
import PopularKeywords from './components/PopularKeywords';
import CategorySection from './components/CategorySection';
import StockCard from './components/StockCard';
import StockRanking from './components/StockRanking';
import StockDetailModal from './components/StockDetailModal';
import { analyzeByKeyword, fetchAllStocks, fetchPopularKeywords } from './api/stockApi';
import type { StockAnalysisResponse, KeywordDto, Stock } from './types/stock';

type Tab = 'analyze' | 'ranking';

const EXAMPLE_KEYWORDS = ['AI', '반도체', '2차전지', '바이오', '방산', '로봇', '게임', '금융', '자동차', '리노공업'];

export default function App() {
  const [tab, setTab] = useState<Tab>('analyze');
  const [analysis, setAnalysis] = useState<StockAnalysisResponse | null>(null);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [allStocksLoading, setAllStocksLoading] = useState(true);
  const [keywords, setKeywords] = useState<KeywordDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKeyword, setLastKeyword] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  useEffect(() => {
    fetchAllStocks(0, 30)
      .then(res => setAllStocks(res.stocks))
      .catch(() => {})
      .finally(() => setAllStocksLoading(false));
    fetchPopularKeywords()
      .then(res => setKeywords(res.keywords))
      .catch(() => {});
  }, []);

  const handleSearch = async (keyword: string) => {
    setTab('analyze');
    setLoading(true);
    setError(null);
    setLastKeyword(keyword);
    try {
      const result = await analyzeByKeyword(keyword);
      setAnalysis(result);
    } catch {
      setError('분석 중 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-violet-600" />
          <h1 className="text-lg font-bold text-slate-800">StockAnalyzer</h1>
          <span className="text-xs text-slate-400 ml-1">KIS 실시간 시세</span>

          {/* Tab */}
          <div className="ml-auto flex gap-1">
            <button
              onClick={() => setTab('analyze')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === 'analyze' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              키워드 분석
            </button>
            <button
              onClick={() => setTab('ranking')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === 'ranking' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              실시간 순위
            </button>
          </div>
        </div>
      </header>

      {/* Search (항상 노출) */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">섹터 키워드로 종목 분석</h2>
            <p className="text-sm text-slate-500">AI가 관련 종목을 찾아 대장주·성장 기대주·소외주로 분류합니다</p>
          </div>
          <SearchBar onSearch={handleSearch} loading={loading} />
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-slate-400">예시:</span>
            {EXAMPLE_KEYWORDS.map(kw => (
              <button
                key={kw}
                onClick={() => handleSearch(kw)}
                className="px-3 py-1 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
              >
                #{kw}
              </button>
            ))}
          </div>
          {keywords.length > 0 && (
            <PopularKeywords keywords={keywords} onSelect={handleSearch} />
          )}
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* 실시간 순위 탭 */}
        {tab === 'ranking' && (
          <StockRanking onSelectTicker={setSelectedTicker} />
        )}

        {/* 키워드 분석 탭 */}
        {tab === 'analyze' && (
          <>
            {loading && (
              <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin text-violet-500" />
                <p className="text-sm">'{lastKeyword}' 관련 종목 분석 중...</p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
                {error}
              </div>
            )}

            {!loading && !error && !analysis && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-violet-500" />
                  <h2 className="text-sm font-bold text-slate-700">시가총액 상위 종목</h2>
                  {allStocksLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />}
                </div>
                {!allStocksLoading && allStocks.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allStocks.map(s => (
                      <StockCard
                        key={s.ticker}
                        stock={{ ticker: s.ticker, name: s.name, price: s.price, changeRate: s.changeRate, summary: '' }}
                        onClick={() => setSelectedTicker(s.ticker)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && analysis && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    '{analysis.keyword}' 분석 결과
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    총 {analysis.totalCount}개 종목 · {new Date(analysis.analyzedAt).toLocaleString('ko-KR')}
                  </p>
                </div>

                {analysis.categories.map(category => (
                  <CategorySection
                    key={category.category}
                    category={category}
                    onSelectTicker={setSelectedTicker}
                  />
                ))}

                {analysis.totalCount === 0 && (
                  <div className="text-center py-16 text-slate-400 text-sm">
                    '{analysis.keyword}'에 해당하는 종목을 찾을 수 없습니다.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* 종목 상세 모달 */}
      {selectedTicker && (
        <StockDetailModal
          ticker={selectedTicker}
          onClose={() => setSelectedTicker(null)}
        />
      )}
    </div>
  );
}
