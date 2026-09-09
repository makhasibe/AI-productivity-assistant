import { createOpenAI } from "@ai-sdk/openai";

export const CHAT_MODEL = "openai/gpt-6-astra";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });

  const publishRunId = (value?: string) => {
    const nextRunId = value?.trim() || undefined;
    if (!runId && nextRunId) runId = nextRunId;
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : runIdReady),
  };
}

export function getLovableAiGatewayRunId(request: Request) {
  return request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
}

export function createResponsesGateway(lovableApiKey: string, initialRunId?: string) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: lovableApiKey,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch as unknown as typeof fetch,
  });
  return { provider, runIdFetch };
}

export function requireLovableApiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this workspace yet.");
  return key;
}

/** Human-readable message for an AI gateway failure. */
export function describeAiError(error: unknown): string {
  const status =
    error && typeof error === "object" && "statusCode" in error
      ? Number((error as { statusCode?: number }).statusCode)
      : undefined;
  if (status === 429) return "The AI service is busy right now. Please try again in a moment.";
  if (status === 402)
    return "This workspace has run out of AI credits. Add more credits to keep generating.";
  if (status === 403) return "AI access is currently blocked for this workspace.";
  if (status === 401) return "AI is not configured correctly for this workspace.";
  if (status && status >= 500) return "The AI service had a temporary problem. Please try again.";
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong while generating. Please try again.";
}
