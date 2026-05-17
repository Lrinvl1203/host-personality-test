'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnalysisResult } from '@/types';
import { HOST_TYPES } from '@/lib/host-types';
import { RefreshCw, Share2, Loader2, Copy, Check } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onReset: () => void;
}

export default function ResultView({ result, isLoading, error, onRetry, onReset }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const characterSrc = result
    ? `/characters/${HOST_TYPES.find((t) => t.id === result.typeId) ? result.typeId : 'angel'}.png`
    : null;

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(section);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard unavailable — silent fail
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const shareText = `🏠 나의 호스팅 스타일: ${result.title}\n\n${result.summary}\n\n호스트 성향 테스트 해보기`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: '나의 호스팅 스타일', text: shareText });
      } catch {
        // 사용자 취소 시 무시
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('결과가 클립보드에 복사되었습니다!');
      } catch {
        alert('공유 기능을 사용할 수 없는 환경입니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-gray-700 text-base font-semibold">당신의 호스팅 스타일을 분석 중입니다...</p>
        <p className="text-gray-400 text-sm">Gemini AI가 열심히 분석하고 있어요</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="text-5xl">😓</div>
        <div>
          <p className="text-gray-700 font-semibold mb-1">분석 중 문제가 발생했어요</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="mt-2 px-8 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-sm"
        >
          다시 시도하기
        </button>
        <button
          onClick={onReset}
          className="text-gray-400 text-sm hover:text-gray-600 underline underline-offset-2"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* 결과 헤더 카드 */}
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center shadow-sm">
        <button
          onClick={() => copyToClipboard(`${result.title}\n\n${result.summary}`, 'header')}
          aria-label="결과 복사"
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-amber-600 hover:bg-amber-100 transition-colors"
        >
          {copied === 'header' ? (
            <><Check className="w-3.5 h-3.5" />복사됨!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" />복사</>
          )}
        </button>
        <div className="flex justify-center mb-3">
          {characterSrc ? (
            <Image
              src={characterSrc}
              alt={result.title}
              width={140}
              height={140}
              className="drop-shadow-md"
            />
          ) : (
            <div className="text-5xl">🏠</div>
          )}
        </div>
        <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">
          나의 호스팅 스타일
        </p>
        <h2 className="text-xl font-bold text-gray-800 mb-3">{result.title}</h2>
        <p className="text-gray-700 leading-relaxed text-sm font-medium">{result.summary}</p>
      </div>

      {/* 상세 분석 카드 */}
      <div className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            상세 분석
          </h3>
          <button
            onClick={() => copyToClipboard(result.reason, 'reason')}
            aria-label="상세 분석 복사"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-100 transition-colors"
          >
            {copied === 'reason' ? (
              <><Check className="w-3.5 h-3.5" />복사됨!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" />복사</>
            )}
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">{result.reason}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-3 pt-1">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          결과 공유하기
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          테스트 다시하기
        </button>
      </div>
    </div>
  );
}
