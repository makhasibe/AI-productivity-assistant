import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  EmailOutput,
  MeetingOutput,
  PlannerOutput,
  ResearchOutput,
} from "./assistant-types";

const emailInput = z.object({
  recipient: z.string().min(1),
  relationship: z.string().default(""),
  purpose: z.string().min(1),
  keyPoints: z.string().default(""),
  tone: z.string().min(1),
  length: z.string().min(1),
  senderName: z.string().default(""),
});

const meetingInput = z.object({
  title: z.string().default(""),
  attendees: z.string().default(""),
  notes: z.string().min(1),
});

const plannerInput = z.object({
  tasks: z.string().min(1),
  workStart: z.string().min(1),
  workEnd: z.string().min(1),
  energy: z.string().min(1),
  date: z.string().default(""),
  constraints: z.string().default(""),
});

const researchInput = z.object({
  topic: z.string().min(1),
  goal: z.string().default(""),
  sources: z.string().default(""),
  depth: z.string().min(1),
});

type SaveArgs = {
  supabase: { from: (table: string) => any };
  userId: string;
  tool: string;
  title: string;
  inputs: unknown;
  output: unknown;
};

async function saveGeneration({ supabase, userId, tool, title, inputs, output }: SaveArgs) {
  const { data, error } = await supabase
    .from("generations")
    .insert({ user_id: userId, tool, title: title.slice(0, 120) || "Untitled", inputs, output })
    .select("id")
    .single();
  if (error) throw new Error(`Could not save this result: ${error.message}`);
  return data.id as string;
}

async function runWorkflow<T>(
  build: () => Promise<{ system: string; prompt: string; effort?: "low" | "medium" }>,
): Promise<T> {
  const [{ generateStructured }, { describeAiError }] = await Promise.all([
    import("./ai.server"),
    import("./ai-gateway.server"),
  ]);
  const { system, prompt, effort } = await build();
  try {
    return (await generateStructured({ system, prompt, ...(effort ? { effort } : {}) })) as T;
  } catch (error) {
    console.error("AI workflow failed", error);
    throw new Error(describeAiError(error));
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => emailInput.parse(input))
  .handler(async ({ data, context }) => {
    const { EMAIL_SYSTEM } = await import("./ai-prompts");
    const output = await runWorkflow<EmailOutput>(async () => ({
      system: EMAIL_SYSTEM,
      prompt: [
        `Recipient: ${data.recipient}`,
        `Relationship to sender: ${data.relationship || "not specified"}`,
        `Sender name: ${data.senderName || "not specified"}`,
        `Tone: ${data.tone}`,
        `Length: ${data.length}`,
        `Purpose of the email: ${data.purpose}`,
        `Key points that must appear:\n${data.keyPoints || "none supplied"}`,
      ].join("\n"),
    }));
    const id = await saveGeneration({
      supabase: context.supabase,
      userId: context.userId,
      tool: "email",
      title: `Email to ${data.recipient}`,
      inputs: data,
      output,
    });
    return { id, output };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => meetingInput.parse(input))
  .handler(async ({ data, context }) => {
    const { MEETING_SYSTEM } = await import("./ai-prompts");
    const output = await runWorkflow<MeetingOutput>(async () => ({
      system: MEETING_SYSTEM,
      prompt: [
        `Meeting title: ${data.title || "not specified"}`,
        `Attendees: ${data.attendees || "not specified"}`,
        `Raw notes or transcript:\n"""\n${data.notes}\n"""`,
      ].join("\n"),
      effort: "medium" as const,
    }));
    const id = await saveGeneration({
      supabase: context.supabase,
      userId: context.userId,
      tool: "meeting",
      title: data.title || "Meeting summary",
      inputs: data,
      output,
    });
    return { id, output };
  });

export const planDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => plannerInput.parse(input))
  .handler(async ({ data, context }) => {
    const { PLANNER_SYSTEM } = await import("./ai-prompts");
    const output = await runWorkflow<PlannerOutput>(async () => ({
      system: PLANNER_SYSTEM,
      prompt: [
        `Date being planned: ${data.date || "today"}`,
        `Working hours: ${data.workStart} to ${data.workEnd}`,
        `Energy pattern: ${data.energy}`,
        `Fixed commitments and constraints: ${data.constraints || "none given"}`,
        `Tasks (one per line):\n${data.tasks}`,
      ].join("\n"),
      effort: "medium" as const,
    }));
    const id = await saveGeneration({
      supabase: context.supabase,
      userId: context.userId,
      tool: "planner",
      title: `Plan for ${data.date || "today"}`,
      inputs: data,
      output,
    });
    return { id, output };
  });

export const runResearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => researchInput.parse(input))
  .handler(async ({ data, context }) => {
    const { RESEARCH_SYSTEM } = await import("./ai-prompts");
    const output = await runWorkflow<ResearchOutput>(async () => ({
      system: RESEARCH_SYSTEM,
      prompt: [
        `Topic: ${data.topic}`,
        `What the reader needs it for: ${data.goal || "general understanding"}`,
        `Requested depth: ${data.depth}`,
        data.sources
          ? `Source material supplied by the user:\n"""\n${data.sources}\n"""`
          : "No source material was supplied.",
      ].join("\n"),
      effort: "medium" as const,
    }));
    const id = await saveGeneration({
      supabase: context.supabase,
      userId: context.userId,
      tool: "research",
      title: data.topic,
      inputs: data,
      output,
    });
    return { id, output };
  });

export const listGenerations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ tool: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("generations")
      .select("id, tool, title, inputs, output, created_at")
      .eq("tool", data.tool)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const saveEditedOutput = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), output: z.record(z.unknown()) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("generations")
      .update({ output: data.output as never })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("generations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------- chat ---------------------------------- */

export const listThreads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .insert({ user_id: context.userId, title: "New conversation" })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const getThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ threadId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const [thread, messages] = await Promise.all([
      context.supabase
        .from("chat_threads")
        .select("id, title")
        .eq("id", data.threadId)
        .maybeSingle(),
      context.supabase
        .from("chat_messages")
        .select("id, role, content, created_at")
        .eq("thread_id", data.threadId)
        .order("created_at", { ascending: true }),
    ]);
    if (thread.error) throw new Error(thread.error.message);
    if (messages.error) throw new Error(messages.error.message);
    return { thread: thread.data, messages: messages.data ?? [] };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
