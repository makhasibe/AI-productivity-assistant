import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { CHAT_MODEL, createResponsesGateway, describeAiError } from "@/lib/ai-gateway.server";
import { CHAT_SYSTEM } from "@/lib/ai-prompts";

type Body = { messages?: UIMessage[]; threadId?: string };

function textOf(message: UIMessage) {
  return (message.parts ?? [])
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Sign in to use the assistant.", { status: 401 });

        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${token}` } },
          },
        );
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          return new Response("Your session has expired. Please sign in again.", { status: 401 });
        }
        const userId = userData.user.id;

        const body = (await request.json()) as Body;
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("No message to send.", { status: 400 });
        }
        const threadId = body.threadId;

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI is not configured for this workspace.", { status: 500 });

        // Recent work in the other tools, used as light context for the assistant.
        const { data: recent } = await supabase
          .from("generations")
          .select("tool, title, created_at")
          .order("created_at", { ascending: false })
          .limit(6);

        const contextBlock =
          recent && recent.length > 0
            ? `\n\nRecent work this person did in the app (most recent first):\n${recent
                .map((row) => `- ${row.tool}: ${row.title}`)
                .join("\n")}`
            : "\n\nThis person has not generated anything in the other tools yet.";

        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (threadId && lastUser) {
          await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            content: textOf(lastUser),
          });
          const title = textOf(lastUser).slice(0, 60);
          if (messages.filter((m) => m.role === "user").length === 1 && title) {
            await supabase.from("chat_threads").update({ title }).eq("id", threadId);
          } else {
            await supabase
              .from("chat_threads")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", threadId);
          }
        }

        try {
          const { provider } = createResponsesGateway(apiKey);
          const result = streamText({
            model: provider.responses(CHAT_MODEL),
            system: CHAT_SYSTEM + contextBlock,
            messages: convertToModelMessages(messages),
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
            abortSignal: request.signal,
            onFinish: async ({ text }) => {
              if (!threadId || !text.trim()) return;
              await supabase.from("chat_messages").insert({
                thread_id: threadId,
                user_id: userId,
                role: "assistant",
                content: text,
              });
            },
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: true,
          });
        } catch (error) {
          console.error("chat failed", error);
          return new Response(describeAiError(error), { status: 500 });
        }
      },
    },
  },
});
