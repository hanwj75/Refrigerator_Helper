import { useState } from "react";
import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "완료",
    title: "요리가 완료되었습니다",
    description:
      "마지막 단계까지 진행했습니다. 홈으로 돌아가거나 저장 목록을 확인할 수 있습니다.",
    save: "저장하기",
    home: "홈으로 돌아가기",
    savedList: "저장 목록 보기",
    fallback: "최근 완료한 생성형 레시피를 찾지 못했습니다.",
    generatedSessionOnly: "생성형 레시피 저장은 아직 지원하지 않습니다.",
  },
  en: {
    eyebrow: "Complete",
    title: "Cooking complete!",
    description:
      "You reached the end of the cooking flow. You can go back home or open your saved recipes.",
    save: "Save recipe",
    home: "Back to home",
    savedList: "View saved recipes",
    fallback: "No recently completed generated recipe was found.",
    generatedSessionOnly: "Saving generated recipes is not supported yet.",
  },
} as const;

export function CompletePage() {
  const language = useRecipeStore((state) => state.language);
  const completedRecipeId = useRecipeStore((state) => state.completedRecipeId);
  const getGeneratedRecipeDetailById = useRecipeStore((state) => state.getGeneratedRecipeDetailById);
  const generatedRecipe = completedRecipeId ? getGeneratedRecipeDetailById(completedRecipeId) : null;
  const recipeTitle = generatedRecipe?.detail.recipe_name ?? null;
  const currentCopy = copy[language];
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.description} />
      <PageTopBar />

      <section className="mt-12 rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-12">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">{currentCopy.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600">{currentCopy.description}</p>
        <div className="mt-6 rounded-[1.5rem] bg-brand-50 px-5 py-4 text-brand-900">
          {recipeTitle ?? currentCopy.fallback}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setMessage(currentCopy.generatedSessionOnly)}
            className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.save}
          </button>
          <Link
            to="/"
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
          >
            {currentCopy.home}
          </Link>
          <Link
            to="/saved"
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
          >
            {currentCopy.savedList}
          </Link>
        </div>

        {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
      </section>
    </div>
  );
}
