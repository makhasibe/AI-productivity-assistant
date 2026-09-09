import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Save, Sparkle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, saveEditedOutput } from "@/lib/assistant.functions";
import { LENGTHS, TONES, type EmailOutput } from "@/lib/assistant-types";

export const Route = createFileRoute("/_authenticated/email")({
  head: () => ({
    meta: [
      { title: "Email writer — Kestrel" },
      {
        name: "description",
        content:
          "Generate a work email in the tone you choose, then edit the subject line and body before sending.",
      },
      { property: "og:title", content: "Email writer — Kestrel" },
      {
        property: "og:description",
        content: "Describe the situation, pick a tone, get an editable draft.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [form, setForm] = useState({
    recipient: "",
    relationship: "",
    purpose: "",
    keyPoints: "",
    tone: TONES[0] as string,
    length: LENGTHS[1] as string,
    senderName: "",
  });
  const [id, setId] = useState<string | null>(null);
  const [result, setResult] = useState<EmailOutput | null>(null);
  const qc = useQueryClient();
  const run = useServerFn(generateEmail);
  const save = useServerFn(saveEditedOutput);

  const gen = useMutation({
    mutationFn: async () => run({ data: form }),
    onSuccess: async (res) => {
      setId(res.id);
      setResult(res.output as EmailOutput);
      await qc.invalidateQueries({ queryKey: ["generations", "email"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const persist = useMutation({
    mutationFn: async () => save({ data: { id: id!, output: result as never } }),
    onSuccess: () => toast.success("Your edits are saved"),
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        title="Email writer"
        description="Tell it who you're writing to and what needs to land. You'll get a subject line and body you can edit before sending."
        icon={<Mail className="h-5 w-5" aria-hidden="true" />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  gen.mutate();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="recipient">Who is it going to?</Label>
                    <Input
                      id="recipient"
                      required
                      placeholder="Priya, our supplier contact"
                      value={form.recipient}
                      onChange={(e) => set("recipient")(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="relationship">Your relationship</Label>
                    <Input
                      id="relationship"
                      placeholder="External vendor, first contact"
                      value={form.relationship}
                      onChange={(e) => set("relationship")(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="purpose">What do you need this email to do?</Label>
                  <Textarea
                    id="purpose"
                    required
                    rows={3}
                    placeholder="Chase the delayed shipment and get a firm delivery date without damaging the relationship."
                    value={form.purpose}
                    onChange={(e) => set("purpose")(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="keyPoints">Points that must appear (one per line)</Label>
                  <Textarea
                    id="keyPoints"
                    rows={3}
                    placeholder={"Order #4821\nPromised 12 March\nWe need it before the 20th"}
                    value={form.keyPoints}
                    onChange={(e) => set("keyPoints")(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={form.tone} onValueChange={set("tone")}>
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="length">Length</Label>
                    <Select value={form.length} onValueChange={set("length")}>
                      <SelectTrigger id="length">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LENGTHS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="senderName">Sign off as</Label>
                    <Input
                      id="senderName"
                      placeholder="Sam"
                      value={form.senderName}
                      onChange={(e) => set("senderName")(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={gen.isPending}>
                  <Sparkle className="h-4 w-4" />
                  {gen.isPending ? "Writing your draft…" : "Write the email"}
                </Button>
                <Disclaimer />
              </form>
            </CardContent>
          </Card>

          <HistoryPanel
            tool="email"
            onOpen={(row) => {
              setId(row.id);
              setResult(row.output as unknown as EmailOutput);
              setForm((f) => ({ ...f, ...(row.inputs as typeof form) }));
            }}
          />
        </div>

        <div className="space-y-4">
          {gen.isPending && <ResultSkeleton />}
          {!gen.isPending && !result && (
            <EmptyState>Your draft will appear here, fully editable.</EmptyState>
          )}
          {!gen.isPending && result && (
            <>
              <SectionCard
                title="Subject line"
                action={<CopyButton value={result.subject} label="Copy" />}
              >
                <Input
                  aria-label="Subject line"
                  value={result.subject}
                  onChange={(e) => setResult({ ...result, subject: e.target.value })}
                />
              </SectionCard>

              <SectionCard
                title="Email body"
                action={<CopyButton value={result.body} label="Copy" />}
              >
                <Textarea
                  aria-label="Email body"
                  rows={16}
                  value={result.body}
                  onChange={(e) => setResult({ ...result, body: e.target.value })}
                  className="leading-relaxed"
                />
              </SectionCard>

              {result.notes?.length > 0 && (
                <SectionCard title="Before you send">
                  <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
                    {result.notes.map((n, i) => (
                      <li key={i}>{n}</li>
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
                <CopyButton
                  value={`Subject: ${result.subject}\n\n${result.body}`}
                  label="Copy whole email"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
