import { ZodError } from "zod";
import { jsonError, jsonSuccess, parseJsonBody } from "../_shared/http";
import { requestOpenAIJson } from "../_shared/openai";
import { buildDetailUserPrompt, detailSystemPrompt } from "../_shared/prompts";
import {
  recipeDetailRequestSchema,
  recipeDetailResponseJsonSchema,
  recipeDetailResponseSchema,
} from "../_shared/schemas";

interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return jsonError(405, "METHOD_NOT_ALLOWED", "Only POST requests are allowed.");
  }

  try {
    const requestBody = await parseJsonBody(context.request);
    const input = recipeDetailRequestSchema.parse(requestBody);

    const result = await requestOpenAIJson({
      env: context.env,
      systemPrompt: detailSystemPrompt,
      userPrompt: buildDetailUserPrompt(input),
      schema: {
        name: "recipe_detail_response",
        description: "A single detailed recipe with practical steps in JSON format.",
        schema: recipeDetailResponseJsonSchema,
      },
    });

    const validated = recipeDetailResponseSchema.parse(result);
    return jsonSuccess(validated);
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, "INVALID_REQUEST_BODY", "Recipe detail request validation failed.");
    }

    if (error instanceof Error && error.message.includes("JSON")) {
      return jsonError(
        502,
        "INVALID_OPENAI_RESPONSE",
        "Recipe detail response was not valid JSON or failed schema validation.",
      );
    }

    if (error instanceof Error && error.message.includes("OpenAI")) {
      return jsonError(502, "OPENAI_REQUEST_FAILED", error.message);
    }

    return jsonError(
      502,
      "INVALID_OPENAI_RESPONSE",
      "Recipe detail response validation failed.",
    );
  }
};
