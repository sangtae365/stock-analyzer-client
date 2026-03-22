import type { Category } from '../types/stock';
import StockCard from './StockCard';
import { Crown, Rocket, Eye } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; badge: string }> = {
  '대장주':     { icon: <Crown className="w-4 h-4" />,  color: 'text-amber-600 bg-amber-50 border-amber-200',  badge: 'bg-amber-100 text-amber-700' },
  '성장 기대주': { icon: <Rocket className="w-4 h-4" />, color: 'text-violet-600 bg-violet-50 border-violet-200', badge: 'bg-violet-100 text-violet-700' },
  '소외주':     { icon: <Eye className="w-4 h-4" />,    color: 'text-slate-600 bg-slate-50 border-slate-200',  badge: 'bg-slate-100 text-slate-600' },
};

interface Props {
  category: Category;
  onSelectTicker?: (ticker: string, name: string) => void;
}

export default function CategorySection({ category, onSelectTicker }: Props) {
  const config = CATEGORY_CONFIG[category.category] ?? {
    icon: null,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    badge: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className={`rounded-2xl border p-5 ${config.color}`}>
      <div className="flex items-center gap-2 mb-4">
        {config.icon}
        <h3 className="font-bold text-base">{category.category}</h3>
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
          {category.stocks.length}개 종목
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {category.stocks.map(stock => (
          <StockCard key={stock.ticker} stock={stock} onClick={() => onSelectTicker?.(stock.ticker, stock.name)} />
        ))}
      </div>
    </div>
  );
}
