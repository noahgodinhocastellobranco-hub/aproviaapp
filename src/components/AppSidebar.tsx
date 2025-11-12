import { Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb } from "lucide-react";
import { NavLink } from "react-router-dom";
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

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {open && (
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AprovI.A
              </h2>
              <p className="text-xs text-muted-foreground">Seu app para o ENEM</p>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
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
      </SidebarContent>
    </Sidebar>
  );
}
