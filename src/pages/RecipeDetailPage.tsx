import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { getDifficultyLabel, getIngredientAmount, getIngredientLabel, getLocalizedText, getRecipeById, getRecipeIngredientGroups } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "레시피 상세",
    startCooking: "요리 시작",
    saveRecipe: "레시피 저장",
    saved: "저장됨",
    usedIngredients: "바로 활용 가능한 재료",
    neededIngredients: "추가로 준비하면 좋은 재료",
    steps: "조리 단계",
    missingTitle: "레시피를 찾을 수 없습니다",
    backToResults: "결과로 돌아가기",
  },
  en: {
    eyebrow: "Recipe Detail",
    startCooking: "Start cooking",
    saveRecipe: "Save recipe",
    saved: "Saved",
    usedIngredients: "Ingredients you already have",
    neededIngredients: "Ingredients to add",
    steps: "Cooking steps",
    missingTitle: "Recipe not found",
    backToResults: "Back to results",
  },
} as const;

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = useRecipeStore((state) => state.language);
  const selectedIngredients = useRecipeStore((state) => state.selectedIngredients);
  const saveRecipe = useRecipeStore((state) => state.saveRecipe);
  const setSelectedRecipeId = useRecipeStore((state) => state.setSelectedRecipeId);
  const recipe = id ? getRecipeById(id) : null;
  const currentCopy = copy[language];
  const [saveMessage, setSaveMessage] = useState("");

  const ingredientGroups = useMemo(
    () =>
      recipe ? getRecipeIngredientGroups(recipe, selectedIngredients) : { usedIngredients: [], neededIngredients: [] },
    [recipe, selectedIngredients],
  );

  if (!recipe) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <SeoMeta title={currentCopy.missingTitle} description={currentCopy.missingTitle} />
        <PageTopBar />
        <section className="mt-8 rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">{currentCopy.missingTitle}</h1>
          <Link
            to="/result"
            className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.backToResults}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta
        title={getLocalizedText(recipe.title, language)}
        description={getLocalizedText(recipe.description, language)}
      />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
              {getLocalizedText(recipe.title, language)}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              {getLocalizedText(recipe.description, language)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-800">
              {getDifficultyLabel(recipe.difficulty, language)}
            </span>
            <span className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
              {recipe.cookingTimeMinutes} min
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedRecipeId(recipe.id);
              navigate(`/cook/${recipe.id}`);
            }}
            className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.startCooking}
          </button>
          <button
            type="button"
            onClick={() => {
              const didSave = saveRecipe(recipe.id);
              setSaveMessage(didSave ? currentCopy.saved : currentCopy.saved);
            }}
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
          >
            {currentCopy.saveRecipe}
          </button>
          {saveMessage ? <p className="self-center text-sm text-brand-700">{saveMessage}</p> : null}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
        <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]">
          <h2 className="text-xl font-semibold text-stone-900">{currentCopy.steps}</h2>
          <div className="mt-5 space-y-4">
            {recipe.steps.map((step) => (
              <article key={step.id} className="rounded-[1.5rem] bg-stone-50 p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-brand-700">
                  STEP {step.order}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-stone-900">
                  {getLocalizedText(step.title, language)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {getLocalizedText(step.instruction, language)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-brand-100 bg-brand-50/70 p-6">
            <h2 className="text-lg font-semibold text-brand-900">{currentCopy.usedIngredients}</h2>
            <div className="mt-4 space-y-3">
              {ingredientGroups.usedIngredients.length > 0 ? (
                ingredientGroups.usedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="rounded-[1.25rem] bg-white px-4 py-3">
                    <p className="font-medium text-stone-900">
                      {getIngredientLabel(ingredient, language)}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {getIngredientAmount(ingredient, language) ?? "-"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-600">-</p>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.neededIngredients}</h2>
            <div className="mt-4 space-y-3">
              {ingredientGroups.neededIngredients.length > 0 ? (
                ingredientGroups.neededIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="rounded-[1.25rem] bg-stone-50 px-4 py-3">
                    <p className="font-medium text-stone-900">
                      {getIngredientLabel(ingredient, language)}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {getIngredientAmount(ingredient, language) ?? "-"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-600">-</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
