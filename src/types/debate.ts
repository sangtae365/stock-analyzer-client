export interface DebateMessageEvent {
  type: 'message';
  agentName: string;
  agentRole: 'advocate' | 'critic';
  targetStock: string;
  round: number;
  roundName: string;
  message: string;
}

export interface ScoreDto {
  name: string;
  ticker: string;
  score: number;
  reason: string;
}

export interface DebateConclusionEvent {
  type: 'conclusion';
  scores: ScoreDto[];
  summary: string;
}

export interface DebateDoneEvent {
  type: 'done';
}

export interface DebateLoadingEvent {
  type: 'loading';
  message: string;
}

export interface DebateErrorEvent {
  type: 'error';
  message: string;
}

export type DebateEvent =
  | DebateMessageEvent
  | DebateConclusionEvent
  | DebateDoneEvent
  | DebateLoadingEvent
  | DebateErrorEvent;
