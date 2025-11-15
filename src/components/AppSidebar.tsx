import { Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb, LogOut, Download } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Badge } from "@/components/ui/badge";
import { PWAStatusBar } from "./PWAStatusBar";
import logo from "@/assets/logo-main.png";
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
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "🏠 Início", url: "/", icon: Home },
  { title: "💡 Dicas", url: "/dicas", icon: Lightbulb },
  { title: "📄 Simulados", url: "/simulados", icon: FileText },
  { title: "📘 Matérias", url: "/materias", icon: BookOpen },
  { title: "📝 Redação", url: "/redacao", icon: PenTool },
  { title: "💬 Chat AprovI.A", url: "/chat", icon: MessageCircle },
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
    <Sidebar collapsible="icon">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2">
          {open && (
            <div className="flex-1 flex items-center gap-2">
              <img src={logo} alt="AprovI.A" className="h-10 w-auto" />
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
        {open && (
          <div className="pt-2">
            <PWAStatusBar />
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {isInstallable && !isInstalled && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate('/install')} className="hover:bg-primary/10 text-primary">
                    <Download className="h-4 w-4" />
                    <span>Instalar App</span>
                    {open && <Badge variant="secondary" className="ml-auto text-xs">Novo</Badge>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
