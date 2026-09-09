import { Check, Copy, Info } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DISCLAIMER } from "@/lib/assistant-types";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="bg-accent text-accent-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </span>
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{description}</p>
      </div>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-muted-foreground flex items-start gap-2 rounded-lg border border-dashed px-3 py-2 text-xs",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{DISCLAIMER}</span>
    </p>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Copied to your clipboard");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Your browser blocked copying. Select the text and copy manually.");
        }
      }}
      className="gap-1.5"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/70 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold tracking-wide uppercase">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <Card key={i} className="border-border/70">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-4/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
      {children}
    </div>
  );
}
