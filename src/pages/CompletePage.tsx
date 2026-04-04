import { useState } from "react";
import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useAuthState } from "@/features/auth/hooks";
import { saveRecipe as saveRecipeRecord } from "@/features/recipes/api";
import { getLocalizedText, getRecipeById } from "@/features/recipes/utils";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "완료",
    title: "요리가 완료되었습니다",
    description:
      "마지막 단계까지 잘 따라오셨습니다. 홈으로 돌아가거나 저장 목록을 확인할 수 있습니다.",
    save: "저장하기",
    saved: "계정에 저장되었습니다.",
    home: "홈으로 돌아가기",
    savedList: "저장 목록 보기",
    fallback: "최근 완료한 레시피를 찾지 못했습니다.",
    loginRequired: "레시피를 저장하려면 Google 로그인 후 이용해 주세요.",
    notConfigured: "Supabase 설정이 아직 완료되지 않았습니다.",
    generatedSessionOnly: "생성형 레시피는 현재 세션에서만 유지됩니다.",
  },
  en: {
    eyebrow: "Complete",
    title: "Cooking complete!",
    description:
      "You reached the end of the cooking flow. You can go back home or open your saved recipes.",
    save: "Save recipe",
    saved: "Saved to your account.",
    home: "Back to home",
    savedList: "View saved recipes",
    fallback: "No recently completed recipe was found.",
    loginRequired: "Sign in with Google to save recipes.",
    notConfigured: "Supabase is not configured yet.",
    generatedSessionOnly: "Generated recipes stay available only in the current session for now.",
  },
} as const;

export function CompletePage() {
  const { authUser } = useAuthState();
  const language = useRecipeStore((state) => state.language);
  const completedRecipeId = useRecipeStore((state) => state.completedRecipeId);
  const saveRecipe = useRecipeStore((state) => state.saveRecipe);
  const getGeneratedRecipeDetailById = useRecipeStore((state) => state.getGeneratedRecipeDetailById);
  const mockRecipe = completedRecipeId ? getRecipeById(completedRecipeId) : null;
  const generatedRecipe = completedRecipeId ? getGeneratedRecipeDetailById(completedRecipeId) : null;
  const recipeTitle = mockRecipe
    ? getLocalizedText(mockRecipe.title, language)
    : generatedRecipe?.detail.recipe_name ?? null;
  const currentCopy = copy[language];
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!completedRecipeId) {
      return;
    }

    if (!mockRecipe) {
      setMessage(currentCopy.generatedSessionOnly);
      return;
    }

    if (!authUser) {
      setMessage(currentCopy.loginRequired);
      return;
    }

    if (!isSupabaseConfigured()) {
      setMessage(currentCopy.notConfigured);
      return;
    }

    try {
      await saveRecipeRecord(mockRecipe.id);
      saveRecipe(mockRecipe.id);
      setMessage(currentCopy.saved);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : currentCopy.notConfigured);
    }
  };

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
            onClick={() => void handleSave()}
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
