import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { IngredientInputCard } from "@/components/home/IngredientInputCard";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import {
  normalizeIngredientTag,
  translateIngredientTag,
} from "@/features/recipes/ingredientDictionary";
import { getDifficultyLabel } from "@/features/recipes/utils";
import { useRecipeStore } from "@/store/useRecipeStore";
import type { RecipeDifficulty, UiLanguage } from "@/types/ui";

const copy = {
  ko: {
    badge: "오늘 남은 재료로 바로 메뉴 정하기",
    title: "냉장고 속 재료로",
    highlight: "한 끼 완성",
    description:
      "바쁜 저녁에도 있는 재료만 정리해서 넣으면, 바로 만들어 먹기 좋은 집밥 방향을 잡을 수 있도록 설계된 첫 화면입니다.",
    benefits: ["현실적인 집밥 중심", "남은 재료 정리형 UX", "한눈에 입력되는 태그 방식"],
    cardTitle: "지금 있는 재료를 담아보세요",
    cardDescription:
      "채소, 단백질, 소스처럼 생각나는 재료를 편하게 입력해 두면 다음 단계에서 추천 흐름을 붙이기 좋게 구성했습니다.",
    placeholder: "예: 두부, 양파, 대파, 계란",
    hint: "엔터 또는 쉼표를 누르면 재료 태그가 추가됩니다.",
    helper: "중복 재료는 자동으로 제외됩니다.",
    clearLabel: "전체 비우기",
    primaryCta: "이 재료로 메뉴 잡아보기",
    secondaryCta: "예시 재료 다시 담기",
    difficultyLabel: "원하는 난이도",
    miniTitle: "입력 흐름 미리보기",
    miniSteps: [
      "냉장고에 남은 재료를 태그처럼 빠르게 입력",
      "현실적인 메뉴 후보와 준비 순서 확인",
      "조리 단계와 저장 기능은 다음 단계에서 연결",
    ],
    examples: ["예시 재료: 감자", "예시 재료: 참치캔", "예시 재료: 애호박"],
    guideTitle: "이 사이트에서 확인할 수 있는 것",
    guideSections: [
      {
        title: "재료 중심 추천 흐름",
        body: "냉장고에 실제로 남아 있는 재료를 먼저 정리한 뒤, 만들 수 있는 메뉴 흐름을 확인할 수 있습니다.",
      },
      {
        title: "단계별 조리 진행",
        body: "선택한 레시피는 단계별 화면으로 이어져 집에서 따라 하기 쉬운 흐름으로 정리됩니다.",
      },
      {
        title: "저장 및 재확인",
        body: "마음에 든 레시피는 저장 목록에 보관하고 다음 식사 때 다시 확인할 수 있습니다.",
      },
    ],
  },
  en: {
    badge: "Plan tonight's meal from what is already in your fridge",
    title: "Cook from what you",
    highlight: "already have",
    description:
      "This mockup focuses on helping people sort everyday ingredients first, so the next step can become a realistic meal suggestion instead of a generic recipe list.",
    benefits: ["Built for everyday home meals", "Quick leftover-first input", "Tag-based ingredient flow"],
    cardTitle: "Add the ingredients you have right now",
    cardDescription:
      "Type vegetables, proteins, sauces, or staples in the most natural way. The next product step can build recommendations on top of this simple input flow.",
    placeholder: "e.g. tofu, onion, green onion, eggs",
    hint: "Press Enter or type a comma to add an ingredient tag.",
    helper: "Duplicate ingredients are ignored automatically.",
    clearLabel: "Clear all",
    primaryCta: "See meal ideas",
    secondaryCta: "Reset example ingredients",
    difficultyLabel: "Preferred difficulty",
    miniTitle: "How this flow will work",
    miniSteps: [
      "Add ingredients as quick tags from your fridge",
      "Review realistic meal ideas and prep direction",
      "Cooking steps and saving will be connected next",
    ],
    examples: ["Sample: potato", "Sample: tuna", "Sample: zucchini"],
    guideTitle: "What you can do on this site",
    guideSections: [
      {
        title: "Ingredient-first meal ideas",
        body: "Start with what is actually left in your fridge and review meal directions that fit those ingredients.",
      },
      {
        title: "Step-by-step cooking flow",
        body: "Each selected recipe can continue into a structured cooking flow that is easy to follow at home.",
      },
      {
        title: "Save and revisit recipes",
        body: "Useful recipes can be saved and reopened later when you need another quick home meal idea.",
      },
    ],
  },
} satisfies Record<
  UiLanguage,
  {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    benefits: string[];
    cardTitle: string;
    cardDescription: string;
    placeholder: string;
    hint: string;
    helper: string;
    clearLabel: string;
    primaryCta: string;
    secondaryCta: string;
    difficultyLabel: string;
    miniTitle: string;
    miniSteps: string[];
    examples: string[];
    guideTitle: string;
    guideSections: { title: string; body: string }[];
  }
>;

