import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Mail,
  MessagesSquare,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, blurb: "Start here" },
  { to: "/email", label: "Email writer", icon: Mail, blurb: "Draft in any tone" },
  { to: "/meetings", label: "Meeting notes", icon: NotebookPen, blurb: "Summary & actions" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? "");
    });
    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ to: "/auth" });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-3 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-display text-base leading-tight font-semibold">Kestrel</span>
              <span className="text-muted-foreground text-xs">Workplace AI suite</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workflows</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.to}
                      tooltip={item.label}
                      className="h-11"
                    >
                      <Link to={item.to}>
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        <span className="flex flex-col items-start leading-tight">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-muted-foreground text-[11px]">{item.blurb}</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-2 px-3 pb-4">
          <Separator />
          <p
            className="text-muted-foreground truncate text-xs group-data-[collapsible=icon]:hidden"
            title={email}
          >
            {email || "Signed in"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="justify-start gap-2 group-data-[collapsible=icon]:px-0"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background min-w-0">
        <header className="bg-background/85 sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
          <SidebarTrigger />
          <span className="font-display text-sm font-semibold">
            {NAV.find((n) => n.to === pathname)?.label ?? "Kestrel"}
          </span>
        </header>
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
