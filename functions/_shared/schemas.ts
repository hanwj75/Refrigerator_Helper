import { z } from "zod";

const difficultySchema = z.enum(["간단", "노력", "정성"]);
const responseLanguageSchema = z.enum(["ko", "en"]);

const confidenceNoteSchema = z.enum([
  "현재 재료만으로 가능",
  "추가 재료 1개 필요",
  "추가 재료 2개 필요",
  "추가 재료 3개 필요",
  "추가 재료 4개 필요",
  "Can be made with current ingredients",
  "Needs 1 extra ingredient",
  "Needs 2 extra ingredients",
  "Needs 3 extra ingredients",
  "Needs 4 extra ingredients",
]);

function matchesDifficultyTime(difficulty: z.infer<typeof difficultySchema>, minutes: number) {
  if (difficulty === "간단") {
    return minutes <= 30;
  }

  if (difficulty === "노력") {
    return minutes >= 31 && minutes <= 60;
  }

  return minutes >= 61;
}

export const recommendRequestSchema = z.object({
  ingredients_owned: z.array(z.string().trim().min(1)).min(1),
  difficulty: difficultySchema,
  response_language: responseLanguageSchema,
  excluded_ingredients: z.array(z.string().trim().min(1)).optional(),
  max_cooking_time_minutes: z.number().int().positive().max(240).optional(),
  servings: z.number().int().positive().max(12).optional(),
  cuisine_preference: z.string().trim().min(1).nullable().optional(),
});

const recommendRecipeSchema = z
  .object({
    recipe_name: z.string().trim().min(1),
    difficulty: difficultySchema,
    used_ingredients: z.array(z.string().trim().min(1)).min(1),
    required_ingredients: z.array(z.string().trim().min(1)).max(4),
    cooking_time_minutes: z.number().int().positive(),
    short_description: z.string().trim().min(1),
    confidence_note: confidenceNoteSchema,
  })
  .superRefine((value, ctx) => {
    if (!matchesDifficultyTime(value.difficulty, value.cooking_time_minutes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "difficulty와 cooking_time_minutes가 일치하지 않습니다.",
        path: ["cooking_time_minutes"],
      });
    }
  });

export const recommendResponseSchema = z.object({
  recipes: z.array(recommendRecipeSchema).length(4),
});

export const recipeDetailRequestSchema = z.object({
  recipe_name: z.string().trim().min(1),
  difficulty: difficultySchema,
  response_language: responseLanguageSchema,
  ingredients_owned: z.array(z.string().trim().min(1)).min(1),
  used_ingredients: z.array(z.string().trim().min(1)).min(1),
  required_ingredients: z.array(z.string().trim().min(1)).max(4),
});

const recipeStepSchema = z.object({
  step_order: z.number().int().positive(),
  step_title: z.string().trim().min(1),
  instruction: z.string().trim().min(1),
  timer_seconds: z.number().int().positive().nullable(),
});

export const recipeDetailResponseSchema = z
  .object({
    recipe_name: z.string().trim().min(1),
    difficulty: difficultySchema,
    total_cooking_time_minutes: z.number().int().positive(),
    tips: z.array(z.string().trim().min(1)).min(1).max(2),
    steps: z.array(recipeStepSchema).min(4).max(8),
  })
  .superRefine((value, ctx) => {
    if (!matchesDifficultyTime(value.difficulty, value.total_cooking_time_minutes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "difficulty와 total_cooking_time_minutes가 일치하지 않습니다.",
        path: ["total_cooking_time_minutes"],
      });
    }
  });

export const recommendResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["recipes"],
  properties: {
    recipes: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "recipe_name",
          "difficulty",
          "used_ingredients",
          "required_ingredients",
          "cooking_time_minutes",
          "short_description",
          "confidence_note",
        ],
        properties: {
          recipe_name: { type: "string" },
          difficulty: { type: "string", enum: ["간단", "노력", "정성"] },
          used_ingredients: { type: "array", minItems: 1, items: { type: "string" } },
          required_ingredients: { type: "array", maxItems: 4, items: { type: "string" } },
          cooking_time_minutes: { type: "integer", minimum: 1 },
          short_description: { type: "string" },
          confidence_note: {
            type: "string",
            enum: [
              "현재 재료만으로 가능",
              "추가 재료 1개 필요",
              "추가 재료 2개 필요",
              "추가 재료 3개 필요",
              "추가 재료 4개 필요",
              "Can be made with current ingredients",
              "Needs 1 extra ingredient",
              "Needs 2 extra ingredients",
              "Needs 3 extra ingredients",
              "Needs 4 extra ingredients",
            ],
          },
        },
      },
    },
  },
} as const;

export const recipeDetailResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["recipe_name", "difficulty", "total_cooking_time_minutes", "tips", "steps"],
  properties: {
    recipe_name: { type: "string" },
    difficulty: { type: "string", enum: ["간단", "노력", "정성"] },
    total_cooking_time_minutes: { type: "integer", minimum: 1 },
    tips: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      items: { type: "string" },
    },
    steps: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["step_order", "step_title", "instruction", "timer_seconds"],
        properties: {
          step_order: { type: "integer", minimum: 1 },
          step_title: { type: "string" },
          instruction: { type: "string" },
          timer_seconds: {
            anyOf: [{ type: "integer", minimum: 1 }, { type: "null" }],
          },
        },
      },
    },
  },
} as const;
