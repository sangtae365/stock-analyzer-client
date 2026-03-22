import { useState } from 'react';
import { Plus, Trash2, Swords } from 'lucide-react';

interface Props {
  onStart: (stocks: string[]) => void;
  loading: boolean;
}

export default function DebateSetup({ onStart, loading }: Props) {
  const [stocks, setStocks] = useState<string[]>(['', '']);

  const handleChange = (index: number, value: string) => {
    setStocks(prev => prev.map((s, i) => (i === index ? value : s)));
  };

  const handleAdd = () => {
    setStocks(prev => [...prev, '']);
  };

  const handleRemove = (index: number) => {
    if (stocks.length <= 2) return;
    setStocks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const filled = stocks.map(s => s.trim()).filter(Boolean);
    if (filled.length < 2) return;
    onStart(filled);
  };

  const isReady = stocks.filter(s => s.trim()).length >= 2;

  const EXAMPLES = [
    ['네오셈', '두산테스나'],
    ['삼성전자', 'SK하이닉스'],
    ['카카오', '네이버'],
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">AI 주식 토론</h2>
        <p className="text-sm text-slate-500">
          비교하고 싶은 종목을 입력하면 AI 에이전트가 4라운드 토론 후 승자를 가립니다
        </p>
      </div>

      {/* 종목 입력 */}
      <div className="space-y-2">
        {stocks.map((stock, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 w-14 shrink-0">
              종목 {i + 1}
            </span>
            <input
              type="text"
              value={stock}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && isReady && handleSubmit()}
              placeholder={i === 0 ? '예: 네오셈' : i === 1 ? '예: 두산테스나' : '종목명 입력'}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              onClick={() => handleRemove(i)}
              disabled={stocks.length <= 2}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-0 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 종목 추가 버튼 */}
      {stocks.length < 5 && (
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          종목 추가
        </button>
      )}

      {/* 토론 시작 */}
      <button
        onClick={handleSubmit}
        disabled={!isReady || loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Swords className="w-4 h-4" />
        {loading ? 'AI 토론 준비 중...' : '토론 시작'}
      </button>

      {/* 예시 버튼 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400">예시:</span>
        {EXAMPLES.map(pair => (
          <button
            key={pair.join('+')}
            onClick={() => {
              setStocks(pair);
            }}
            className="px-3 py-1 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
          >
            {pair.join(' vs ')}
          </button>
        ))}
      </div>
    </div>
  );
}
