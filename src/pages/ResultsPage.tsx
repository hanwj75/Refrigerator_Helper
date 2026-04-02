import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { getRecommendedRecipes, getRecipeIngredientGroups, getLocalizedText, getIngredientLabel, getDifficultyLabel, getRecipeById } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "추천 결과",
    title: "입력한 재료로 만들기 좋은 메뉴",
    description: "선택한 재료와 난이도를 바탕으로 바로 시작하기 좋은 mock 추천 결과를 정리했습니다.",
    selectedIngredients: "선택 재료",
    selectedDifficulty: "선택 난이도",
    usedIngredients: "사용 재료",
    neededIngredients: "추가 필요 재료",
    cookingTime: "예상 조리 시간",
    saves: "저장",
    confidence: "신뢰도",
    emptyTitle: "아직 추천할 재료 조합이 없습니다",
    emptyDescription: "홈에서 재료를 입력한 뒤 메뉴 추천 버튼을 눌러 주세요.",
    viewDetail: "상세 보기",
    home: "홈으로",
  },
  en: {
    eyebrow: "Results",
    title: "Meal ideas that fit what you entered",
    description: "These mock recommendations are ranked from your ingredients and selected difficulty.",
    selectedIngredients: "Selected ingredients",
    selectedDifficulty: "Selected difficulty",
    usedIngredients: "Used ingredients",
    neededIngredients: "Extra ingredients",
    cookingTime: "Cooking time",
    saves: "Saved",
    confidence: "Confidence",
    emptyTitle: "No recommendation context yet",
    emptyDescription: "Go back home, add ingredients, and start the meal flow.",
    viewDetail: "View detail",
    home: "Back home",
  },
} as const;

export function ResultsPage() {
  const language = useRecipeStore((state) => state.language);
  const selectedIngredients = useRecipeStore((state) => state.selectedIngredients);
  const selectedDifficulty = useRecipeStore((state) => state.selectedDifficulty);
  const recommendedRecipeIds = useRecipeStore((state) => state.recommendedRecipeIds);
  const setSelectedRecipeId = useRecipeStore((state) => state.setSelectedRecipeId);
  const currentCopy = copy[language];

  const recipes =
    recommendedRecipeIds.length > 0
      ? recommendedRecipeIds
          .map((id) => getRecipeById(id))
          .filter((recipe): recipe is NonNullable<ReturnType<typeof getRecipeById>> => recipe !== null)
      : getRecommendedRecipes(selectedIngredients, selectedDifficulty);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.description} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] backdrop-blur sm:p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">{currentCopy.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">{currentCopy.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-800">
            {currentCopy.selectedIngredients}:{" "}
            {selectedIngredients.length > 0 ? selectedIngredients.join(", ") : "-"}
          </span>
          <span className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
            {currentCopy.selectedDifficulty}: {getDifficultyLabel(selectedDifficulty, language)}
          </span>
        </div>
      </section>

      {recipes.length === 0 ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-stone-900">{currentCopy.emptyTitle}</h2>
          <p className="mt-3 text-sm text-stone-600">{currentCopy.emptyDescription}</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.home}
          </Link>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          {recipes.map((recipe) => {
            const { usedIngredients, neededIngredients } = getRecipeIngredientGroups(
              recipe,
              selectedIngredients,
            );

            return (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                onClick={() => setSelectedRecipeId(recipe.id)}
                className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)] transition hover:-translate-y-0.5 hover:border-brand-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-brand-700">
                      {getDifficultyLabel(recipe.difficulty, language)}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                      {getLocalizedText(recipe.title, language)}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {getLocalizedText(recipe.summary, language)}
                    </p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700">
                    {recipe.cookingTimeMinutes} min
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-brand-50/70 p-4">
                    <p className="text-sm font-semibold text-brand-800">{currentCopy.usedIngredients}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      {usedIngredients.length > 0
                        ? usedIngredients.map((ingredient) => getIngredientLabel(ingredient, language)).join(", ")
                        : "-"}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-800">{currentCopy.neededIngredients}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      {neededIngredients.length > 0
                        ? neededIngredients
                            .map((ingredient) => getIngredientLabel(ingredient, language))
                            .join(", ")
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-600">
                  <span className="rounded-full border border-stone-200 px-3 py-2">
                    {currentCopy.cookingTime}: {recipe.cookingTimeMinutes} min
                  </span>
                  <span className="rounded-full border border-stone-200 px-3 py-2">
                    {currentCopy.saves}: {recipe.saves}
                  </span>
                  <span className="rounded-full border border-stone-200 px-3 py-2">
                    {currentCopy.confidence}: {recipe.confidence}%
                  </span>
                </div>

                <div className="mt-6 inline-flex rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
                  {currentCopy.viewDetail}
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
