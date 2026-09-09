import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, CalendarClock, Mail, MessagesSquare, NotebookPen, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Kestrel AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Sign in to Kestrel to draft email, summarise meetings, plan your day and research topics with AI built for work.",
      },
      { property: "og:title", content: "Sign in — Kestrel AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Access your AI workspace for email, meetings, planning, research and chat.",
      },
    ],
  }),
  component: AuthPage,
});

const HIGHLIGHTS = [
  { icon: Mail, text: "Draft email in the exact tone the moment calls for" },
  { icon: NotebookPen, text: "Turn messy meeting notes into actions and decisions" },
  { icon: CalendarClock, text: "Get a prioritised, time-blocked plan for the day" },
  { icon: BookOpen, text: "Research briefs with insights you can act on" },
  { icon: MessagesSquare, text: "A work assistant that knows what you've been doing" },
];

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/" });
    });
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    void navigate({ to: "/" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. Check your inbox if confirmation is required.");
    void navigate({ to: "/" });
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in did not complete. Please try again.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/" });
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="bg-primary text-primary-foreground hidden flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="bg-primary-foreground/15 flex h-10 w-10 items-center justify-center rounded-xl">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold">Kestrel</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl leading-tight font-semibold">
            The AI workspace for the work around the work.
          </h1>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm/6 opacity-90">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs opacity-70">
          Kestrel uses AI. Review everything it produces before you send or act on it.
        </p>
      </section>

      <section className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in to your workspace, or create an account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={google}
              disabled={busy}
            >
              Continue with Google
            </Button>
            <div className="text-muted-foreground my-5 flex items-center gap-3 text-xs">
              <span className="bg-border h-px flex-1" />
              or use your email
              <span className="bg-border h-px flex-1" />
            </div>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={signIn} className="mt-4 space-y-4">
                  <Field
                    id="signin-email"
                    label="Work email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                  />
                  <Field
                    id="signin-password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                  />
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={signUp} className="mt-4 space-y-4">
                  <Field
                    id="signup-email"
                    label="Work email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                  />
                  <Field
                    id="signup-password"
                    label="Password (at least 6 characters)"
                    type="password"
                    value={password}
                    onChange={setPassword}
                  />
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Creating account…" : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-muted-foreground mt-5 text-xs">
              Please don't paste passwords, customer records or other confidential data into this
              assistant.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        required
        autoComplete={type === "password" ? "current-password" : "email"}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
