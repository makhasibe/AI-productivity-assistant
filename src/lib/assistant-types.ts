export type ToolKey = "email" | "meeting" | "planner" | "research";

export type EmailOutput = {
  subject: string;
  body: string;
  notes: string[];
};

export type MeetingOutput = {
  summary: string;
  actionItems: { owner: string; task: string; due: string }[];
  decisions: string[];
  deadlines: { what: string; when: string }[];
  risks: string[];
};

export type PlannerOutput = {
  prioritized: { task: string; priority: string; reason: string; estimate: string }[];
  schedule: { start: string; end: string; block: string; type: string }[];
  advice: string[];
};

export type ResearchOutput = {
  overview: string;
  insights: { title: string; detail: string }[];
  takeaways: string[];
  recommendations: { action: string; rationale: string }[];
  openQuestions: string[];
  verify: string[];
};

export type GenerationRow = {
  id: string;
  tool: string;
  title: string;
  inputs: Record<string, unknown>;
  output: Record<string, unknown>;
  created_at: string;
};

export const TONES = [
  "Professional",
  "Friendly",
  "Persuasive",
  "Concise",
  "Apologetic",
  "Assertive",
] as const;

export const LENGTHS = ["Short", "Medium", "Long"] as const;

export const DEPTHS = ["Quick scan", "Balanced brief", "Deep dive"] as const;

export const ENERGY = [
  "Morning person — sharpest before noon",
  "Steady all day",
  "Afternoon peak",
  "Night owl — best late in the day",
] as const;

export const DISCLAIMER =
  "AI-generated. It can be confidently wrong — review, edit and fact-check before you send or act on this.";
