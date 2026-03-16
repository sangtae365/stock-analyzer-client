import type { AnalyzedStock } from '../types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  stock: AnalyzedStock;
  onClick?: () => void;
}

export default function StockCard({ stock, onClick }: Props) {
  const isUp = stock.changeRate >= 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{stock.name}</p>
          <p className="text-xs text-slate-400">{stock.ticker}</p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isUp ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%
        </div>
      </div>
      <p className="text-base font-bold text-slate-900 mb-2">
        {stock.price.toLocaleString()}원
      </p>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{stock.summary}</p>
    </div>
  );
}
