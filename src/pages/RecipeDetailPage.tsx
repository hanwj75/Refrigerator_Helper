import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { requestRecipeDetail } from "@/features/recipes/api";
import { resolveIngredientResponseLanguage, toLanguageIngredients } from "@/features/recipes/ingredientDictionary";
import { getDifficultyLabel } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    seoTitle: "레시피 상세",
    loading: "레시피를 가져오는 중입니다...",
    loadingDescription: "재료와 난이도에 맞는 상세 조리 단계를 준비하고 있습니다.",
    notFound: "상세 레시피를 찾을 수 없습니다.",
    back: "결과로 돌아가기",
    description: "레시피 설명",
    used: "사용 재료",
    required: "추가 필요 재료",
    tips: "요리 팁",
    steps: "조리 순서",
    save: "저장하기",
    vote: "추천하기",
    start: "요리 시작",
    difficulty: "난이도",
    time: "총 조리 시간",
    generatedOnly: "현재 상세 페이지는 생성형 레시피만 지원합니다.",
  },
  en: {
    seoTitle: "Recipe Detail",
    loading: "Fetching recipe details...",
    loadingDescription: "We are preparing the step-by-step recipe that matches your ingredients and difficulty.",
    notFound: "Recipe detail not found.",
    back: "Back to results",
    description: "Description",
    used: "Used ingredients",
    required: "Extra ingredients",
    tips: "Tips",
    steps: "Steps",
    save: "Save recipe",
    vote: "Like recipe",
    start: "Start cooking",
    difficulty: "Difficulty",
    time: "Total cooking time",
    generatedOnly: "This detail page currently supports generated recipes only.",
  },
} as const;

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = useRecipeStore((state) => state.language);
  const selectedIngredients = useRecipeStore((state) => state.selectedIngredients);
  const getGeneratedRecommendationById = useRecipeStore((state) => state.getGeneratedRecommendationById);
  const getGeneratedRecipeDetailById = useRecipeStore((state) => state.getGeneratedRecipeDetailById);
  const setGeneratedRecipeDetail = useRecipeStore((state) => state.setGeneratedRecipeDetail);
  const setSelectedRecipeId = useRecipeStore((state) => state.setSelectedRecipeId);
  const currentCopy = copy[language];

  const generatedRecommendation = id ? getGeneratedRecommendationById(id) : null;
  const generatedDetail = id ? getGeneratedRecipeDetailById(id) : null;
  const responseLanguage = resolveIngredientResponseLanguage(selectedIngredients, language);
  const [message, setMessage] = useState("");

  const detailQuery = useQuery({
    queryKey: [
      "recipe-detail",
      id,
      responseLanguage,
      selectedIngredients.map((tag) => `${tag.id}:${tag.sourceLanguage}`),
    ],
    enabled: Boolean(generatedRecommendation && id && !generatedDetail),
    queryFn: () =>
      requestRecipeDetail({
        recipe_name: generatedRecommendation!.recipe_name,
        difficulty: generatedRecommendation!.difficulty,
        response_language: responseLanguage,
        ingredients_owned: toLanguageIngredients(selectedIngredients, responseLanguage),
        used_ingredients: generatedRecommendation!.used_ingredients,
        required_ingredients: generatedRecommendation!.required_ingredients,
      }),
  });

  useEffect(() => {
    if (id && detailQuery.data && generatedRecommendation) {
      setGeneratedRecipeDetail(id, detailQuery.data, selectedIngredients);
    }
  }, [detailQuery.data, generatedRecommendation, id, selectedIngredients, setGeneratedRecipeDetail]);

  const detailData = useMemo(() => {
    const generated = generatedDetail?.detail ?? detailQuery.data;

    if (!generated || !generatedRecommendation) {
      return null;
    }

    return {
      title: generated.recipe_name,
      description: generatedRecommendation.short_description,
      difficulty: generated.difficulty,
      totalTime: generated.total_cooking_time_minutes,
      usedIngredients: generatedRecommendation.used_ingredients,
      requiredIngredients: generatedRecommendation.required_ingredients,
      tips: generated.tips,
      steps: generated.steps.map((step) => ({
        key: `${generated.recipe_name}-${step.step_order}`,
        order: step.step_order,
        title: step.step_title,
        instruction: step.instruction,
      })),
    };
  }, [detailQuery.data, generatedDetail, generatedRecommendation]);

  if (generatedRecommendation && !detailData && detailQuery.isLoading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <SeoMeta title={currentCopy.seoTitle} description={currentCopy.loadingDescription} />
        <PageTopBar />
        <section className="mt-10 rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_20px_60px_rgba(73,98,56,0.12)]">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
          <h1 className="mt-6 text-2xl font-semibold text-stone-900">{currentCopy.loading}</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{currentCopy.loadingDescription}</p>
        </section>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <SeoMeta title={currentCopy.seoTitle} description={currentCopy.notFound} />
        <PageTopBar />
        <section className="mt-8 rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">{currentCopy.notFound}</h1>
          <button
            type="button"
            onClick={() => navigate("/result")}
            className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.back}
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={detailData.title} description={detailData.description} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">{detailData.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">{detailData.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-800">
              {currentCopy.difficulty}: {getDifficultyLabel(detailData.difficulty, language)}
            </span>
            <span className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
              {currentCopy.time}: {detailData.totalTime}m
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMessage(currentCopy.generatedOnly)}
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
          >
            {currentCopy.save}
          </button>
          <button
            type="button"
            onClick={() => setMessage(currentCopy.generatedOnly)}
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
          >
            {currentCopy.vote}
          </button>
          <button
            type="button"
            onClick={() => {
              if (id) {
                setSelectedRecipeId(id);
              }
              navigate(`/cook/${id}`);
            }}
            className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.start}
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
        <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]">
          <h2 className="text-xl font-semibold text-stone-900">{currentCopy.steps}</h2>
          <div className="mt-5 space-y-4">
            {detailData.steps.map((step) => (
              <div key={step.key} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-brand-700">STEP {step.order}</p>
                <h3 className="mt-2 text-lg font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{step.instruction}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.used}</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
              {detailData.usedIngredients.map((ingredient) => (
                <li key={ingredient}>• {ingredient}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.required}</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
              {detailData.requiredIngredients.length > 0 ? (
                detailData.requiredIngredients.map((ingredient) => <li key={ingredient}>• {ingredient}</li>)
              ) : (
                <li>• -</li>
              )}
            </ul>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)]">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.tips}</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
              {detailData.tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
