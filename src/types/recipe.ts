export type RecipeIngredient = {
  id: string;
  name: string;
  amount?: string;
};

export type RecipeStep = {
  id: string;
  order: number;
  instruction: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  cookingTimeMinutes?: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};
