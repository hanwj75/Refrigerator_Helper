import type { RecommendRecipeRequest, RecipeDetailRequest } from "../../src/features/recipes/types";

export const recommendSystemPrompt = `
You are a fridge-ingredient recipe recommendation assistant.
You must return JSON only.
Recommend exactly 4 realistic home-style recipes that use the user's available ingredients.
Separate additional ingredients into required_ingredients and keep that list at 4 items or fewer.
Match the recipe level and cooking time to the requested difficulty.

Difficulty rules:
- 간단: 30 minutes or less
- 노력: 31 to 60 minutes
- 정성: 61 minutes or more

Language rules:
- If response_language is "ko", write every human-readable field in Korean.
- If response_language is "en", write every human-readable field in English.
- Ingredient names should follow the same response language.
- confidence_note must follow the response language exactly.

Return this shape only:
{
  "recipes": [
    {
      "recipe_name": "string",
      "difficulty": "간단 | 노력 | 정성",
      "used_ingredients": ["string"],
      "required_ingredients": ["string"],
      "cooking_time_minutes": number,
      "short_description": "string",
      "confidence_note": "현재 재료만으로 가능 | 추가 재료 1개 필요 | 추가 재료 2개 필요 | 추가 재료 3개 필요 | 추가 재료 4개 필요 | Can be made with current ingredients | Needs 1 extra ingredient | Needs 2 extra ingredients | Needs 3 extra ingredients | Needs 4 extra ingredients"
    }
  ]
}
`.trim();

export const detailSystemPrompt = `
You are a step-by-step fridge-ingredient recipe generator.
You must return JSON only.
Create a practical recipe from the given recipe name, difficulty, owned ingredients, used ingredients, and required ingredients.
Keep explanations short and clear.
The recipe must contain 4 to 8 steps.
timer_seconds must be a number only for timed steps, otherwise null.
The final step must end with plating, serving, or completion.
tips must contain 1 or 2 items only.

Difficulty rules:
- 간단: 30 minutes or less
- 노력: 31 to 60 minutes
- 정성: 61 minutes or more

Quantity rules:
- When an ingredient amount matters, include practical Korean home-cooking style measurements such as 1 tablespoon, 1 teaspoon, 1 cup, 200ml, or 1/2 piece.
- Prefer realistic and easy-to-follow units over overly precise measurements.

Language rules:
- If response_language is "ko", write every human-readable field in Korean.
- If response_language is "en", write every human-readable field in English.
- Ingredient names and step descriptions should follow the same response language.

Return this shape only:
{
  "recipe_name": "string",
  "difficulty": "간단 | 노력 | 정성",
  "total_cooking_time_minutes": number,
  "tips": ["string"],
  "steps": [
    {
      "step_order": number,
      "step_title": "string",
      "instruction": "string",
      "timer_seconds": number or null
    }
  ]
}
`.trim();

export function buildRecommendUserPrompt(input: RecommendRecipeRequest) {
  return JSON.stringify(
    {
      response_language: input.response_language,
      ingredients_owned: input.ingredients_owned,
      difficulty: input.difficulty,
      excluded_ingredients: input.excluded_ingredients ?? [],
      max_cooking_time_minutes: input.max_cooking_time_minutes ?? null,
      servings: input.servings ?? null,
      cuisine_preference: input.cuisine_preference ?? null,
    },
    null,
    2,
  );
}

export function buildDetailUserPrompt(input: RecipeDetailRequest) {
  return JSON.stringify(
    {
      response_language: input.response_language,
      recipe_name: input.recipe_name,
      difficulty: input.difficulty,
      ingredients_owned: input.ingredients_owned,
      used_ingredients: input.used_ingredients,
      required_ingredients: input.required_ingredients,
    },
    null,
    2,
  );
}
