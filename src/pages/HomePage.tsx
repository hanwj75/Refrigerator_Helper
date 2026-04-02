import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { HeroSection } from "@/components/home/HeroSection";
import { IngredientInputCard } from "@/components/home/IngredientInputCard";
import type { UiLanguage } from "@/types/ui";

const copy = {
  ko: {
    nav: ["서비스 소개", "입력 방식", "저장 예정"],
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
    nav: ["Overview", "Input Flow", "Saved Later"],
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
    nav: string[];
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

const tagTranslations: Record<string, string> = {
  "두부": "tofu",
  "양파": "onion",
  "계란": "eggs",
  "대파": "green onion",
  "감자": "potato",
  "참치캔": "canned tuna",
  "애호박": "zucchini",
  "tofu": "두부",
  "onion": "양파",
  "eggs": "계란",
  "green onion": "대파",
  "potato": "감자",
  "canned tuna": "참치캔",
  "zucchini": "애호박",
};

function normalizeTag(tag: string) {
  return tag.trim().replace(/\s+/g, " ");
}

function translateTag(tag: string, nextLanguage: UiLanguage) {
  const normalizedTag = normalizeTag(tag);
  const translatedTag = tagTranslations[normalizedTag];

  if (!translatedTag) {
    return normalizedTag;
  }

  if (nextLanguage === "en") {
    return translatedTag;
  }

  return translatedTag;
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

      const translatedTags = currentTags.map((tag) => translateTag(tag, nextLanguage));

      return translatedTags.filter(
        (tag, index) =>
          translatedTags.findIndex(
            (currentTag) => currentTag.toLocaleLowerCase() === tag.toLocaleLowerCase(),
          ) === index,
      );
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
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Link
            to="/"
            className="inline-flex self-start rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-800"
          >
            냉장고를 도와줘
          </Link>

          <div className="flex flex-col gap-3 sm:items-end">
            <nav className="flex flex-wrap justify-end gap-2 text-sm text-stone-500">
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

            <div className="flex justify-end">
              <LanguageToggle value={language} onChange={handleLanguageChange} />
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
