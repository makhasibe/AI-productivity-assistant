import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Mail,
  MessagesSquare,
  NotebookPen,
  ShieldAlert,
} from "lucide-react";

import { Disclaimer } from "@/components/result-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Overview — Kestrel AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Your AI workspace overview: pick a workflow for email, meeting notes, day planning, research or chat.",
      },
      { property: "og:title", content: "Overview — Kestrel AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Pick a workflow: email, meeting notes, day planning, research or chat.",
      },
    ],
  }),
  component: Overview,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Email writer",
    desc: "Describe the situation, pick a tone, get a subject line and a draft you can edit and send.",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    title: "Meeting notes",
    desc: "Paste rough notes or a transcript and get a summary, action items, decisions and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "Day planner",
    desc: "List today's tasks and get them prioritised into a realistic time-blocked schedule.",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "Research brief",
    desc: "Turn a topic into insights, takeaways, recommendations and things worth verifying.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "Assistant",
    desc: "Chat about your work. It can see the titles of what you've recently created here.",
  },
] as const;

function Overview() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-xs font-semibold tracking-widest uppercase">
          Your workspace
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          What are we getting off your plate today?
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Five workflows, one place. Everything you generate is saved privately to your account and
          stays editable.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="hover:border-primary/50 h-full transition-colors hover:shadow-md">
              <CardHeader className="pb-2">
                <span className="bg-accent text-accent-foreground mb-2 flex h-10 w-10 items-center justify-center rounded-xl">
                  <tool.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardTitle className="font-display flex items-center gap-1.5 text-lg">
                  {tool.title}
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.desc}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-primary/25 bg-accent/40 mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" /> Using this responsibly
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            Keep confidential material out of it — no passwords, customer records, health data or
            anything you wouldn't paste into a shared doc.
          </p>
          <p>
            It can invent names, dates and figures that look convincing. Check anything factual
            against the real source before you rely on it.
          </p>
          <p>
            It isn't a lawyer, doctor, accountant or HR decision-maker. Use it to draft and think,
            not to decide.
          </p>
          <Disclaimer className="bg-background" />
        </CardContent>
      </Card>
    </div>
  );
}
