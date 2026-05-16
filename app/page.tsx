'use client';

import { useState, useCallback } from 'react';
import { AppState, AnalysisResult } from '@/types';
import { QUESTIONS } from '@/lib/questions';
import ResultView from '@/components/ResultView';
import { ChevronRight, Home } from 'lucide-react';

export default function Page() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const callAnalyzeAPI = useCallback(async (finalAnswers: number[]) => {
    setAppState('loading');
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? '분석 중 오류가 발생했습니다.');
      }
      const data: AnalysisResult = await res.json();
      setResult(data);
      setAppState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setAppState('error');
    }
  }, []);

  const handleStart = () => {
    setAppState('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setAnimKey((k) => k + 1);
  };

  const handleAnswer = useCallback(async (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (newAnswers.length < QUESTIONS.length) {
      setAnimKey((k) => k + 1);
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    await callAnalyzeAPI(newAnswers);
  }, [answers, callAnalyzeAPI]);

  const handleRetry = useCallback(async () => {
    await callAnalyzeAPI(answers);
  }, [answers, callAnalyzeAPI]);

  const handleReset = () => {
    setAppState('landing');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <main className="min-h-screen flex items-start justify-center p-4 pt-10 pb-16">
      <div className="w-full max-w-md">

        {/* 랜딩 화면 */}
        {appState === 'landing' && (
          <div className="flex flex-col items-center gap-6 py-8 text-center">
            <div className="text-7xl">🏠</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                나는 어떤 호스트일까?
              </h1>
              <p className="text-gray-500 leading-relaxed text-sm">
                숙박업 호스트라면 누구나 마주치는<br />
                10가지 상황으로 알아보는 나의 호스팅 스타일
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 w-full text-center font-medium">
              ✨ 10문항 · 약 2분 소요 · 무료
            </div>
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 active:scale-95 transition-all shadow-md"
            >
              테스트 시작하기
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 퀴즈 화면 */}
        {appState === 'quiz' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                aria-label="처음으로 돌아가기"
                className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Home className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500 font-semibold">
                {currentQuestion + 1} / {QUESTIONS.length}
              </span>
              <div className="w-8" />
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div key={animKey} className="animate-fade-slide-in flex flex-col gap-3">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-2">
                  상황 {currentQuestion + 1}
                </p>
                <p className="text-gray-800 font-semibold text-base leading-relaxed">
                  {QUESTIONS[currentQuestion].situation}
                </p>
              </div>

              {QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98] transition-all shadow-sm text-sm font-medium"
                >
                  <span className="text-amber-500 font-bold mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {(appState === 'loading' || appState === 'result' || appState === 'error') && (
          <ResultView
            result={result}
            isLoading={appState === 'loading'}
            error={appState === 'error' ? error : null}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        )}

      </div>
    </main>
  );
}
