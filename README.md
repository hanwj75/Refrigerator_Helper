# Refrigerator Helper MVP Starter

냉장고 재료 기반 요리 추천 웹앱 MVP를 빠르게 개발 시작하기 위한 초기 세팅입니다.  
현재 단계는 기능 구현 전의 개발 골격만 구성하며, 추후 OpenAI API, Supabase, 저장 기능, 단계별 요리 진행 기능을 붙일 수 있도록 구조를 정리해 둔 상태입니다.

## 포함된 구성

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Zustand
- TanStack Query
- Cloudflare Pages Functions
- Supabase 연결 자리
- ESLint / Prettier

## 폴더 구조

```text
.
├─ functions/
│  └─ health.ts
├─ public/
├─ src/
│  ├─ api/
│  │  └─ client.ts
│  ├─ app/
│  │  ├─ providers.tsx
│  │  └─ router.tsx
│  ├─ components/
│  │  └─ layout/
│  │     └─ AppLayout.tsx
│  ├─ features/
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ env.ts
│  │  └─ supabase.ts
│  ├─ pages/
│  │  ├─ CompletePage.tsx
│  │  ├─ CookingPage.tsx
│  │  ├─ HomePage.tsx
│  │  ├─ RecipeDetailPage.tsx
│  │  ├─ ResultsPage.tsx
│  │  └─ SavedRecipesPage.tsx
│  ├─ store/
│  │  └─ useRecipeStore.ts
│  ├─ styles/
│  │  └─ globals.css
│  ├─ types/
│  │  └─ recipe.ts
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .env.example
├─ eslint.config.js
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ wrangler.toml
```

## 라우트

- `/`
- `/result`
- `/recipe/:id`
- `/cook/:id`
- `/complete`
- `/saved`

## 현재 상태

- 각 페이지는 placeholder 텍스트만 표시합니다.
- `AppLayout`에는 최소 헤더와 라우팅 이동 링크만 있습니다.
- `providers.tsx`에 TanStack Query Provider가 연결되어 있습니다.
- `useRecipeStore.ts`는 최소 Zustand 상태만 정의합니다.
- `env.ts`, `supabase.ts`, `api/client.ts`는 추후 연동을 위한 뼈대만 제공합니다.
- `functions/health.ts`는 Cloudflare Pages Functions용 health check 엔드포인트입니다.

## 설치

```bash
npm install
```

## 실행

```bash
npm run dev
```

Cloudflare Pages 배포 전 로컬에서 Functions까지 함께 보려면 아래 흐름으로 확인할 수 있습니다.

```bash
npm run build
npm run pages:dev
```

`pages:dev`는 `dist`와 `functions`를 함께 읽어 Cloudflare Pages와 유사한 로컬 환경을 띄웁니다.

## Health Check

Cloudflare Pages 배포 또는 Pages 로컬 실행 환경에서 `functions/health.ts`는 보통 아래 URL로 노출됩니다.

```text
/health
```

## 다음 작업 추천

1. `features/` 아래에 재료 입력, 추천 결과, 레시피 상세 UI를 mock 데이터 기반으로 나눕니다.
2. Cloudflare Pages 로컬 개발을 위해 `wrangler pages dev dist` 또는 관련 스크립트를 추가합니다.
3. Supabase 프로젝트가 준비되면 `.env`를 채우고 `supabase.ts`를 실제 연결로 확장합니다.
4. OpenAI 호출 전, Functions 레이어에 API 계약과 에러 포맷을 먼저 정의합니다.

## Cloudflare Pages 배포 전 체크

- build command: `npm run build`
- build output directory: `dist`
- Functions directory: `functions`
- `wrangler.toml`의 `compatibility_date`는 Cloudflare에서 지원하는 현재 또는 과거 날짜여야 함
- 환경변수: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- 로컬 점검 순서: `npm install` -> `npm run build` -> `npm run pages:dev`
