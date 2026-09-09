import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Save, Sparkle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { HistoryPanel } from "@/components/history-panel";
import {
  CopyButton,
  Disclaimer,
  EmptyState,
  PageHeader,
  ResultSkeleton,
  SectionCard,
} from "@/components/result-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveEditedOutput, summarizeMeeting } from "@/lib/assistant.functions";
import type { MeetingOutput } from "@/lib/assistant-types";

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting notes summariser — Kestrel" },
      {
        name: "description",
        content:
          "Paste rough meeting notes or a transcript and get a summary, action items with owners, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting notes summariser — Kestrel" },
      {
        property: "og:description",
        content: "Summary, action items, decisions and deadlines from raw notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [form, setForm] = useState({ title: "", attendees: "", notes: "" });
  const [id, setId] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingOutput | null>(null);
  const qc = useQueryClient();
  const run = useServerFn(summarizeMeeting);
  const save = useServerFn(saveEditedOutput);

  const gen = useMutation({
    mutationFn: async () => run({ data: form }),
    onSuccess: async (res) => {
      setId(res.id);
      setResult(res.output as MeetingOutput);
      await qc.invalidateQueries({ queryKey: ["generations", "meeting"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const persist = useMutation({
    mutationFn: async () => save({ data: { id: id!, output: result as never } }),
    onSuccess: () => toast.success("Your edits are saved"),
    onError: (e: Error) => toast.error(e.message),
  });

  const plain = result
    ? [
        `Summary\n${result.summary}`,
        `Action items\n${result.actionItems.map((a) => `- ${a.task} — ${a.owner} (${a.due})`).join("\n")}`,
        `Decisions\n${result.decisions.map((d) => `- ${d}`).join("\n")}`,
        `Deadlines\n${result.deadlines.map((d) => `- ${d.what}: ${d.when}`).join("\n")}`,
      ].join("\n\n")
    : "";

  return (
    <div>
      <PageHeader
        title="Meeting notes"
        description="Paste whatever you scribbled down or the raw transcript. You'll get a clean summary, who owes what, decisions made and dates to watch."
        icon={<NotebookPen className="h-5 w-5" aria-hidden="true" />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  gen.mutate();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Meeting title</Label>
                    <Input
                      id="title"
                      placeholder="Q3 roadmap review"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="attendees">Who was there?</Label>
                    <Input
                      id="attendees"
                      placeholder="Sam, Priya, Dan"
                      value={form.attendees}
                      onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Notes or transcript</Label>
                  <Textarea
                    id="notes"
                    required
                    rows={14}
                    placeholder="Paste everything — messy is fine."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={gen.isPending}>
                  <Sparkle className="h-4 w-4" />
                  {gen.isPending ? "Reading your notes…" : "Summarise the meeting"}
                </Button>
                <Disclaimer />
              </form>
            </CardContent>
          </Card>

          <HistoryPanel
            tool="meeting"
            onOpen={(row) => {
              setId(row.id);
              setResult(row.output as unknown as MeetingOutput);
              setForm(row.inputs as typeof form);
            }}
          />
        </div>

        <div className="space-y-4">
          {gen.isPending && <ResultSkeleton />}
          {!gen.isPending && !result && (
            <EmptyState>Your summary, actions and deadlines will land here.</EmptyState>
          )}
          {!gen.isPending && result && (
            <>
              <SectionCard title="Summary" action={<CopyButton value={result.summary} />}>
                <Textarea
                  aria-label="Summary"
                  rows={6}
                  value={result.summary}
                  onChange={(e) => setResult({ ...result, summary: e.target.value })}
                />
              </SectionCard>

              <SectionCard title="Action items">
                {result.actionItems.length === 0 && (
                  <p className="text-muted-foreground text-sm">None captured.</p>
                )}
                {result.actionItems.map((item, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_140px_140px]">
                    <Input
                      aria-label={`Task ${i + 1}`}
                      value={item.task}
                      onChange={(e) => {
                        const next = [...result.actionItems];
                        next[i] = { ...item, task: e.target.value };
                        setResult({ ...result, actionItems: next });
                      }}
                    />
                    <Input
                      aria-label={`Owner ${i + 1}`}
                      value={item.owner}
                      onChange={(e) => {
                        const next = [...result.actionItems];
                        next[i] = { ...item, owner: e.target.value };
                        setResult({ ...result, actionItems: next });
                      }}
                    />
                    <Input
                      aria-label={`Due ${i + 1}`}
                      value={item.due}
                      onChange={(e) => {
                        const next = [...result.actionItems];
                        next[i] = { ...item, due: e.target.value };
                        setResult({ ...result, actionItems: next });
                      }}
                    />
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="Decisions">
                <EditableList
                  values={result.decisions}
                  label="Decision"
                  onChange={(decisions) => setResult({ ...result, decisions })}
                />
              </SectionCard>

              <SectionCard title="Deadlines">
                {result.deadlines.length === 0 && (
                  <p className="text-muted-foreground text-sm">None mentioned.</p>
                )}
                {result.deadlines.map((d, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_160px]">
                    <Input
                      aria-label={`Deadline ${i + 1}`}
                      value={d.what}
                      onChange={(e) => {
                        const next = [...result.deadlines];
                        next[i] = { ...d, what: e.target.value };
                        setResult({ ...result, deadlines: next });
                      }}
                    />
                    <Input
                      aria-label={`Deadline date ${i + 1}`}
                      value={d.when}
                      onChange={(e) => {
                        const next = [...result.deadlines];
                        next[i] = { ...d, when: e.target.value };
                        setResult({ ...result, deadlines: next });
                      }}
                    />
                  </div>
                ))}
              </SectionCard>

              {result.risks?.length > 0 && (
                <SectionCard title="Worth watching">
                  <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
                    {result.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => persist.mutate()}
                  disabled={!id || persist.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {persist.isPending ? "Saving…" : "Save my edits"}
                </Button>
                <CopyButton value={plain} label="Copy everything" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EditableList({
  values,
  label,
  onChange,
}: {
  values: string[];
  label: string;
  onChange: (v: string[]) => void;
}) {
  if (values.length === 0) return <p className="text-muted-foreground text-sm">None captured.</p>;
  return (
    <>
      {values.map((v, i) => (
        <Input
          key={i}
          aria-label={`${label} ${i + 1}`}
          value={v}
          onChange={(e) => {
            const next = [...values];
            next[i] = e.target.value;
            onChange(next);
          }}
        />
      ))}
    </>
  );
}
