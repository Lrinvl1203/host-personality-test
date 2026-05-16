import { QUESTIONS } from '../questions';

describe('QUESTIONS 데이터', () => {
  it('정확히 10개의 질문이어야 한다', () => {
    expect(QUESTIONS).toHaveLength(10);
  });

  it('각 질문은 정확히 3개의 선택지를 가져야 한다', () => {
    QUESTIONS.forEach((q) => {
      expect(q.options).toHaveLength(3);
    });
  });

  it('각 질문의 situation은 비어있지 않아야 한다', () => {
    QUESTIONS.forEach((q) => {
      expect(q.situation.length).toBeGreaterThan(0);
    });
  });

  it('질문 id는 1부터 10까지 순서대로여야 한다', () => {
    QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
    });
  });
});
