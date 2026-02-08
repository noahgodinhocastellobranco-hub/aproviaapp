import { Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb, ExternalLink, Timer, HelpCircle, ClipboardList, FolderDown, GraduationCap, Trophy, Search, Brain } from "lucide-react";
import { NavLink } from "react-router-dom";
import { PWAStatusBar } from "./PWAStatusBar";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
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
      <SidebarMenuButton asChild className="!bg-transparent !text-inherit">
        <NavLink
          to={item.url}
          end={item.url === "/"}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
              isActive
                ? "!bg-primary !text-primary-foreground shadow-md font-semibold"
                : "!text-primary hover:!bg-primary/10"
            }`
          }
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r border-border bg-card [&>div]:bg-card"
    >
      <SidebarHeader className="p-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary leading-tight">
                AprovI.A
              </h2>
              <p className="text-[11px] text-muted-foreground leading-tight">Assistente ENEM</p>
            </div>
          </div>
          {isMobile && (
            <SidebarTrigger className="flex-shrink-0 h-8 w-8 rounded-lg text-primary hover:bg-primary/10" />
          )}
        </div>
        <div className="pt-3">
          <PWAStatusBar />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-1 bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-primary/40 px-3 mb-1">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-primary/40 px-3 mb-1">
            Estudos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {studyItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-primary/40 px-3 mb-1">
            Praticar
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {practiceItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 bg-card">
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="!bg-transparent">
              <a
                href="https://aproviapagina.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 !text-primary hover:!bg-primary/10 transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Página Inicial</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
