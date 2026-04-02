import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { getLocalizedText, getRecipeById } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "저장 목록",
    title: "저장한 레시피",
    emptyTitle: "아직 저장한 레시피가 없습니다",
    emptyDescription: "상세 페이지나 완료 페이지에서 저장한 레시피가 여기 모입니다.",
    cookAgain: "다시 요리하기",
    detail: "상세 보기",
  },
  en: {
    eyebrow: "Saved",
    title: "Saved recipes",
    emptyTitle: "No saved recipes yet",
    emptyDescription: "Recipes saved from the detail or complete page will appear here.",
    cookAgain: "Cook again",
    detail: "View detail",
  },
} as const;

export function SavedRecipesPage() {
  const language = useRecipeStore((state) => state.language);
  const savedRecipeIds = useRecipeStore((state) => state.savedRecipeIds);
  const setSelectedRecipeId = useRecipeStore((state) => state.setSelectedRecipeId);
  const currentCopy = copy[language];

  const savedRecipes = savedRecipeIds
    .map((id) => getRecipeById(id))
    .filter((recipe): recipe is NonNullable<ReturnType<typeof getRecipeById>> => recipe !== null);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.emptyDescription} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
      </section>

      {savedRecipes.length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-stone-900">{currentCopy.emptyTitle}</h2>
          <p className="mt-3 text-sm text-stone-600">{currentCopy.emptyDescription}</p>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          {savedRecipes.map((recipe) => (
            <article
              key={recipe.id}
              className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]"
            >
              <h2 className="text-2xl font-semibold text-stone-900">
                {getLocalizedText(recipe.title, language)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {getLocalizedText(recipe.summary, language)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/cook/${recipe.id}`}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
                >
                  {currentCopy.cookAgain}
                </Link>
                <Link
                  to={`/recipe/${recipe.id}`}
                  onClick={() => setSelectedRecipeId(recipe.id)}
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
