import type { UiLanguage } from "@/types/ui";

const ingredientTranslations: Record<string, { ko: string; en: string }> = {
  "두부": { ko: "두부", en: "tofu" },
  "tofu": { ko: "두부", en: "tofu" },
  "양파": { ko: "양파", en: "onion" },
  "onion": { ko: "양파", en: "onion" },
  "계란": { ko: "계란", en: "eggs" },
  "eggs": { ko: "계란", en: "eggs" },
  "달걀": { ko: "계란", en: "eggs" },
  "egg": { ko: "계란", en: "eggs" },
  "대파": { ko: "대파", en: "green onion" },
  "green onion": { ko: "대파", en: "green onion" },
  "scallion": { ko: "대파", en: "green onion" },
  "감자": { ko: "감자", en: "potato" },
  "potato": { ko: "감자", en: "potato" },
  "참치캔": { ko: "참치캔", en: "canned tuna" },
  "canned tuna": { ko: "참치캔", en: "canned tuna" },
  "tuna": { ko: "참치캔", en: "canned tuna" },
  "애호박": { ko: "애호박", en: "zucchini" },
  "zucchini": { ko: "애호박", en: "zucchini" },
  "김치": { ko: "김치", en: "kimchi" },
  "kimchi": { ko: "김치", en: "kimchi" },
  "밥": { ko: "밥", en: "rice" },
  "rice": { ko: "밥", en: "rice" },
  "간장": { ko: "간장", en: "soy sauce" },
  "soy sauce": { ko: "간장", en: "soy sauce" },
  "된장": { ko: "된장", en: "soybean paste" },
  "soybean paste": { ko: "된장", en: "soybean paste" },
  "버섯": { ko: "버섯", en: "mushroom" },
  "mushroom": { ko: "버섯", en: "mushroom" },
  "마늘": { ko: "마늘", en: "garlic" },
  "garlic": { ko: "마늘", en: "garlic" },
};

export function normalizeIngredientTag(tag: string) {
  return tag.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function translateIngredientTag(tag: string, language: UiLanguage) {
  const normalizedTag = normalizeIngredientTag(tag);
  const translatedTag = ingredientTranslations[normalizedTag];

  if (!translatedTag) {
    return tag.trim().replace(/\s+/g, " ");
  }

  return translatedTag[language];
}
