import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { HeroSection } from "@/components/home/HeroSection";
import { IngredientInputCard } from "@/components/home/IngredientInputCard";
import type { UiLanguage } from "@/types/ui";

const copy = {
  ko: {
    brand: "냉장고 한끼",
    tagline: "남은 재료를 오늘의 집밥으로 연결하는 실행형 요리 도우미",
    nav: ["서비스 소개", "입력 방식", "저장 예정"],
    headerCta: "입력 시작",
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
    secondaryCta: "오늘 저녁용 예시 보기",
    miniTitle: "입력 흐름 미리보기",
    miniSteps: [
      "냉장고에 남은 재료를 태그처럼 빠르게 입력",
      "현실적인 메뉴 후보와 준비 순서 확인",
      "조리 단계와 저장 기능은 다음 단계에서 연결",
    ],
    examples: ["예시 재료: 감자", "예시 재료: 참치캔", "예시 재료: 애호박"],
  },
  en: {
    brand: "Fridge Meal Note",
    tagline: "A practical cooking helper that turns leftover ingredients into tonight's meal plan",
    nav: ["Overview", "Input Flow", "Saved Later"],
    headerCta: "Start Adding",
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
    primaryCta: "Preview meal direction",
    secondaryCta: "See dinner examples",
    miniTitle: "How this flow will work",
    miniSteps: [
      "Add ingredients as quick tags from your fridge",
      "Review realistic meal ideas and prep direction",
      "Cooking steps and saving will be connected next",
    ],
    examples: ["Sample: potato", "Sample: tuna", "Sample: zucchini"],
  },
} satisfies Record<
  UiLanguage,
  {
    brand: string;
    tagline: string;
    nav: string[];
    headerCta: string;
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
    miniTitle: string;
    miniSteps: string[];
    examples: string[];
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
  const [language, setLanguage] = useState<UiLanguage>("ko");
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags.ko);

  const currentCopy = copy[language];

  const addTag = (rawValue: string) => {
    const nextTag = normalizeTag(rawValue.replace(/,$/, ""));

    if (!nextTag) {
      return;
    }

    setTags((currentTags) => {
      const hasTag = currentTags.some(
        (tag) => tag.toLocaleLowerCase() === nextTag.toLocaleLowerCase(),
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

  const handleLanguageChange = (nextLanguage: UiLanguage) => {
    setLanguage(nextLanguage);
    setTags((currentTags) => {
      if (currentTags.length === 0) {
        return initialTags[nextLanguage];
      }

      return currentTags;
    });
  };

  const miniCards = useMemo(
    () =>
      currentCopy.miniSteps.map((step, index) => ({
        step,
        number: `0${index + 1}`,
      })),
    [currentCopy.miniSteps],
  );

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(231,241,222,0.9),_rgba(250,248,243,0.98)_45%,_rgba(248,245,240,1)_100%)]">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_20%_20%,rgba(191,220,178,0.35),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(220,236,198,0.55),transparent_24%),radial-gradient(circle_at_50%_0%,rgba(247,252,240,0.85),transparent_52%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <header className="rounded-[1.75rem] border border-white/70 bg-white/75 px-4 py-4 shadow-[0_12px_40px_rgba(60,88,43,0.08)] backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-lg font-semibold text-white shadow-lg shadow-brand-200">
                한
              </div>
              <div>
                <p className="text-lg font-semibold text-stone-900">{currentCopy.brand}</p>
                <p className="mt-1 max-w-md text-sm leading-5 text-stone-500">
                  {currentCopy.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <nav className="flex flex-wrap gap-2 text-sm text-stone-500">
                {currentCopy.nav.map((item, index) => (
                  <span
                    key={item}
                    className={clsx(
                      "rounded-full px-3 py-2",
                      index === 0 ? "bg-brand-50 text-brand-800" : "bg-transparent",
                    )}
                  >
                    {item}
                  </span>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <LanguageToggle value={language} onChange={handleLanguageChange} />
                <button
                  type="button"
                  className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  {currentCopy.headerCta}
                </button>
              </div>
            </div>
          </div>
        </header>

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
              inputValue={inputValue}
              tags={tags}
              examples={currentCopy.examples}
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
        </div>
      </div>
    </div>
  );
}
