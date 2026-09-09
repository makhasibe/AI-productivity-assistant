import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { History, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteGeneration, listGenerations } from "@/lib/assistant.functions";
import type { GenerationRow } from "@/lib/assistant-types";

export function useHistory(tool: string) {
  const list = useServerFn(listGenerations);
  return useQuery({
    queryKey: ["generations", tool],
    queryFn: async () => (await list({ data: { tool } })) as unknown as GenerationRow[],
  });
}

export function HistoryPanel({
  tool,
  onOpen,
}: {
  tool: string;
  onOpen: (row: GenerationRow) => void;
}) {
  const { data, isLoading } = useHistory(tool);
  const remove = useServerFn(deleteGeneration);
  const qc = useQueryClient();

  const del = useMutation({
    mutationFn: async (id: string) => remove({ data: { id } }),
    onSuccess: async () => {
      toast.success("Deleted");
      await qc.invalidateQueries({ queryKey: ["generations", tool] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="border-border/70">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
          <History className="h-4 w-4" aria-hidden="true" /> Recent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <p className="text-muted-foreground text-sm">Nothing saved yet.</p>
        )}
        {data?.map((row) => (
          <div
            key={row.id}
            className="hover:bg-accent/60 group flex items-center gap-2 rounded-lg px-2 py-1.5"
          >
            <button
              type="button"
              onClick={() => onOpen(row)}
              className="min-w-0 flex-1 text-left"
              title={row.title}
            >
              <span className="block truncate text-sm font-medium">{row.title}</span>
              <span className="text-muted-foreground text-xs">
                {new Date(row.created_at).toLocaleString()}
              </span>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${row.title}`}
              onClick={() => del.mutate(row.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
