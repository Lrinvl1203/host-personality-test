import { render, screen, fireEvent } from '@testing-library/react';
import ResultView from '../ResultView';

const mockResult = {
  typeId: 'perfectionist',
  summary: '당신은 꼼꼼한 원칙주의 호스트입니다.',
  title: '철두철미한 원칙주의자',
  reason: '상세한 분석 내용이 여기에 들어갑니다.',
};

describe('ResultView', () => {
  it('isLoading=true 일 때 로딩 메시지를 표시한다', () => {
    render(
      <ResultView result={null} isLoading={true} error={null}
        onRetry={jest.fn()} onReset={jest.fn()} />
    );
    expect(screen.getByText(/분석 중/)).toBeInTheDocument();
  });

  it('에러 상태에서 메시지와 재시도 버튼을 표시한다', () => {
    const onRetry = jest.fn();
    render(
      <ResultView result={null} isLoading={false} error="API 오류가 발생했습니다."
        onRetry={onRetry} onReset={jest.fn()} />
    );
    expect(screen.getByText(/API 오류/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /다시 시도/ }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('결과를 title, summary, reason 모두 표시한다', () => {
    render(
      <ResultView result={mockResult} isLoading={false} error={null}
        onRetry={jest.fn()} onReset={jest.fn()} />
    );
    expect(screen.getByText(mockResult.title)).toBeInTheDocument();
    expect(screen.getByText(mockResult.summary)).toBeInTheDocument();
    expect(screen.getByText(mockResult.reason)).toBeInTheDocument();
  });

  it('결과 화면에서 "다시하기" 버튼 클릭 시 onReset을 호출한다', () => {
    const onReset = jest.fn();
    render(
      <ResultView result={mockResult} isLoading={false} error={null}
        onRetry={jest.fn()} onReset={onReset} />
    );
    fireEvent.click(screen.getByRole('button', { name: /다시하기/ }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
