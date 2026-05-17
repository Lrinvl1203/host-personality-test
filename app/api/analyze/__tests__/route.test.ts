/**
 * @jest-environment node
 */
import { POST } from '../route';
import { NextRequest } from 'next/server';

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: JSON.stringify({
          typeId: 'perfectionist',
          summary: '당신은 꼼꼼한 원칙주의 호스트입니다.',
          title: '철두철미한 원칙주의자',
          reason: '4~5문장의 상세 분석 내용입니다.',
        }),
      }),
    },
  })),
}));

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/analyze', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  it('answers 필드가 없으면 400을 반환한다', async () => {
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('answers 길이가 10이 아니면 400을 반환한다', async () => {
    const req = makeRequest({ answers: [0, 1, 2] });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('유효한 10개 답변으로 200과 결과 JSON을 반환한다', async () => {
    const req = makeRequest({ answers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('summary');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('reason');
  });

  it('answers가 배열이 아니면 400을 반환한다', async () => {
    const req = makeRequest({ answers: 'not-an-array' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
