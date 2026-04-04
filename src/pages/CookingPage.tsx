import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    eyebrow: "요리 진행",
    previous: "이전 단계",
    next: "다음 단계",
    finish: "요리 완료",
    timer: "타이머",
    missing: "요리 진행용 생성형 레시피를 찾을 수 없습니다.",
    back: "홈으로 돌아가기",
  },
  en: {
    eyebrow: "Cooking",
    previous: "Previous step",
    next: "Next step",
    finish: "Finish cooking",
    timer: "Timer",
    missing: "Generated recipe not found for cooking.",
    back: "Back home",
  },
} as const;

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function CookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = useRecipeStore((state) => state.language);
  const setCompletedRecipeId = useRecipeStore((state) => state.setCompletedRecipeId);
  const getGeneratedRecipeDetailById = useRecipeStore((state) => state.getGeneratedRecipeDetailById);
  const generatedRecipe = id ? getGeneratedRecipeDetailById(id) : null;
  const currentCopy = copy[language];
  const [stepIndex, setStepIndex] = useState(0);

  const steps =
    generatedRecipe?.detail.steps.map((step) => ({
      key: `${generatedRecipe.id}-${step.step_order}`,
      order: step.step_order,
      title: step.step_title,
      instruction: step.instruction,
      timerSeconds: step.timer_seconds,
    })) ?? [];

  const recipeTitle = generatedRecipe?.detail.recipe_name ?? null;
  const currentStep = steps[stepIndex];
  const [timerValue, setTimerValue] = useState(currentStep?.timerSeconds ?? 0);

  useEffect(() => {
    setTimerValue(currentStep?.timerSeconds ?? 0);
  }, [currentStep?.key, currentStep?.timerSeconds]);

  useEffect(() => {
    if (!currentStep?.timerSeconds || timerValue <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimerValue((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [currentStep?.timerSeconds, timerValue]);

  const isLastStep = useMemo(
    () => (steps.length > 0 ? stepIndex === steps.length - 1 : false),
    [stepIndex, steps.length],
  );

  if (!recipeTitle || !currentStep) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <SeoMeta title={currentCopy.eyebrow} description={currentCopy.missing} />
        <PageTopBar />
        <section className="mt-8 rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">{currentCopy.missing}</h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {currentCopy.back}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={`${recipeTitle} - ${currentCopy.eyebrow}`} description={currentStep.instruction} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(73,98,56,0.12)] sm:p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">{currentCopy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">{recipeTitle}</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-800">
            STEP {currentStep.order} / {steps.length}
          </span>
          {currentStep.timerSeconds ? (
            <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
              {currentCopy.timer}: {formatTimer(timerValue)}
            </span>
          ) : null}
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(73,98,56,0.1)] sm:p-8">
        <h2 className="text-2xl font-semibold text-stone-900">{currentStep.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">{currentStep.instruction}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {currentCopy.previous}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLastStep) {
                setCompletedRecipeId(id ?? null);
                navigate("/complete");
                return;
              }

              setStepIndex((current) => current + 1);
            }}
            className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {isLastStep ? currentCopy.finish : currentCopy.next}
          </button>
        </div>
      </section>
    </div>
  );
}
