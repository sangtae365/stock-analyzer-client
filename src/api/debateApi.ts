import type { DebateEvent } from '../types/debate';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function startDebate(
  stocks: string[],
  onEvent: (event: DebateEvent) => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const res = await fetch(`${BASE}/debate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stocks }),
    });

    if (!res.ok || !res.body) {
      throw new Error('토론 시작에 실패했습니다.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const json = line.slice(5).trim();
          if (json) {
            try {
              onEvent(JSON.parse(json) as DebateEvent);
            } catch {
              // malformed event 무시
            }
          }
        }
      }
    }
  } catch (err) {
    onError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
  }
}
