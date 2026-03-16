import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import SearchBar from './components/SearchBar';
import PopularKeywords from './components/PopularKeywords';
import CategorySection from './components/CategorySection';
import { analyzeByKeyword, fetchPopularKeywords } from './api/stockApi';
import type { StockAnalysisResponse, KeywordDto } from './types/stock';

export default function App() {
  const [analysis, setAnalysis] = useState<StockAnalysisResponse | null>(null);
  const [keywords, setKeywords] = useState<KeywordDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKeyword, setLastKeyword] = useState('');

  useEffect(() => {
    fetchPopularKeywords()
      .then(res => setKeywords(res.keywords))
      .catch(() => {});
  }, []);

  const handleSearch = async (keyword: string) => {
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
          <span className="text-xs text-slate-400 ml-1">AI 섹터 분석</span>
        </div>
      </header>

      {/* Hero / Search */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">섹터 키워드로 종목 분석</h2>
            <p className="text-sm text-slate-500">AI가 관련 종목을 찾아 대장주·성장 기대주·소외주로 분류합니다</p>
          </div>
          <SearchBar onSearch={handleSearch} loading={loading} />
          {keywords.length > 0 && (
            <PopularKeywords keywords={keywords} onSelect={handleSearch} />
          )}
        </div>
      </section>

      {/* Result */}
      <main className="max-w-6xl mx-auto px-6 py-8">
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
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <BarChart3 className="w-12 h-12" />
            <p className="text-sm">키워드를 입력하면 AI가 관련 종목을 분석해드립니다</p>
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
              <CategorySection key={category.category} category={category} />
            ))}

            {analysis.totalCount === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">
                '{analysis.keyword}'에 해당하는 종목을 찾을 수 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
