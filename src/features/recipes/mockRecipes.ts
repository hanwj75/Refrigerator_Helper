import type { Recipe } from "@/types/recipe";

export const mockRecipes: Recipe[] = [
  {
    id: "recipe-1",
    title: "토마토 달걀 볶음",
    description: "빠르게 개발용 UI를 확인할 수 있는 예시 레시피입니다.",
    cookingTimeMinutes: 15,
    ingredients: [
      { id: "ingredient-1", name: "토마토", amount: "2개" },
      { id: "ingredient-2", name: "달걀", amount: "3개" },
    ],
    steps: [
      { id: "step-1", order: 1, instruction: "재료를 손질합니다." },
      { id: "step-2", order: 2, instruction: "팬에 볶아 완성합니다." },
    ],
  },
];
