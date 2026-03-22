import type { ScoreDto } from '../types/debate';

interface Props {
  scores: ScoreDto[];
  summary: string;
}

const BAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
];

export default function DebateConclusion({ scores, summary }: Props) {
  const winner = scores.reduce((a, b) => (a.score >= b.score ? a : b));

  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🏆</span>
        <h3 className="font-bold text-slate-800">토론 결과</h3>
        <span className="ml-auto text-xs font-semibold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full">
          {winner.name} 우세
        </span>
      </div>

      {/* 점수 바 */}
      <div className="space-y-3">
        {scores.map((score, i) => (
          <div key={score.name} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">{score.name}</span>
              <span className="font-bold text-slate-800">{score.score}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ width: `${score.score}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{score.reason}</p>
          </div>
        ))}
      </div>

      {/* 종합 요약 */}
      <div className="border-t border-violet-200 pt-4">
        <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
