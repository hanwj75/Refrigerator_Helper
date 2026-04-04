import { ZodError } from "zod";
import { jsonError, jsonSuccess, parseJsonBody } from "../_shared/http";
import { requestOpenAIJson } from "../_shared/openai";
import { buildRecommendUserPrompt, recommendSystemPrompt } from "../_shared/prompts";
import {
  recommendRequestSchema,
  recommendResponseJsonSchema,
  recommendResponseSchema,
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
    const input = recommendRequestSchema.parse(requestBody);

    const result = await requestOpenAIJson({
      env: context.env,
      systemPrompt: recommendSystemPrompt,
      userPrompt: buildRecommendUserPrompt(input),
      schema: {
        name: "recipe_recommendation_response",
        description: "Four realistic home-style recipe recommendations in JSON format.",
        schema: recommendResponseJsonSchema,
      },
    });

    const validated = recommendResponseSchema.parse(result);
    return jsonSuccess(validated);
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, "INVALID_REQUEST_BODY", "Recommendation request validation failed.");
    }

    if (error instanceof Error && error.message.includes("JSON")) {
      return jsonError(
        502,
        "INVALID_OPENAI_RESPONSE",
        "Recommendation response was not valid JSON or failed schema validation.",
      );
    }

    if (error instanceof Error && error.message.includes("OpenAI")) {
      return jsonError(502, "OPENAI_REQUEST_FAILED", error.message);
    }

    return jsonError(
      502,
      "INVALID_OPENAI_RESPONSE",
      "Recommendation response validation failed.",
    );
  }
};
