import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { getRecipeMetricsByNames, requestRecipeRecommendations } from "@/features/recipes/api";
import {
  getIngredientTagLabel,
  resolveIngredientResponseLanguage,
  toLanguageIngredients,
} from "@/features/recipes/ingredientDictionary";
import { getDifficultyLabel, getSelectedIngredientSummary, slugifyRecipeName } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    seoTitle: "추천 결과",
    seoDescription: "입력한 재료를 기준으로 바로 만들 수 있는 메뉴를 확인합니다.",
    eyebrow: "추천 결과",
    title: "지금 재료로 가능한 메뉴",
    description: "입력한 재료와 난이도를 기준으로 오늘 바로 만들 수 있는 메뉴 흐름을 정리했습니다.",
    loading: "레시피를 찾는 중입니다...",
    loadingDescription: "입력한 재료를 바탕으로 현실적인 메뉴 후보를 정리하고 있습니다.",
    refresh: "추천 결과 다시받기",
    emptyTitle: "레시피를 찾아보세요!",
    emptyDescription:
      "홈에서 재료를 입력하고 '이 재료로 메뉴 잡아보기' 버튼을 누르면 이 영역에 추천 레시피가 표시됩니다.",
    used: "사용 재료",
    required: "추가 필요 재료",
    time: "예상 조리 시간",
    saves: "저장",
    confidence: "추천",
    difficulty: "난이도",
    selected: "입력한 재료",
  },
  en: {
    seoTitle: "Results",
    seoDescription: "Review meal recommendations based on the ingredients you entered.",
    eyebrow: "Recommendations",
    title: "Meals you can make right now",
    description: "These ideas are organized around your ingredients and chosen difficulty.",
    loading: "Finding recipe ideas...",
    loadingDescription: "We are sorting realistic meal options from the ingredients you entered.",
    refresh: "Refresh recommendations",
    emptyTitle: "Find your next recipe",
    emptyDescription:
      "Recipe results appear here after you add ingredients on the home page and press the main recommendation button.",
    used: "Used ingredients",
    required: "Extra ingredients",
    time: "Estimated time",
    saves: "Saves",
    confidence: "Votes",
    difficulty: "Difficulty",
    selected: "Selected ingredients",
  },
} as const;

export function ResultsPage() {
  const language = useRecipeStore((state) => state.language);
  const selectedIngredients = useRecipeStore((state) => state.selectedIngredients);
  const hasSubmittedRecommendationRequest = useRecipeStore(
    (state) => state.hasSubmittedRecommendationRequest,
  );
  const selectedDifficulty = useRecipeStore((state) => state.selectedDifficulty);
  const generatedRecommendations = useRecipeStore((state) => state.generatedRecommendations);
  const generateRecommendations = useRecipeStore((state) => state.generateRecommendations);
  const setGeneratedRecommendations = useRecipeStore((state) => state.setGeneratedRecommendations);
  const currentCopy = copy[language];

  const validSelectedIngredients = useMemo(
    () =>
      selectedIngredients.filter(
        (tag) => getIngredientTagLabel(tag, "ko").trim() || getIngredientTagLabel(tag, "en").trim(),
      ),
    [selectedIngredients],
  );

  const responseLanguage = resolveIngredientResponseLanguage(validSelectedIngredients, language);
  const requestDifficulty = selectedDifficulty === "any" ? null : selectedDifficulty;
  const shouldShowResults = hasSubmittedRecommendationRequest && validSelectedIngredients.length > 0;

  const recommendationQuery = useQuery({
    queryKey: [
      "recipe-recommendations",
      validSelectedIngredients.map((tag) => `${tag.id}:${tag.sourceLanguage}`),
      requestDifficulty,
      responseLanguage,
      hasSubmittedRecommendationRequest,
    ],
    enabled: shouldShowResults && !!requestDifficulty,
    queryFn: () =>
      requestRecipeRecommendations({
        ingredients_owned: toLanguageIngredients(validSelectedIngredients, responseLanguage),
        difficulty: requestDifficulty!,
        response_language: responseLanguage,
      }),
  });

  useEffect(() => {
    if (recommendationQuery.data?.recipes && generatedRecommendations.length === 0) {
      setGeneratedRecommendations(recommendationQuery.data.recipes);
    }
  }, [generatedRecommendations.length, recommendationQuery.data, setGeneratedRecommendations]);

  const visibleGeneratedRecommendations = useMemo(() => {
    if (generatedRecommendations.length > 0) {
      return generatedRecommendations;
    }

    return [];
  }, [generatedRecommendations]);

  const metricsQuery = useQuery({
    queryKey: ["recipe-metrics", visibleGeneratedRecommendations.map((recipe) => recipe.recipe_name)],
    enabled: visibleGeneratedRecommendations.length > 0,
    queryFn: () =>
      getRecipeMetricsByNames(visibleGeneratedRecommendations.map((recipe) => recipe.recipe_name)),
  });

  const selectedIngredientSummary = getSelectedIngredientSummary(validSelectedIngredients, language);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.seoTitle} description={currentCopy.seoDescription} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">{currentCopy.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-800">
            {currentCopy.selected}: {selectedIngredientSummary || "-"}
          </span>
          <span className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
            {currentCopy.difficulty}: {getDifficultyLabel(selectedDifficulty, language)}
          </span>
          {shouldShowResults ? (
            <button
              type="button"
              onClick={() => {
                generateRecommendations(validSelectedIngredients, selectedDifficulty);
                void recommendationQuery.refetch();
              }}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-brand-300 hover:text-brand-800"
            >
              {currentCopy.refresh}
            </button>
          ) : null}
        </div>
      </section>

      {!shouldShowResults ? (
        <section className="mt-6 rounded-[2rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(73,98,56,0.08)] sm:px-8 sm:py-20">
          <h2 className="text-4xl font-semibold text-stone-900">{currentCopy.emptyTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            {currentCopy.emptyDescription}
          </p>
          <div className="mt-14 flex items-center justify-center gap-12 sm:gap-20">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-14 w-14 rounded-full border-[5px] border-stone-900/80 bg-white"
              />
            ))}
          </div>
        </section>
      ) : null}

      {shouldShowResults && recommendationQuery.isLoading ? (
        <section className="mt-6 rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_18px_50px_rgba(73,98,56,0.1)]">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
          <p className="mt-5 text-lg font-semibold text-stone-900">{currentCopy.loading}</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{currentCopy.loadingDescription}</p>
        </section>
      ) : null}

      {shouldShowResults ? (
        <div className="mt-6 grid gap-4">
          {visibleGeneratedRecommendations.map((recipe) => {
            const metrics = metricsQuery.data?.[slugifyRecipeName(recipe.recipe_name)] ?? {
              total_save_count: 0,
              total_vote_count: 0,
            };

            return (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(73,98,56,0.16)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-stone-900">{recipe.recipe_name}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                      {recipe.short_description}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800">
                    {getDifficultyLabel(recipe.difficulty, language)}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-800">{currentCopy.used}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {recipe.used_ingredients.join(", ")}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-800">{currentCopy.required}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {recipe.required_ingredients.length > 0 ? recipe.required_ingredients.join(", ") : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
                  <span className="rounded-full border border-stone-200 px-4 py-2">
                    {currentCopy.time}: {recipe.cooking_time_minutes}m
                  </span>
                  <span className="rounded-full border border-stone-200 px-4 py-2">
                    {currentCopy.saves}: {metrics.total_save_count}
                  </span>
                  <span className="rounded-full border border-stone-200 px-4 py-2">
                    {currentCopy.confidence}: {metrics.total_vote_count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
