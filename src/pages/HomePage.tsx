import { useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { IngredientInputCard } from "@/components/home/IngredientInputCard";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import {
  createIngredientTag,
  getIngredientTagLabel,
  normalizeIngredientTag,
} from "@/features/recipes/ingredientDictionary";
import { getDifficultyLabel } from "@/features/recipes/utils";
import type { IngredientTag } from "@/features/recipes/types";
import { useRecipeStore } from "@/store/useRecipeStore";
import type { RecipeDifficulty } from "@/types/ui";

const starterTags: IngredientTag[] = [
  { id: "tofu", ko: "두부", en: "tofu", sourceLanguage: "ko" },
  { id: "onion", ko: "양파", en: "onion", sourceLanguage: "ko" },
  { id: "egg", ko: "계란", en: "eggs", sourceLanguage: "ko" },
];

const copy = {
  ko: {
    seoTitle: "홈",
    seoDescription: "냉장고 재료를 정리하고 오늘 바로 만들 수 있는 메뉴를 추천받아 보세요.",
    badge: "오늘 남은 재료로 바로 메뉴 정하기",
    title: "냉장고 속 재료로",
    highlight: "한 끼 완성",
    description:
      "남아 있는 재료를 태그로 정리하면 오늘 저녁에 바로 만들 수 있는 현실적인 집밥 방향을 빠르게 잡아볼 수 있습니다.",
    benefits: ["현실적인 집밥 중심", "남은 재료 정리형 UX", "한눈에 입력되는 태그 방식"],
    cardTitle: "지금 있는 재료를 적어보세요",
    cardDescription:
      "채소, 단백질, 기본 재료를 자연스럽게 입력하면 추천 흐름에 바로 반영됩니다.",
    placeholder: "예: 김치, 양파, 계란, 두부",
    hint: "엔터 또는 쉼표를 누르면 태그로 추가됩니다.",
    helper: "재료는 화면 언어와 별개로 안정적으로 보관됩니다.",
    clearLabel: "전체 삭제",
    primaryCta: "이 재료로 메뉴 잡아보기",
    secondaryCta: "예시 태그 다시 넣기",
    difficultyLabel: "난이도 선택",
    examples: ["예: 김치", "예: 양파", "예: 계란"],
    miniTitle: "이렇게 이어집니다",
    miniSteps: [
      "재료를 태그로 정리합니다.",
      "난이도를 고르고 추천을 확인합니다.",
      "상세 레시피와 요리 단계를 이어서 봅니다.",
    ],
  },
  en: {
    seoTitle: "Home",
    seoDescription: "Organize your fridge ingredients and get realistic meal ideas for today.",
    badge: "Plan tonight's meal from what is already in your fridge",
    title: "Cook from what you",
    highlight: "already have",
    description:
      "Sort the ingredients you already have into tags and get realistic home-cooking ideas you can actually make tonight.",
    benefits: ["Built for everyday meals", "Leftover-first ingredient flow", "Fast tag-based input"],
    cardTitle: "Add the ingredients you have right now",
    cardDescription:
      "Type vegetables, proteins, or staples naturally and use them as the starting point for recipe suggestions.",
    placeholder: "e.g. kimchi, onion, eggs, tofu",
    hint: "Press Enter or comma to add a tag.",
    helper: "Ingredient data stays stable even when the UI language changes.",
    clearLabel: "Clear all",
    primaryCta: "Find recipes with these ingredients",
    secondaryCta: "Restore sample tags",
    difficultyLabel: "Choose difficulty",
    examples: ["e.g. kimchi", "e.g. onion", "e.g. eggs"],
    miniTitle: "How it works",
    miniSteps: [
      "Organize ingredients as quick tags.",
      "Choose a difficulty level and view recommendations.",
      "Open the detailed recipe and follow the cooking steps.",
    ],
  },
} as const;

function buildUniqueTags(tags: IngredientTag[]) {
  return tags.filter(
    (tag, index, array) =>
      array.findIndex((candidate) => normalizeIngredientTag(candidate.id) === normalizeIngredientTag(tag.id)) ===
      index,
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const language = useRecipeStore((state) => state.language);
  const selectedDifficulty = useRecipeStore((state) => state.selectedDifficulty);
  const setSelectedIngredients = useRecipeStore((state) => state.setSelectedIngredients);
  const setHasSubmittedRecommendationRequest = useRecipeStore(
    (state) => state.setHasSubmittedRecommendationRequest,
  );
  const setSelectedDifficulty = useRecipeStore((state) => state.setSelectedDifficulty);
  const generateRecommendations = useRecipeStore((state) => state.generateRecommendations);
  const clearGeneratedRecommendations = useRecipeStore((state) => state.clearGeneratedRecommendations);
  const currentCopy = copy[language];

  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<IngredientTag[]>(starterTags);

  const difficultyOptions = useMemo(
    () =>
      (["any", "간단", "노력", "정성"] as RecipeDifficulty[]).map((value) => ({
        value,
        label: getDifficultyLabel(value, language),
      })),
    [language],
  );

  const visibleTags = tags.map((tag) => ({
    id: tag.id,
    label: getIngredientTagLabel(tag, language),
  }));

  const validTags = tags.filter(
    (tag) => getIngredientTagLabel(tag, "ko").trim() || getIngredientTagLabel(tag, "en").trim(),
  );

  const commitTag = (rawValue: string) => {
    const trimmed = rawValue.trim();

    if (!trimmed) {
      return;
    }

    const nextTag = createIngredientTag(trimmed, language);

    setTags((current) => buildUniqueTags([...current, nextTag]));
    setInputValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTag(inputValue.replace(/,$/, ""));
    }
  };

  const handleSubmit = () => {
    if (validTags.length === 0) {
      setSelectedIngredients([]);
      setHasSubmittedRecommendationRequest(false);
      setSelectedDifficulty(selectedDifficulty);
      clearGeneratedRecommendations();
      navigate("/result");
      return;
    }

    setSelectedIngredients(validTags);
    setSelectedDifficulty(selectedDifficulty);
    setHasSubmittedRecommendationRequest(true);
    clearGeneratedRecommendations();
    generateRecommendations(validTags, selectedDifficulty);
    navigate("/result");
  };

  const handleRestoreSamples = () => {
    setTags(starterTags);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.seoTitle} description={currentCopy.seoDescription} />
      <PageTopBar />

      <div className="mt-6 space-y-6">
        <HeroSection
          badge={currentCopy.badge}
          title={currentCopy.title}
          highlight={currentCopy.highlight}
          description={currentCopy.description}
          benefits={[...currentCopy.benefits]}
        />

        <IngredientInputCard
          title={currentCopy.cardTitle}
          description={currentCopy.cardDescription}
          placeholder={currentCopy.placeholder}
          hint={currentCopy.hint}
          helper={currentCopy.helper}
          clearLabel={currentCopy.clearLabel}
          primaryCta={currentCopy.primaryCta}
          secondaryCta={currentCopy.secondaryCta}
          difficultyLabel={currentCopy.difficultyLabel}
          difficultyOptions={difficultyOptions}
          selectedDifficulty={selectedDifficulty}
          inputValue={inputValue}
          tags={visibleTags}
          examples={[...currentCopy.examples]}
          onDifficultyChange={setSelectedDifficulty}
          onPrimaryAction={handleSubmit}
          onSecondaryAction={handleRestoreSamples}
          onInputChange={setInputValue}
          onInputKeyDown={handleKeyDown}
          onClearAll={() => setTags([])}
          onRemoveTag={(tagId) => setTags((current) => current.filter((tag) => tag.id !== tagId))}
        />

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(73,98,56,0.08)]">
          <h2 className="text-lg font-semibold text-stone-900">{currentCopy.miniTitle}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {currentCopy.miniSteps.map((step, index) => (
              <div key={step} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-5">
                <p className="text-xs font-semibold tracking-[0.24em] text-brand-700">0{index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-stone-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