const initialTags: Record<UiLanguage, string[]> = {
  ko: ["두부", "양파", "계란"],
  en: ["tofu", "onion", "eggs"],
};

function normalizeTag(tag: string) {
  return tag.trim().replace(/\s+/g, " ");
}

export function HomePage() {
  const navigate = useNavigate();
  const language = useRecipeStore((state) => state.language);
  const selectedIngredients = useRecipeStore((state) => state.selectedIngredients);
  const selectedDifficulty = useRecipeStore((state) => state.selectedDifficulty);
  const setSelectedIngredients = useRecipeStore((state) => state.setSelectedIngredients);
  const setSelectedDifficulty = useRecipeStore((state) => state.setSelectedDifficulty);
  const generateRecommendations = useRecipeStore((state) => state.generateRecommendations);
  const currentCopy = copy[language];
  const previousLanguageRef = useRef(language);

  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(
    selectedIngredients.length > 0 ? selectedIngredients : initialTags[language],
  );

  const addTag = (rawValue: string) => {
    const nextTag = normalizeTag(rawValue.replace(/,$/, ""));

    if (!nextTag) {
      return;
    }

    setTags((currentTags) => {
      const hasTag = currentTags.some(
        (tag) => normalizeIngredientTag(tag) === normalizeIngredientTag(nextTag),
      );

      return hasTag ? currentTags : [...currentTags, nextTag];
    });
  };

  const handleInputChange = (value: string) => {
    if (value.includes(",")) {
      const segments = value.split(",");
      const committedTags = segments.slice(0, -1);

      committedTags.forEach(addTag);
      setInputValue(segments[segments.length - 1] ?? "");
      return;
    }

    setInputValue(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addTag(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    if (previousLanguageRef.current === language) {
      return;
    }

    setTags((currentTags) =>
      (currentTags.length === 0 ? initialTags[language] : currentTags).map((tag) =>
        translateIngredientTag(tag, language),
      ),
    );
    previousLanguageRef.current = language;
  }, [language]);

  const difficultyOptions = useMemo(
    () =>
      (["any", "easy", "medium", "hard"] as RecipeDifficulty[]).map((difficulty) => ({
        value: difficulty,
        label: getDifficultyLabel(difficulty, language),
      })),
    [language],
  );

  const miniCards = useMemo(
    () =>
      currentCopy.miniSteps.map((step, index) => ({
        step,
        number: `0${index + 1}`,
      })),
    [currentCopy.miniSteps],
  );

  const commitSelectionAndNavigate = () => {
    const nextTags = tags.length > 0 ? tags : initialTags[language];

    setSelectedIngredients(nextTags);
    setSelectedDifficulty(selectedDifficulty);
    generateRecommendations(nextTags, selectedDifficulty);
    navigate("/result");
  };

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(231,241,222,0.9),_rgba(250,248,243,0.98)_45%,_rgba(248,245,240,1)_100%)]">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_20%_20%,rgba(191,220,178,0.35),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(220,236,198,0.55),transparent_24%),radial-gradient(circle_at_50%_0%,rgba(247,252,240,0.85),transparent_52%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <SeoMeta
          title="홈"
          description="냉장고 재료를 입력하고 집에서 실천하기 좋은 메뉴 아이디어와 조리 흐름을 확인할 수 있는 메인 페이지입니다."
        />
        <PageTopBar />

        <div className="mt-6 grid gap-6 lg:mt-8">
          <HeroSection
            badge={currentCopy.badge}
            title={currentCopy.title}
            highlight={currentCopy.highlight}
            description={currentCopy.description}
            benefits={currentCopy.benefits}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-start">
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
              tags={tags}
              examples={currentCopy.examples}
              onDifficultyChange={setSelectedDifficulty}
              onPrimaryAction={commitSelectionAndNavigate}
              onSecondaryAction={() => {
                const nextTags = initialTags[language];
                setTags(nextTags);
                setSelectedIngredients(nextTags);
              }}
              onInputChange={handleInputChange}
              onInputKeyDown={handleKeyDown}
              onClearAll={() => setTags([])}
              onRemoveTag={(tagToRemove) =>
                setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove))
              }
            />

            <aside className="rounded-[2rem] border border-white/70 bg-[#f7f3ea] p-6 shadow-[0_18px_50px_rgba(93,76,53,0.08)]">
              <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">
                {currentCopy.miniTitle}
              </p>
              <div className="mt-5 space-y-4">
                {miniCards.map((item) => (
                  <div key={item.number} className="rounded-[1.5rem] bg-white px-4 py-4">
                    <p className="text-xs font-semibold tracking-[0.2em] text-stone-400">
                      {item.number}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{item.step}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_rgba(73,98,56,0.08)] sm:p-8">
            <h2 className="text-2xl font-semibold text-stone-900">{currentCopy.guideTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {currentCopy.guideSections.map((section) => (
                <article key={section.title} className="rounded-[1.5rem] bg-stone-50 p-5">
                  <h3 className="text-lg font-semibold text-stone-900">{section.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{section.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
