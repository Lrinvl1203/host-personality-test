// types/index.ts
export interface Question {
  id: number;
  situation: string;
  options: string[]; // 항상 3개 (A, B, C)
}

export interface AnalysisResult {
  typeId: string;  // 6개 고정 타입 ID
  summary: string; // 한 줄 요약
  title: string;   // 성향 타이틀
  reason: string;  // 상세 설명 (4~5문장)
}

export type AppState = 'landing' | 'quiz' | 'loading' | 'result' | 'error';
