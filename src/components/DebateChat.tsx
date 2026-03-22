import { useEffect, useRef } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import type { DebateMessageEvent } from '../types/debate';

interface Props {
  messages: DebateMessageEvent[];
  stocks: string[];
  loading: boolean;
  loadingStep?: string;
}

const ADVOCATE_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200', name: 'text-blue-700', bubble: 'bg-blue-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', name: 'text-emerald-700', bubble: 'bg-emerald-600' },
  { bg: 'bg-orange-50', border: 'border-orange-200', name: 'text-orange-700', bubble: 'bg-orange-600' },
  { bg: 'bg-pink-50', border: 'border-pink-200', name: 'text-pink-700', bubble: 'bg-pink-600' },
];

const CRITIC_STYLE = {
  bg: 'bg-slate-50',
  border: 'border-slate-200',
  name: 'text-slate-600',
  bubble: 'bg-slate-500',
};

const ROUND_LABELS: Record<number, string> = {
  1: '입장 발표',
  2: '비판적 검토',
  3: '교차 반박',
  4: '최종 평가',
};

export default function DebateChat({ messages, stocks, loading, loadingStep }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 종목명 → 색상 인덱스 매핑
  const stockColorMap = Object.fromEntries(
    stocks.map((name, i) => [name, ADVOCATE_COLORS[i % ADVOCATE_COLORS.length]])
  );

  const getStyle = (msg: DebateMessageEvent) =>
    msg.agentRole === 'critic'
      ? CRITIC_STYLE
      : (stockColorMap[msg.targetStock] ?? ADVOCATE_COLORS[0]);

  // 라운드 구분선이 필요한지 확인
  const renderedRounds = new Set<number>();

  return (
    <div className="space-y-1">
      {messages.map((msg, i) => {
        const style = getStyle(msg);
        const isNewRound = !renderedRounds.has(msg.round);
        if (isNewRound) renderedRounds.add(msg.round);

        return (
          <div key={i}>
            {/* 라운드 구분선 */}
            {isNewRound && (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400 px-2">
                  Round {msg.round} · {ROUND_LABELS[msg.round] ?? msg.roundName}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            )}

            {/* 말풍선 */}
            <div className={`flex gap-3 p-3 rounded-xl border ${style.bg} ${style.border} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {/* 아바타 */}
              <div className={`w-7 h-7 rounded-full ${style.bubble} flex items-center justify-center shrink-0 mt-0.5`}>
                <span className="text-white text-xs font-bold">
                  {msg.agentRole === 'critic' ? '검' : msg.agentName.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className={`text-xs font-semibold ${style.name}`}>{msg.agentName}</span>
                <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{msg.message}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* 로딩 인디케이터 */}
      {loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500 shrink-0" />
          {loadingStep || (messages.length > 0 ? '다음 발언 준비 중...' : 'AI 에이전트 준비 중...')}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
