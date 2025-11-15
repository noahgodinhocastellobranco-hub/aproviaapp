import { Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb, LogOut, Download, Camera } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Badge } from "@/components/ui/badge";
import { PWAStatusBar } from "./PWAStatusBar";
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

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Dicas", url: "/dicas", icon: Lightbulb },
  { title: "Simulados", url: "/simulados", icon: FileText },
  { title: "Matérias", url: "/materias", icon: BookOpen },
  { title: "Redação", url: "/redacao", icon: PenTool },
  { title: "Chat AprovI.A", url: "/chat", icon: MessageCircle },
  { title: "Resolver Questão", url: "/resolver-questao", icon: Camera },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isInstallable, isInstalled } = usePWAInstall();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="none" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AprovI.A
            </h2>
            <p className="text-xs text-muted-foreground">Seu assistente de estudos</p>
          </div>
        </div>
        <div className="pt-3">
          <PWAStatusBar />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-foreground">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-muted/80"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu className="space-y-1">
          {isInstallable && !isInstalled && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate('/install')} 
                className="hover:bg-primary/10 text-primary transition-all duration-200 rounded-lg"
              >
                <Download className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Instalar App</span>
                <Badge variant="secondary" className="ml-auto text-xs">Novo</Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-lg"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
