import type { KeywordDto } from '../types/stock';
import { TrendingUp } from 'lucide-react';

interface Props {
  keywords: KeywordDto[];
  onSelect: (keyword: string) => void;
}

export default function PopularKeywords({ keywords, onSelect }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
        <TrendingUp className="w-3.5 h-3.5" />
        인기 검색
      </span>
      {keywords.slice(0, 7).map(k => (
        <button
          key={k.keyword}
          onClick={() => onSelect(k.keyword)}
          className="px-3 py-1 rounded-full text-xs border border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
        >
          #{k.keyword}
        </button>
      ))}
    </div>
  );
}
