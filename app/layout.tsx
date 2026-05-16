import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '호스팅 스타일 테스트 🏠',
  description: '나는 어떤 숙박업 호스트일까? 10가지 상황으로 알아보는 나의 호스팅 성향 테스트',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-stone-50 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
