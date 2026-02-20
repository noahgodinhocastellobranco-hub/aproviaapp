import { useState, useEffect, useRef } from "react";
import { Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb, Timer, HelpCircle, ClipboardList, FolderDown, GraduationCap, Trophy, Search, Calendar, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainItems = [
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
  const navigate = useNavigate();

  const [nome, setNome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const uid = session.user.id;
      setEmail(session.user.email ?? null);

      const { data } = await supabase.from("profiles").select("nome").eq("id", uid).single();
      if (data?.nome) setNome(data.nome);

      const { data: files } = await supabase.storage.from("avatars").list(`${uid}`);
      if (files && files.length > 0) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(`${uid}/${files[0].name}`);
        setAvatarUrl(urlData.publicUrl);
      }
    };
    load();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const primeiroNome = nome?.split(" ")[0] ?? email?.split("@")[0] ?? "Aluno";

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r border-border bg-card"
      side="left"
    >
      <SidebarHeader className="p-4 pb-3 bg-card">
        {isMobile && (
          <div className="flex justify-end mb-1">
            <SidebarTrigger className="h-8 w-8 rounded-lg text-primary" />
          </div>
        )}

        {/* Perfil do usuário com dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-border shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30 shrink-0">
                {primeiroNome[0]?.toUpperCase()}
              </div>
            )}
            <div className="leading-none text-left flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{primeiroNome}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">PRO Ativo</p>
              </div>
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground text-sm truncate">{nome ?? primeiroNome}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/configuracoes"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                  Configurações
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/suporte"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  Suporte
                </button>
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
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
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-primary/10 transition-all duration-200 text-primary"
            >
              <Home className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Página Inicial</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
