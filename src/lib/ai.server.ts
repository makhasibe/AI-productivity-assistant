import { streamText } from "ai";

import { CHAT_MODEL, createResponsesGateway, requireLovableApiKey } from "./ai-gateway.server";

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("The AI returned a result we could not read. Please try again.");
  }
}

/**
 * Runs a structured workflow prompt against Lovable AI and returns parsed JSON.
 * Always streams: reasoning models routinely run long and buffered calls time out.
 */
export async function generateStructured({
  system,
  prompt,
  effort = "low",
}: {
  system: string;
  prompt: string;
  effort?: "low" | "medium" | "high";
}): Promise<unknown> {
  const apiKey = requireLovableApiKey();
  const { provider } = createResponsesGateway(apiKey);

  const result = streamText({
    model: provider.responses(CHAT_MODEL),
    system,
    prompt,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: effort,
        store: false,
      },
    },
  });

  const text = await result.text;
  if (!text.trim()) {
    throw new Error("The AI returned an empty result. Please try again.");
  }
  return extractJson(text);
}
