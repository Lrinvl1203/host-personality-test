import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { QUESTIONS } from '@/lib/questions';

const SYSTEM_PROMPT = `당신은 숙박업 전문가이자 예리한 심리 분석가입니다.
사용자가 숙박업 호스트로서 맞이한 10가지 상황에 대한 답변을 바탕으로 이 사람의 호스트 성향을 분석해 주세요.

[분석 지침]
1. 사용자의 답변 패턴(친절함, 단호함, 원칙주의, 효율성, 수익성 등)을 종합하여 핵심 성향을 파악하세요.
2. 전문적이지만 흥미를 유발하는 친근한 톤앤매너를 유지하세요.
3. 결과는 반드시 아래의 JSON 형식으로만 출력해야 합니다. 마크다운 백틱 없이 순수 JSON 객체만 반환하세요.

[출력 JSON Schema]
{
  "summary": "성향을 한 줄로 요약한 문장 (예: 당신은 정과 배려가 넘치지만 때로는 피곤해지기 쉬운 '천사표' 호스트입니다.)",
  "title": "성향 타이틀 (예: 꼼꼼한 철통방어 원칙주의자)",
  "reason": "강점과 주의점 포함 4~5문장 상세 설명"
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: '10개의 답변이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const userAnswersText = QUESTIONS.map((q, i) => {
      const selectedOption = q.options[answers[i]] ?? '(선택 없음)';
      return `${i + 1}. ${q.situation}\n   → ${selectedOption}`;
    }).join('\n');

    const prompt = `${SYSTEM_PROMPT}\n\n[사용자 답변 데이터]\n${userAnswersText}`;

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text ?? '';

    let result: { summary?: string; title?: string; reason?: string };
    try {
      result = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'AI 응답 파싱에 실패했습니다. 다시 시도해 주세요.' },
        { status: 500 }
      );
    }

    if (!result.summary || !result.title || !result.reason) {
      return NextResponse.json(
        { error: 'AI 응답 형식이 올바르지 않습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[analyze] API error:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
}
