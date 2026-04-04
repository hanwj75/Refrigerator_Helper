import type { RecipeDifficulty, UiLanguage } from "@/types/ui";

export type LocalizedText = Record<UiLanguage, string>;

export type RecipeIngredient = {
  id: string;
  name: LocalizedText;
  amount?: LocalizedText;
  keywords: string[];
};

export type RecipeStep = {
  id: string;
  order: number;
  title: LocalizedText;
  instruction: LocalizedText;
  timerSeconds?: number;
};

export type Recipe = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  difficulty: Exclude<RecipeDifficulty, "any">;
  cookingTimeMinutes: number;
  ingredients: RecipeIngredient[];
  saves: number;
  confidence: number;
  steps: RecipeStep[];
};
