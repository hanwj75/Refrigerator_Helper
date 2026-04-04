import { getIngredientTagLabel } from "@/features/recipes/ingredientDictionary";
import type { GeneratedRecommendation, IngredientTag } from "@/features/recipes/types";
import type { LocalizedText } from "@/types/recipe";
import type { RecipeDifficulty, UiLanguage } from "@/types/ui";

export function getLocalizedText(text: LocalizedText, language: UiLanguage) {
  return text[language];
}

export function getDifficultyLabel(difficulty: RecipeDifficulty, language: UiLanguage) {
  const labels: Record<RecipeDifficulty, Record<UiLanguage, string>> = {
    any: { ko: "전체", en: "All" },
    간단: { ko: "간단", en: "Easy" },
    노력: { ko: "노력", en: "Normal" },
    정성: { ko: "정성", en: "Hard" },
  };

  return labels[difficulty][language];
}

export function getSelectedIngredientSummary(tags: IngredientTag[], language: UiLanguage) {
  return tags.map((tag) => getIngredientTagLabel(tag, language)).join(", ");
}

export function slugifyRecipeName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildGeneratedRecommendationId(name: string, index: number) {
  const slug = slugifyRecipeName(name) || "generated-recipe";
  return `generated-${slug}-${index + 1}`;
}

export function getGeneratedConfidenceScore(recipe: GeneratedRecommendation) {
  const usedCount = recipe.used_ingredients.length;
  const requiredCount = recipe.required_ingredients.length;
  return Math.max(72, Math.min(98, 84 + usedCount * 3 - requiredCount * 4));
}
