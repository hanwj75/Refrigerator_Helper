import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getIngredientTagLabel,
  normalizeIngredientTag,
  sanitizeIngredientTag,
} from "@/features/recipes/ingredientDictionary";
import type {
  GeneratedRecipeDetail,
  GeneratedRecommendation,
  IngredientTag,
  RecipeDetailResponse,
  RecommendRecipeItem,
} from "@/features/recipes/types";
import { buildGeneratedRecommendationId } from "@/features/recipes/utils";
import type { RecipeDifficulty, UiLanguage } from "@/types/ui";

export type AuthUserSummary = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

type RecipeState = {
  language: UiLanguage;
  authReady: boolean;
  authSession: Session | null;
  authUser: AuthUserSummary | null;
  selectedIngredients: IngredientTag[];
  hasSubmittedRecommendationRequest: boolean;
  selectedDifficulty: RecipeDifficulty;
  generatedRecommendations: GeneratedRecommendation[];
  generatedRecipeDetails: Record<string, GeneratedRecipeDetail>;
  selectedRecipeId: string | null;
  completedRecipeId: string | null;
  savedRecipeIds: string[];
  votedRecipeIds: string[];
  setLanguage: (language: UiLanguage) => void;
  setAuthState: (session: Session | null, user: AuthUserSummary | null) => void;
  setAuthReady: (ready: boolean) => void;
  setSelectedIngredients: (ingredients: IngredientTag[]) => void;
  setHasSubmittedRecommendationRequest: (submitted: boolean) => void;
  setSelectedDifficulty: (difficulty: RecipeDifficulty) => void;
  generateRecommendations: (ingredients?: IngredientTag[], difficulty?: RecipeDifficulty) => void;
  setGeneratedRecommendations: (recipes: RecommendRecipeItem[]) => void;
  clearGeneratedRecommendations: () => void;
  getGeneratedRecommendationById: (id: string) => GeneratedRecommendation | null;
  setGeneratedRecipeDetail: (
    recommendationId: string,
    detail: RecipeDetailResponse,
    ingredientsOwned: IngredientTag[],
  ) => void;
  getGeneratedRecipeDetailById: (id: string) => GeneratedRecipeDetail | null;
  setSelectedRecipeId: (id: string | null) => void;
  setCompletedRecipeId: (id: string | null) => void;
  saveRecipe: (id: string) => boolean;
  unsaveRecipeLocally: (id: string) => void;
  syncSavedRecipeIds: (ids: string[]) => void;
  addVoteLocally: (id: string) => boolean;
  removeVoteLocally: (id: string) => void;
  syncVotedRecipeIds: (ids: string[]) => void;
};

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      language: "ko",
      authReady: false,
      authSession: null,
      authUser: null,
      selectedIngredients: [],
      hasSubmittedRecommendationRequest: false,
      selectedDifficulty: "any",
      generatedRecommendations: [],
      generatedRecipeDetails: {},
      selectedRecipeId: null,
      completedRecipeId: null,
      savedRecipeIds: [],
      votedRecipeIds: [],
      setLanguage: (language) => set({ language }),
      setAuthState: (authSession, authUser) => set({ authSession, authUser }),
      setAuthReady: (authReady) => set({ authReady }),
      setSelectedIngredients: (selectedIngredients) =>
        set({
          selectedIngredients: selectedIngredients
            .map((tag) => sanitizeIngredientTag(tag))
            .filter((tag, index, array): tag is IngredientTag => {
              if (!tag) {
                return false;
              }

              const visibleLabel =
                getIngredientTagLabel(tag, "ko").trim() || getIngredientTagLabel(tag, "en").trim();

              if (!visibleLabel) {
                return false;
              }

              return (
                array.findIndex(
                  (candidate) =>
                    candidate &&
                    normalizeIngredientTag(candidate.id) === normalizeIngredientTag(tag.id),
                ) === index
              );
            }),
        }),
      setHasSubmittedRecommendationRequest: (hasSubmittedRecommendationRequest) =>
        set({ hasSubmittedRecommendationRequest }),
      setSelectedDifficulty: (selectedDifficulty) => set({ selectedDifficulty }),
      generateRecommendations: () =>
        set({
          generatedRecommendations: [],
          generatedRecipeDetails: {},
          hasSubmittedRecommendationRequest: true,
        }),
      setGeneratedRecommendations: (recipes) =>
        set({
          generatedRecommendations: recipes.map((recipe, index) => ({
            ...recipe,
            id: buildGeneratedRecommendationId(recipe.recipe_name, index),
          })),
          hasSubmittedRecommendationRequest: true,
        }),
      clearGeneratedRecommendations: () =>
        set({
          generatedRecommendations: [],
          generatedRecipeDetails: {},
          hasSubmittedRecommendationRequest: false,
        }),
      getGeneratedRecommendationById: (id) =>
        get().generatedRecommendations.find((recipe) => recipe.id === id) ?? null,
      setGeneratedRecipeDetail: (recommendationId, detail, ingredientsOwned) =>
        set((state) => {
          const recommendation =
            state.generatedRecommendations.find((recipe) => recipe.id === recommendationId) ?? null;

          if (!recommendation) {
            return state;
          }

          return {
            generatedRecipeDetails: {
              ...state.generatedRecipeDetails,
              [recommendationId]: {
                id: recommendationId,
                recommendation,
                ingredientsOwned,
                detail,
              },
            },
          };
        }),
      getGeneratedRecipeDetailById: (id) => get().generatedRecipeDetails[id] ?? null,
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
      unsaveRecipeLocally: (id) =>
        set((state) => ({
          savedRecipeIds: state.savedRecipeIds.filter((savedId) => savedId !== id),
        })),
      syncSavedRecipeIds: (ids) => set({ savedRecipeIds: Array.from(new Set(ids)) }),
      addVoteLocally: (id) => {
        const { votedRecipeIds } = get();

        if (votedRecipeIds.includes(id)) {
          return false;
        }

        set({ votedRecipeIds: [...votedRecipeIds, id] });
        return true;
      },
      removeVoteLocally: (id) =>
        set((state) => ({
          votedRecipeIds: state.votedRecipeIds.filter((voteId) => voteId !== id),
        })),
      syncVotedRecipeIds: (ids) => set({ votedRecipeIds: Array.from(new Set(ids)) }),
    }),
    {
      name: "refrigerator-helper-store",
      partialize: (state) => ({
        language: state.language,
        selectedIngredients: state.selectedIngredients,
        selectedDifficulty: state.selectedDifficulty,
        completedRecipeId: state.completedRecipeId,
        savedRecipeIds: state.savedRecipeIds,
        votedRecipeIds: state.votedRecipeIds,
      }),
    },
  ),
);
