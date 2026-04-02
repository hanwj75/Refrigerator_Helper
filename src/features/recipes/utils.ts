import { mockRecipes } from "@/features/recipes/mockRecipes";
import { normalizeIngredientTag } from "@/features/recipes/ingredientDictionary";
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

export function getDifficultyLabel(
  difficulty: RecipeDifficulty,
  language: UiLanguage,
) {
  const labels: Record<RecipeDifficulty, Record<UiLanguage, string>> = {
    any: { ko: "전체", en: "Any" },
    easy: { ko: "쉬움", en: "Easy" },
    medium: { ko: "보통", en: "Medium" },
    hard: { ko: "어려움", en: "Hard" },
  };

  return labels[difficulty][language];
}

export function getRecipeById(id: string) {
  return mockRecipes.find((recipe) => recipe.id === id) ?? null;
}

export function getRecipeIngredientGroups(recipe: Recipe, selectedIngredients: string[]) {
  const normalizedSelected = selectedIngredients.map(normalizeIngredientTag);

  const usedIngredients = recipe.ingredients.filter((ingredient) =>
    ingredient.keywords.some((keyword) => normalizedSelected.includes(normalizeIngredientTag(keyword))),
  );

  const neededIngredients = recipe.ingredients.filter(
    (ingredient) =>
      !ingredient.keywords.some((keyword) =>
        normalizedSelected.includes(normalizeIngredientTag(keyword)),
      ),
  );

  return { usedIngredients, neededIngredients };
}

export function getRecommendedRecipes(
  selectedIngredients: string[],
  difficulty: RecipeDifficulty,
) {
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
