import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { fetchVolumeRanking, fetchChangeRateRanking } from '../api/stockApi';
import type { StockRankingResponse, RankedStock } from '../types/stock';

interface Props {
  onSelectTicker?: (ticker: string, name: string) => void;
}

type RankTab = 'volume' | 'rise' | 'fall';
type Market = '0000' | '0001' | '1001';

function fmt(n: number) { return n.toLocaleString('ko-KR'); }
function fmtB(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(0) + 'M';
  return fmt(n);
}

export default function StockRanking({ onSelectTicker }: Props) {
  const [tab, setTab] = useState<RankTab>('volume');
  const [market, setMarket] = useState<Market>('0000');
  const [data, setData] = useState<StockRankingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [tab, market]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: StockRankingResponse;
      if (tab === 'volume') {
        result = await fetchVolumeRanking(market);
      } else {
        result = await fetchChangeRateRanking(tab === 'fall' ? '1' : '0', market);
      }
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      {/* Controls */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-50 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">실시간 순위</h3>
          <button
            onClick={load}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab */}
        <div className="flex gap-1">
          {([['volume', '거래량'], ['rise', '상승률'], ['fall', '하락률']] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                tab === t ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Market */}
        <div className="flex gap-1">
          {([['0000', '전체'], ['0001', 'KOSPI'], ['1001', 'KOSDAQ']] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={`flex-1 text-xs py-1 rounded-lg transition-colors ${
                market === m ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-50">
        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span className="text-xs">불러오는 중...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 px-4 py-4 text-xs text-amber-700 bg-amber-50">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">실전투자 계좌가 필요한 API입니다</p>
              <p className="text-amber-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && data?.stocks.map(stock => (
          <RankRow
            key={stock.ticker}
            stock={stock}
            rankType={tab}
            onClick={() => onSelectTicker?.(stock.ticker, stock.name)}
          />
        ))}

        {!loading && !error && data?.stocks.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-8">데이터 없음</p>
        )}
      </div>
    </div>
  );
}

function RankRow({
  stock,
  rankType,
  onClick,
}: {
  stock: RankedStock;
  rankType: RankTab;
  onClick: () => void;
}) {
  const isUp = stock.changeRate >= 0;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      {/* 순위 */}
      <span className={`text-sm font-bold w-5 text-center shrink-0 ${stock.rank <= 3 ? 'text-violet-600' : 'text-slate-400'}`}>
        {stock.rank}
      </span>

      {/* 종목 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{stock.name}</p>
        <p className="text-xs text-slate-400">{stock.ticker}</p>
      </div>

      {/* 가격 / 등락 */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-900">{fmt(stock.currentPrice)}</p>
        <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${isUp ? 'text-red-500' : 'text-blue-500'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%
        </p>
      </div>

      {/* 부가 정보 */}
      <div className="text-right text-xs text-slate-400 shrink-0 w-16">
        {rankType === 'volume' ? (
          <>
            <p>{fmtB(stock.volume)}</p>
            {stock.volumeIncRate > 0 && <p className="text-violet-500">+{stock.volumeIncRate.toFixed(0)}%</p>}
          </>
        ) : (
          <>
            {stock.consecutiveRiseDays > 1 && <p className="text-red-400">{stock.consecutiveRiseDays}일 상승</p>}
            {stock.consecutiveFallDays > 1 && <p className="text-blue-400">{stock.consecutiveFallDays}일 하락</p>}
          </>
        )}
      </div>
    </div>
  );
}
