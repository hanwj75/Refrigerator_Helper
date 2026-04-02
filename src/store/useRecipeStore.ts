import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translateIngredientTag } from "@/features/recipes/ingredientDictionary";
import { getRecommendedRecipes } from "@/features/recipes/utils";
import type { RecipeDifficulty, UiLanguage } from "@/types/ui";

type RecipeState = {
  language: UiLanguage;
  selectedIngredients: string[];
  selectedDifficulty: RecipeDifficulty;
  recommendedRecipeIds: string[];
  selectedRecipeId: string | null;
  completedRecipeId: string | null;
  savedRecipeIds: string[];
  setLanguage: (language: UiLanguage) => void;
  setSelectedIngredients: (ingredients: string[]) => void;
  setSelectedDifficulty: (difficulty: RecipeDifficulty) => void;
  generateRecommendations: (ingredients?: string[], difficulty?: RecipeDifficulty) => void;
  setSelectedRecipeId: (id: string | null) => void;
  setCompletedRecipeId: (id: string | null) => void;
  saveRecipe: (id: string) => boolean;
};

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      language: "ko",
      selectedIngredients: [],
      selectedDifficulty: "any",
      recommendedRecipeIds: [],
      selectedRecipeId: null,
      completedRecipeId: null,
      savedRecipeIds: [],
      setLanguage: (language) =>
        set((state) => ({
          language,
          selectedIngredients: state.selectedIngredients.map((ingredient) =>
            translateIngredientTag(ingredient, language),
          ),
        })),
      setSelectedIngredients: (selectedIngredients) => set({ selectedIngredients }),
      setSelectedDifficulty: (selectedDifficulty) => set({ selectedDifficulty }),
      generateRecommendations: (ingredients, difficulty) => {
        const selectedIngredients = ingredients ?? get().selectedIngredients;
        const selectedDifficulty = difficulty ?? get().selectedDifficulty;
        const recommendedRecipeIds = getRecommendedRecipes(selectedIngredients, selectedDifficulty).map(
          (recipe) => recipe.id,
        );

        set({ recommendedRecipeIds });
      },
      setSelectedRecipeId: (selectedRecipeId) => set({ selectedRecipeId }),
      setCompletedRecipeId: (completedRecipeId) => set({ completedRecipeId }),
      saveRecipe: (id) => {
        const { savedRecipeIds } = get();

        if (savedRecipeIds.includes(id)) {
          return false;
        }

        set({ savedRecipeIds: [...savedRecipeIds, id] });
        return true;
      },
    }),
    {
      name: "refrigerator-helper-store",
      partialize: (state) => ({
        language: state.language,
        selectedIngredients: state.selectedIngredients,
        selectedDifficulty: state.selectedDifficulty,
        recommendedRecipeIds: state.recommendedRecipeIds,
        completedRecipeId: state.completedRecipeId,
        savedRecipeIds: state.savedRecipeIds,
      }),
    },
  ),
);
