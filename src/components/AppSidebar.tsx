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

const blueText = { color: "#0B61FF" } as const;
const blueTextLight = { color: "#0B61FF99" } as const;
const blueTextLabel = { color: "#0B61FF66" } as const;

function NavItem({ item }: { item: { title: string; url: string; icon: React.ComponentType<{ className?: string }> } }) {
  return (
    <SidebarMenuItem>
      <NavLink
        to={item.url}
        end={item.url === "/"}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 no-underline ${
            isActive
              ? "bg-primary shadow-md font-semibold"
              : "hover:bg-primary/10"
          }`
        }
        style={({ isActive }) => isActive ? { color: "#FFFFFF" } : blueText}
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

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r border-border"
      style={{ background: "#FFFFFF" }}
    >
      <SidebarHeader className="p-4 pb-3" style={{ background: "#FFFFFF" }}>
        <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#F0F6FF" }}>
          <div className="flex items-center justify-center w-11 h-11 rounded-xl shadow-sm" style={{ background: "#0B61FF" }}>
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold leading-tight" style={blueText}>
              AprovI.A
            </h2>
            <p className="text-[11px] leading-tight" style={blueTextLight}>Assistente ENEM</p>
          </div>
          {isMobile && (
            <SidebarTrigger className="flex-shrink-0 h-8 w-8 rounded-lg" style={blueText} />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-1" style={{ background: "#FFFFFF" }}>
        <SidebarGroup>
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1" style={blueTextLabel}>
            Principal
          </p>
          <SidebarMenu className="space-y-0.5">
            {mainItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1" style={blueTextLabel}>
            Estudos
          </p>
          <SidebarMenu className="space-y-0.5">
            {studyItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1" style={blueTextLabel}>
            Praticar
          </p>
          <SidebarMenu className="space-y-0.5">
            {practiceItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3" style={{ background: "#FFFFFF" }}>
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <a
              href="https://aproviapagina.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-primary/10 transition-all duration-200 no-underline"
              style={blueText}
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Página Inicial</span>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
