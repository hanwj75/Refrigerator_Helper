type OpenAIEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type JsonSchemaFormat = {
  name: string;
  description: string;
  schema: Record<string, unknown>;
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
      refusal?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

function extractOutputText(payload: OpenAIResponsePayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string" && content.text.trim()) {
        return content.text;
      }

      if (content.type === "refusal" && typeof content.refusal === "string" && content.refusal.trim()) {
        throw new Error(content.refusal);
      }
    }
  }

  throw new Error("OpenAI did not return a JSON text response.");
}

export async function requestOpenAIJson({
  env,
  systemPrompt,
  userPrompt,
  schema,
}: {
  env: OpenAIEnv;
  systemPrompt: string;
  userPrompt: string;
  schema: JsonSchemaFormat;
}) {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured in the Cloudflare environment.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          description: schema.description,
          strict: true,
          schema: schema.schema,
        },
      },
    }),
  });

  const payload = (await response.json()) as OpenAIResponsePayload;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `OpenAI request failed. status=${response.status}`);
  }

  const outputText = extractOutputText(payload);

  try {
    return JSON.parse(outputText) as unknown;
  } catch {
    throw new Error("OpenAI response was not valid JSON.");
  }
}
