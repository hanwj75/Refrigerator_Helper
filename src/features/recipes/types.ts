import type { UiLanguage } from "../../types/ui";

export type RecipeDifficultyValue = "간단" | "노력" | "정성";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type IngredientTag = {
  id: string;
  ko: string;
  en: string;
  sourceLanguage: UiLanguage;
};

export type RecipeRow = {
  id: string;
  slug: string;
  name: string;
  difficulty: RecipeDifficultyValue;
  description: string | null;
  used_ingredients: JsonValue;
  required_ingredients: JsonValue;
  cooking_time_minutes: number | null;
  tips: JsonValue;
  steps: JsonValue;
  total_vote_count: number;
  total_save_count: number;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedRecipeRow = {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
};

export type SavedRecipeWithRecipe = SavedRecipeRow & {
  recipe: Pick<
    RecipeRow,
    | "id"
    | "slug"
    | "name"
    | "description"
    | "difficulty"
    | "cooking_time_minutes"
    | "total_vote_count"
    | "total_save_count"
  > | null;
};

export type RecipeVoteRow = {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
};

export type RecommendRecipeRequest = {
  ingredients_owned: string[];
  difficulty: RecipeDifficultyValue;
  response_language: UiLanguage;
  excluded_ingredients?: string[];
  max_cooking_time_minutes?: number;
  servings?: number;
  cuisine_preference?: string | null;
};

export type RecommendRecipeItem = {
  recipe_name: string;
  difficulty: RecipeDifficultyValue;
  used_ingredients: string[];
  required_ingredients: string[];
  cooking_time_minutes: number;
  short_description: string;
  confidence_note:
    | "현재 재료만으로 가능"
    | "추가 재료 1개 필요"
    | "추가 재료 2개 필요"
    | "추가 재료 3개 필요"
    | "추가 재료 4개 필요"
    | "Can be made with current ingredients"
    | "Needs 1 extra ingredient"
    | "Needs 2 extra ingredients"
    | "Needs 3 extra ingredients"
    | "Needs 4 extra ingredients";
};

export type RecommendRecipeResponse = {
  recipes: RecommendRecipeItem[];
};

export type RecipeDetailRequest = {
  recipe_name: string;
  difficulty: RecipeDifficultyValue;
  response_language: UiLanguage;
  ingredients_owned: string[];
  used_ingredients: string[];
  required_ingredients: string[];
};

export type RecipeDetailStep = {
  step_order: number;
  step_title: string;
  instruction: string;
  timer_seconds: number | null;
};

export type RecipeDetailResponse = {
  recipe_name: string;
  difficulty: RecipeDifficultyValue;
  total_cooking_time_minutes: number;
  tips: string[];
  steps: RecipeDetailStep[];
};

export type GeneratedRecommendation = RecommendRecipeItem & {
  id: string;
};

export type GeneratedRecipeDetail = {
  id: string;
  recommendation: GeneratedRecommendation;
  ingredientsOwned: IngredientTag[];
  detail: RecipeDetailResponse;
};
