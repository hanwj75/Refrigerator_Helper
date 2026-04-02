import { useState } from "react";
import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { getLocalizedText, getRecipeById } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "완료",
    title: "요리 완료!",
    description: "마지막까지 잘 따라왔습니다. 이 레시피를 저장해 두고 다음에도 바로 이어서 확인할 수 있습니다.",
    save: "저장하기",
    saved: "저장되었습니다.",
    home: "홈으로 돌아가기",
    savedList: "저장 목록 보기",
    fallback: "방금 완료한 레시피 정보가 없습니다.",
  },
  en: {
    eyebrow: "Complete",
    title: "Cooking complete!",
    description: "You made it to the end. Save this recipe now so you can come back to it later.",
    save: "Save recipe",
    saved: "Saved successfully.",
    home: "Back to home",
    savedList: "View saved recipes",
    fallback: "No recently completed recipe was found.",
  },
} as const;

export function CompletePage() {
  const language = useRecipeStore((state) => state.language);
  const completedRecipeId = useRecipeStore((state) => state.completedRecipeId);
  const saveRecipe = useRecipeStore((state) => state.saveRecipe);
  const recipe = completedRecipeId ? getRecipeById(completedRecipeId) : null;
  const currentCopy = copy[language];
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.description} />
      <PageTopBar />

      <section className="mt-12 rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-12">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">{currentCopy.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600">
          {currentCopy.description}
        </p>
        <div className="mt-6 rounded-[1.5rem] bg-brand-50 px-5 py-4 text-brand-900">
          {recipe ? getLocalizedText(recipe.title, language) : currentCopy.fallback}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!recipe) {
                return;
              }

              const didSave = saveRecipe(recipe.id);
              setMessage(didSave ? currentCopy.saved : currentCopy.saved);
            }}
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
