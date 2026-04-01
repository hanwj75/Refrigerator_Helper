import { create } from "zustand";

type RecipeState = {
  selectedRecipeId: string | null;
  setSelectedRecipeId: (id: string | null) => void;
};

export const useRecipeStore = create<RecipeState>((set) => ({
  selectedRecipeId: null,
  setSelectedRecipeId: (id) => set({ selectedRecipeId: id }),
}));
