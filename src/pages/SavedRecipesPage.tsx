import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useAuthState } from "@/features/auth/hooks";
import { getMySavedRecipes } from "@/features/recipes/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "저장됨",
    title: "저장한 레시피",
    emptyTitle: "아직 저장한 레시피가 없습니다",
    emptyDescription: "로그인 후 저장한 레시피가 이 목록에 표시됩니다.",
    cookAgain: "다시 요리하기",
    detail: "상세 보기",
    loginRequired: "저장한 레시피를 보려면 Google 로그인 후 이용해 주세요.",
    notConfigured: "Supabase 설정이 아직 완료되지 않았습니다.",
    loading: "저장한 레시피를 불러오는 중입니다...",
  },
  en: {
    eyebrow: "Saved",
    title: "Saved recipes",
    emptyTitle: "No saved recipes yet",
    emptyDescription: "Recipes you save after signing in will appear here.",
    cookAgain: "Cook again",
    detail: "View detail",
    loginRequired: "Sign in with Google to view your saved recipes.",
    notConfigured: "Supabase is not configured yet.",
    loading: "Loading your saved recipes...",
  },
} as const;

export function SavedRecipesPage() {
  const { authUser } = useAuthState();
  const language = useRecipeStore((state) => state.language);
  const syncSavedRecipeIds = useRecipeStore((state) => state.syncSavedRecipeIds);
  const setSelectedRecipeId = useRecipeStore((state) => state.setSelectedRecipeId);
  const currentCopy = copy[language];

  const savedRecipesQuery = useQuery({
    queryKey: ["my-saved-recipes", authUser?.id],
    queryFn: getMySavedRecipes,
    enabled: Boolean(authUser) && isSupabaseConfigured(),
  });

  useEffect(() => {
    if (!savedRecipesQuery.data) {
      return;
    }

    syncSavedRecipeIds(savedRecipesQuery.data.map((entry) => entry.recipe_id));
  }, [savedRecipesQuery.data, syncSavedRecipeIds]);

  const savedRecipes = useMemo(
    () =>
      (savedRecipesQuery.data ?? []).map((entry) => ({
        recipeId: entry.recipe_id,
        title: entry.recipe?.name ?? "Recipe",
        description: entry.recipe?.description ?? "Saved recipe from your Supabase project.",
      })),
    [savedRecipesQuery.data],
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.emptyDescription} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
      </section>

      {!authUser ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-stone-900">{currentCopy.title}</h2>
          <p className="mt-3 text-sm text-stone-600">{currentCopy.loginRequired}</p>
        </section>
      ) : !isSupabaseConfigured() ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-stone-900">{currentCopy.title}</h2>
          <p className="mt-3 text-sm text-stone-600">{currentCopy.notConfigured}</p>
        </section>
      ) : savedRecipesQuery.isLoading ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <p className="text-sm text-stone-600">{currentCopy.loading}</p>
        </section>
      ) : savedRecipes.length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-stone-900">{currentCopy.emptyTitle}</h2>
          <p className="mt-3 text-sm text-stone-600">{currentCopy.emptyDescription}</p>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          {savedRecipes.map((recipe) => (
            <article
              key={recipe.recipeId}
              className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]"
            >
              <h2 className="text-2xl font-semibold text-stone-900">{recipe.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{recipe.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/cook/${recipe.recipeId}`}
                  onClick={() => setSelectedRecipeId(recipe.recipeId)}
                  className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
                >
                  {currentCopy.cookAgain}
                </Link>
                <Link
                  to={`/recipe/${recipe.recipeId}`}
                  onClick={() => setSelectedRecipeId(recipe.recipeId)}
                  className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
                >
                  {currentCopy.detail}
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
