# Refrigerator Helper

Refrigerator Helper is a React + Vite + TypeScript project for turning ingredients already at home into realistic meal ideas and step-by-step cooking guidance. The app currently supports mock browsing flows, Supabase-ready save and vote foundations, and server-side OpenAI recipe generation through Cloudflare Pages Functions.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- TanStack Query
- Cloudflare Pages Functions
- Supabase
- OpenAI Responses API
- Zod

## Local development

```bash
npm install
npm run dev
```

For a Cloudflare Pages style local run:

```bash
npm run build
npm run pages:dev
```

## Environment variables

Create a local `.env` file and fill these values:

```bash
VITE_APP_NAME=Refrigerator Helper
VITE_API_BASE_URL=http://localhost:8788
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
```

Notes:

- `VITE_SUPABASE_URL` is your Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY` is the browser-safe publishable key from Supabase.
- Do not put the Supabase `service_role` key in frontend code.
- `OPENAI_API_KEY` must stay server-side only.
- `OPENAI_MODEL` is optional and defaults to `gpt-4o-mini` when omitted.

For local `wrangler pages dev`, you can also put the server-only values in `.dev.vars`:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

In production, set the same server-only variables in the Cloudflare Pages project settings.

## Supabase setup

### 1. Run the SQL schema

Run the full SQL in [supabase/schema.sql](./supabase/schema.sql) inside the Supabase SQL Editor.

The script creates only these tables:

- `profiles`
- `recipes`
- `saved_recipes`
- `recipe_votes`

It also creates:

- indexes for search and sorting
- an `updated_at` trigger for `recipes`
- a trigger to create `profiles` rows when users sign up
- triggers to maintain `recipes.total_save_count` and `recipes.total_vote_count`
- RLS policies for each table

### 2. Enable Google auth provider

In the Supabase dashboard:

1. Go to `Authentication -> Providers`
2. Enable `Google`
3. Add your Google OAuth client ID and client secret

### 3. Configure Google OAuth redirect URLs

There are two places to configure redirects:

1. In Supabase:
   Go to `Authentication -> URL Configuration`
2. In Google Cloud Console:
   Add the same redirect URLs to your OAuth client

Common redirect URLs:

- Local: `http://localhost:5173`
- Production: your deployed site origin
- Supabase callback: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

The frontend currently sends users back to:

```text
window.location.origin + "/"
```

### 4. Seed recipe data

The schema is ready for saved recipes and votes, but those features require actual rows in `public.recipes`.

Important:

- saved recipes and votes reference `recipes.id`
- the current UI still uses local mock recipe content for browsing
- if you want saved recipes and votes to line up with the current mock UI, seed the same recipe IDs into `public.recipes`

## RLS policy summary

### `profiles`

- users can read only their own profile
- users can update only their own profile
- normal clients do not insert profiles directly
- profiles are created by an auth trigger

### `recipes`

- everyone can read recipes
- public clients cannot insert, update, or delete recipes
- writes are reserved for future admin or server-side flows

### `saved_recipes`

- signed-in users can read only their own saved recipes
- signed-in users can insert only their own saved recipe rows
- signed-in users can delete only their own saved recipe rows

### `recipe_votes`

- signed-in users can read only their own vote rows
- signed-in users can insert only their own vote rows
- signed-in users can delete only their own vote rows

## Auth and recipe APIs

Frontend Supabase integration includes:

- `src/lib/supabase.ts`
- `src/features/auth/api.ts`
- `src/features/auth/hooks.ts`
- `src/features/auth/components/GoogleLoginButton.tsx`
- `src/features/recipes/api.ts`
- `src/features/recipes/types.ts`

Prepared auth functions:

- Google sign-in
- sign-out
- current session lookup
- auth state change subscription
- current user state sync through Zustand

Prepared recipe functions:

- `saveRecipe(recipeId)`
- `unsaveRecipe(recipeId)`
- `upvoteRecipe(recipeId)`
- `removeVote(recipeId)`
- `getMySavedRecipes()`
- `getMyVotes()`

These functions only write to:

- `saved_recipes`
- `recipe_votes`

Recipe counts are updated by database triggers, not by frontend code.

## OpenAI recipe APIs

The project includes Cloudflare Pages Functions that call the OpenAI API only on the server side.

Endpoints:

- `POST /api/recommend`
- `POST /api/recipe-detail`

Implementation files:

- `functions/api/recommend.ts`
- `functions/api/recipe-detail.ts`
- `functions/_shared/openai.ts`
- `functions/_shared/http.ts`
- `functions/_shared/prompts.ts`
- `functions/_shared/schemas.ts`
- `src/features/recipes/api.ts`
- `src/features/recipes/types.ts`

### Recommendation request

```json
{
  "ingredients_owned": ["김치", "밥", "계란"],
  "difficulty": "간단",
  "excluded_ingredients": ["땅콩"],
  "max_cooking_time_minutes": 20,
  "servings": 2,
  "cuisine_preference": "한식"
}
```

### Recommendation response

```json
{
  "recipes": [
    {
      "recipe_name": "김치볶음밥",
      "difficulty": "간단",
      "used_ingredients": ["김치", "밥", "계란"],
      "required_ingredients": ["대파"],
      "cooking_time_minutes": 15,
      "short_description": "남은 김치와 밥으로 빠르게 만들 수 있는 한 끼 메뉴입니다.",
      "confidence_note": "추가 재료 1개 필요"
    }
  ]
}
```

### Recipe detail request

```json
{
  "recipe_name": "김치볶음밥",
  "difficulty": "간단",
  "ingredients_owned": ["김치", "밥", "계란"],
  "used_ingredients": ["김치", "밥", "계란"],
  "required_ingredients": ["대파"]
}
```

### Recipe detail response

```json
{
  "recipe_name": "김치볶음밥",
  "difficulty": "간단",
  "total_cooking_time_minutes": 15,
  "tips": ["찬밥을 쓰면 식감이 더 잘 살아납니다."],
  "steps": [
    {
      "step_order": 1,
      "step_title": "재료 준비",
      "instruction": "김치 1컵은 잘게 썰고 대파 1/2대는 송송 썬다. 계란 1개는 가볍게 풀어 둔다.",
      "timer_seconds": null
    }
  ]
}
```

### Validation behavior

- OpenAI responses are requested with `json_schema` format through the Responses API.
- Returned content is parsed strictly as JSON and validated again with Zod at runtime.
- If the model returns non-JSON content or a payload that does not match the schema, the API returns a structured failure response.
- This stage does not write generated recipes into the database.

## Current behavior

- guests can still browse home, results, recipe detail, and cooking pages
- signed-in users can save recipes and record recommendations once Supabase is configured and recipe rows exist
- OpenAI recipe generation runs only through Cloudflare Pages Functions

## Next UI integration steps

1. Replace mock recommendation loading in `ResultsPage` with `requestRecipeRecommendations`.
2. Replace mock detail loading in `RecipeDetailPage` with `requestRecipeDetail`.
3. Upsert generated recipes into `public.recipes` only when the user saves or recommends a recipe later.
