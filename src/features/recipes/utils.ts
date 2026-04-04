import { mockRecipes } from "@/features/recipes/mockRecipes";
import { getIngredientTagLabel, normalizeIngredientTag } from "@/features/recipes/ingredientDictionary";
import type { GeneratedRecommendation, IngredientTag } from "@/features/recipes/types";
import type { LocalizedText, Recipe, RecipeIngredient } from "@/types/recipe";
import type { RecipeDifficulty, UiLanguage } from "@/types/ui";

export function getLocalizedText(text: LocalizedText, language: UiLanguage) {
  return text[language];
}

export function getIngredientLabel(ingredient: RecipeIngredient, language: UiLanguage) {
  return ingredient.name[language];
}

export function getIngredientAmount(ingredient: RecipeIngredient, language: UiLanguage) {
  return ingredient.amount?.[language];
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

export function getRecipeById(id: string) {
  return mockRecipes.find((recipe) => recipe.id === id) ?? null;
}

export function getRecipeIngredientGroups(recipe: Recipe, selectedIngredients: IngredientTag[]) {
  const normalizedSelected = selectedIngredients.flatMap((tag) => [
    normalizeIngredientTag(tag.ko),
    normalizeIngredientTag(tag.en),
    normalizeIngredientTag(tag.id),
  ]);

  const usedIngredients = recipe.ingredients.filter((ingredient) =>
    ingredient.keywords.some((keyword) => normalizedSelected.includes(normalizeIngredientTag(keyword))),
  );

  const neededIngredients = recipe.ingredients.filter(
    (ingredient) =>
      !ingredient.keywords.some((keyword) => normalizedSelected.includes(normalizeIngredientTag(keyword))),
  );

  return { usedIngredients, neededIngredients };
}

export function getRecommendedRecipes(selectedIngredients: IngredientTag[], difficulty: RecipeDifficulty) {
  return [...mockRecipes]
    .filter((recipe) => difficulty === "any" || recipe.difficulty === difficulty)
    .sort((left, right) => {
      const leftMatches = getRecipeIngredientGroups(left, selectedIngredients).usedIngredients.length;
      const rightMatches = getRecipeIngredientGroups(right, selectedIngredients).usedIngredients.length;

      if (rightMatches !== leftMatches) {
        return rightMatches - leftMatches;
      }

      return right.confidence - left.confidence;
    });
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

export function buildConfidenceNote(requiredIngredientCount: number, language: UiLanguage) {
  if (requiredIngredientCount <= 0) {
    return language === "ko"
      ? "현재 재료만으로 가능"
      : "Can be made with current ingredients";
  }

  if (language === "ko") {
    return `추가 재료 ${Math.min(requiredIngredientCount, 4)}개 필요`;
  }

  return `Needs ${Math.min(requiredIngredientCount, 4)} extra ingredient${requiredIngredientCount > 1 ? "s" : ""}`;
}
