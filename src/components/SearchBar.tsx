import { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (keyword: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="섹터 키워드를 입력하세요 (예: AI, 카카오, 반도체)"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '분석 중...' : '분석'}
      </button>
    </form>
  );
}
