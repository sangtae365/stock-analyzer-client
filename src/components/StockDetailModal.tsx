import { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchStockDetail } from '../api/stockApi';
import type { StockDetail } from '../types/stock';

interface Props {
  ticker: string;
  onClose: () => void;
}

function fmt(n: number) { return n.toLocaleString('ko-KR'); }
function fmtRate(n: number) { return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; }
function fmtDate(d: string | null) {
  if (!d || d.length < 8) return d ?? '-';
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
}

function ChangeSign({ sign, rate }: { sign: string | null; rate: number }) {
  if (sign === '1') return <span className="text-red-600 font-bold">상한</span>;
  if (sign === '5') return <span className="text-blue-600 font-bold">하한</span>;
  if (rate > 0) return <span className="flex items-center gap-0.5 text-red-500"><TrendingUp className="w-3 h-3" />{fmtRate(rate)}</span>;
  if (rate < 0) return <span className="flex items-center gap-0.5 text-blue-500"><TrendingDown className="w-3 h-3" />{fmtRate(rate)}</span>;
  return <span className="flex items-center gap-0.5 text-slate-400"><Minus className="w-3 h-3" />0.00%</span>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 w-28">{label}</span>
      <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{title}</h4>
      {children}
    </div>
  );
}

export default function StockDetailModal({ ticker, onClose }: Props) {
  const [detail, setDetail] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStockDetail(ticker)
      .then(setDetail)
      .catch(() => setError('종목 상세 조회 실패'))
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-start justify-between rounded-t-2xl">
          {detail ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-lg">{detail.name}</span>
                {detail.marketName && (
                  <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">{detail.marketName}</span>
                )}
              </div>
              <span className="text-xs text-slate-400">{detail.ticker} · {detail.sector}</span>
            </div>
          ) : (
            <span className="text-slate-600 font-medium">{ticker}</span>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm">불러오는 중...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!loading && detail && (
            <>
              {/* 현재가 하이라이트 */}
              <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{fmt(detail.currentPrice)}원</p>
                  <p className={`text-sm font-medium mt-0.5 ${detail.changeRate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {detail.changeAmount >= 0 ? '+' : ''}{fmt(detail.changeAmount)}원
                    {' · '}
                    <ChangeSign sign={detail.changeSign} rate={detail.changeRate} />
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400 space-y-0.5">
                  <p>시가총액 <span className="text-slate-700 font-medium">{fmt(Math.round(detail.marketCap / 100_000_000))}억</span></p>
                  <p>거래량 <span className="text-slate-700 font-medium">{fmt(detail.volume)}</span></p>
                </div>
              </div>

              {/* 종목 상태 배지 */}
              {(detail.statusCode || detail.viCode || detail.marketWarnCode) && (
                <div className="flex flex-wrap gap-1.5">
                  {detail.statusCode === '58' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">거래정지</span>}
                  {detail.statusCode === '51' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">관리종목</span>}
                  {detail.statusCode === '52' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">투자위험</span>}
                  {detail.statusCode === '53' && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">투자경고</span>}
                  {detail.statusCode === '54' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">투자주의</span>}
                  {detail.statusCode === '59' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">단기과열</span>}
                  {detail.viCode && detail.viCode !== '0' && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">VI발동</span>}
                  {!detail.shortSellAvailable && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">공매도불가</span>}
                </div>
              )}

              {/* 당일 시세 */}
              <Section title="당일 시세">
                <Row label="시가"        value={`${fmt(detail.openPrice)}원`} />
                <Row label="고가"        value={`${fmt(detail.highPrice)}원`} />
                <Row label="저가"        value={`${fmt(detail.lowPrice)}원`} />
                <Row label="상한가"      value={`${fmt(detail.upperLimitPrice)}원`} />
                <Row label="하한가"      value={`${fmt(detail.lowerLimitPrice)}원`} />
                <Row label="거래대금"    value={`${fmt(Math.round(detail.amount / 1_000_000))}백만원`} />
                <Row label="거래량 회전율" value={`${detail.volumeTurnover.toFixed(2)}%`} />
              </Section>

              {/* 52주 / 연중 고저가 */}
              <Section title="52주 / 연중 고저가">
                <Row label="52주 최고가" value={
                  <span>{fmt(detail.w52HighPrice)}원 <span className="text-slate-400">({fmtDate(detail.w52HighPriceDate)})</span></span>
                } />
                <Row label="52주 최고 대비" value={<span className={detail.w52HighPriceRate <= 0 ? 'text-blue-500' : 'text-red-500'}>{fmtRate(detail.w52HighPriceRate)}</span>} />
                <Row label="52주 최저가" value={
                  <span>{fmt(detail.w52LowPrice)}원 <span className="text-slate-400">({fmtDate(detail.w52LowPriceDate)})</span></span>
                } />
                <Row label="52주 최저 대비" value={<span className={detail.w52LowPriceRate >= 0 ? 'text-red-500' : 'text-blue-500'}>{fmtRate(detail.w52LowPriceRate)}</span>} />
                <Row label="연중 최고가" value={
                  <span>{fmt(detail.yearHighPrice)}원 <span className="text-slate-400">({fmtDate(detail.yearHighPriceDate)})</span></span>
                } />
                <Row label="연중 최저가" value={
                  <span>{fmt(detail.yearLowPrice)}원 <span className="text-slate-400">({fmtDate(detail.yearLowPriceDate)})</span></span>
                } />
              </Section>

              {/* 투자 지표 */}
              <Section title="투자 지표">
                <Row label="PER"      value={detail.per > 0 ? detail.per.toFixed(2) : '-'} />
                <Row label="PBR"      value={detail.pbr > 0 ? detail.pbr.toFixed(2) : '-'} />
                <Row label="EPS"      value={detail.eps > 0 ? `${fmt(Math.round(detail.eps))}원` : '-'} />
                <Row label="BPS"      value={detail.bps > 0 ? `${fmt(Math.round(detail.bps))}원` : '-'} />
                <Row label="액면가"   value={detail.faceValue > 0 ? `${fmt(detail.faceValue)}원` : '-'} />
                <Row label="상장주수" value={detail.listedShares > 0 ? `${fmt(detail.listedShares)}주` : '-'} />
                <Row label="결산월"   value={detail.fiscalMonth ?? '-'} />
              </Section>

              {/* 외국인 / 수급 */}
              <Section title="수급 정보">
                <Row label="외국인 소진율"    value={`${detail.foreignExhaustionRate.toFixed(2)}%`} />
                <Row label="외국인 순매수"    value={`${fmt(detail.foreignNetBuyQty)}주`} />
                <Row label="융자잔고비율"     value={`${detail.loanRatio.toFixed(2)}%`} />
              </Section>

              {/* 피벗 포인트 */}
              {detail.pivotPoint > 0 && (
                <Section title="피벗 포인트">
                  <Row label="피벗"    value={`${fmt(Math.round(detail.pivotPoint))}원`} />
                  <Row label="1차 저항" value={<span className="text-red-500">{fmt(Math.round(detail.pivot1Resist))}원</span>} />
                  <Row label="1차 지지" value={<span className="text-blue-500">{fmt(Math.round(detail.pivot1Support))}원</span>} />
                </Section>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
