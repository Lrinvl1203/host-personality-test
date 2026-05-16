# 🏠 숙박업 호스트 성향 테스트

숙박업 호스트라면 누구나 마주치는 10가지 상황에 대한 답변을 선택하면, Gemini AI가 당신의 호스팅 스타일을 분석해 드립니다.

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 GEMINI_API_KEY 입력

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `GEMINI_API_KEY` | ✅ | [Google AI Studio](https://aistudio.google.com)에서 발급 |

## 기술 스택

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Icons**: Lucide React

## 앱 흐름

```
랜딩 → 퀴즈 (10문항) → 로딩 → 결과 카드 + 공유
```

## 테스트

```bash
npm test           # 전체 테스트 (12개)
npm run test:watch # 워치 모드
```

## 빌드

```bash
npm run build
```
