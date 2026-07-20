import { Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb, ExternalLink, Timer, HelpCircle, ClipboardList, FolderDown, GraduationCap, Trophy, Search, Brain, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { PWAStatusBar } from "./PWAStatusBar";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Chat AprovI.A", url: "/chat", icon: MessageCircle },
  { title: "Redação", url: "/redacao", icon: PenTool },
  { title: "Professora Virtual", url: "/professora-virtual", icon: GraduationCap },
];

const studyItems = [
  { title: "Matérias", url: "/materias", icon: BookOpen },
  { title: "Rotina de Estudos", url: "/rotina", icon: Calendar },
  { title: "Dicas", url: "/dicas", icon: Lightbulb },
  { title: "Materiais de Estudo", url: "/materiais-estudo", icon: FolderDown },
  { title: "Pomodoro", url: "/pomodoro", icon: Timer },
];

const practiceItems = [
  { title: "Simulados", url: "/simulados", icon: FileText },
  { title: "Resolver Questão", url: "/como-resolver-questao", icon: HelpCircle },
  { title: "Fazer Simulado", url: "/fazendo-simulado", icon: ClipboardList },
  { title: "Prova ENEM", url: "/prova-enem", icon: Trophy },
  { title: "Consultar Curso", url: "/consultar-curso", icon: Search },
];

function NavItem({ item }: { item: { title: string; url: string; icon: React.ComponentType<{ className?: string }> } }) {
  return (
    <SidebarMenuItem>
      <NavLink
        to={item.url}
        end={item.url === "/"}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 no-underline ${
            isActive
              ? "bg-primary text-primary-foreground shadow-md font-semibold"
              : "text-primary hover:bg-primary/10"
          }`
        }
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">{item.title}</span>
      </NavLink>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  const [firstName, setFirstName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>("AP");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setFirstName(""); setAvatarUrl(null); return; }
      const { data } = await supabase.from("profiles").select("nome, email, avatar_url").eq("id", user.id).maybeSingle();
      const nome = (data?.nome || data?.email || user.email || "").trim();
      const first = nome.split(" ")[0] || nome.split("@")[0] || "";
      setFirstName(first);
      setInitials((first || nome).slice(0, 2).toUpperCase() || "AP");
      setAvatarUrl((data as any)?.avatar_url || null);
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r border-border bg-card"
    >
      <SidebarHeader className="p-4 pb-3 bg-card">
        <NavLink to="/configuracoes" className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 hover:bg-primary/10 transition no-underline">
          <Avatar className="w-11 h-11 ring-2 ring-primary/20">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={firstName} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold leading-tight text-primary truncate">
              {firstName || "AprovI.A"}
            </h2>
            <p className="text-[11px] leading-tight text-primary/60">Assistente ENEM</p>
          </div>
          {isMobile && (
            <SidebarTrigger className="flex-shrink-0 h-8 w-8 rounded-lg text-primary" />
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-3 py-1 bg-card">
        <SidebarGroup>
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1 text-primary/40">
            Principal
          </p>
          <SidebarMenu className="space-y-0.5">
            {mainItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1 text-primary/40">
            Estudos
          </p>
          <SidebarMenu className="space-y-0.5">
            {studyItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1 text-primary/40">
            Praticar
          </p>
          <SidebarMenu className="space-y-0.5">
            {practiceItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 bg-card">
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-primary/10 transition-all duration-200 no-underline text-primary"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Página Inicial</span>
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
