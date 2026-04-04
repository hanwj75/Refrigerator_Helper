import type { IngredientTag } from "@/features/recipes/types";
import type { UiLanguage } from "@/types/ui";

const ingredientDictionary: Array<Omit<IngredientTag, "sourceLanguage"> & { aliases: string[] }> = [
  { id: "tofu", ko: "두부", en: "tofu", aliases: ["두부", "tofu"] },
  { id: "onion", ko: "양파", en: "onion", aliases: ["양파", "onion"] },
  { id: "egg", ko: "계란", en: "eggs", aliases: ["계란", "달걀", "egg", "eggs"] },
  { id: "green-onion", ko: "대파", en: "green onion", aliases: ["대파", "green onion", "scallion"] },
  { id: "potato", ko: "감자", en: "potato", aliases: ["감자", "potato"] },
  { id: "tuna", ko: "참치", en: "tuna", aliases: ["참치", "tuna"] },
  { id: "canned-tuna", ko: "참치캔", en: "canned tuna", aliases: ["참치캔", "canned tuna"] },
  { id: "zucchini", ko: "애호박", en: "zucchini", aliases: ["애호박", "zucchini"] },
  { id: "kimchi", ko: "김치", en: "kimchi", aliases: ["김치", "kimchi"] },
  { id: "rice", ko: "밥", en: "rice", aliases: ["밥", "rice"] },
  { id: "soy-sauce", ko: "간장", en: "soy sauce", aliases: ["간장", "soy sauce"] },
  { id: "soybean-paste", ko: "된장", en: "soybean paste", aliases: ["된장", "soybean paste"] },
  { id: "mushroom", ko: "버섯", en: "mushroom", aliases: ["버섯", "mushroom"] },
  { id: "garlic", ko: "마늘", en: "garlic", aliases: ["마늘", "garlic"] },
];

export function normalizeIngredientTag(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function createIngredientTag(rawValue: string, inputLanguage: UiLanguage): IngredientTag {
  const cleaned = rawValue.trim().replace(/\s+/g, " ");
  const normalized = normalizeIngredientTag(cleaned);
  const matched = ingredientDictionary.find((item) =>
    item.aliases.some((alias) => normalizeIngredientTag(alias) === normalized),
  );

  if (matched) {
    return {
      id: matched.id,
      ko: matched.ko,
      en: matched.en,
      sourceLanguage: inputLanguage,
    };
  }

  return {
    id: normalized,
    ko: inputLanguage === "ko" ? cleaned : "",
    en: inputLanguage === "en" ? cleaned : "",
    sourceLanguage: inputLanguage,
  };
}

export function getIngredientTagLabel(tag: IngredientTag, language: UiLanguage) {
  return tag[language] || tag[tag.sourceLanguage] || tag.ko || tag.en || tag.id;
}

export function toLanguageIngredients(tags: IngredientTag[], language: UiLanguage) {
  return tags.map((tag) => getIngredientTagLabel(tag, language));
}

export function resolveIngredientResponseLanguage(
  tags: IngredientTag[],
  fallbackLanguage: UiLanguage,
): UiLanguage {
  if (tags.length === 0) {
    return fallbackLanguage;
  }

  const counts = tags.reduce(
    (acc, tag) => {
      acc[tag.sourceLanguage] += 1;
      return acc;
    },
    { ko: 0, en: 0 },
  );

  if (counts.ko === counts.en) {
    return fallbackLanguage;
  }

  return counts.ko > counts.en ? "ko" : "en";
}
