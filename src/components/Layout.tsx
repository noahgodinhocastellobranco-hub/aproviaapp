import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { PWAUpdatePrompt } from "./PWAUpdatePrompt";
import { PWAOfflineIndicator } from "./PWAOfflineIndicator";
import { PWAInstallBanner } from "./PWAInstallBanner";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          <div className="md:hidden fixed top-4 left-4 z-50">
            <SidebarTrigger className="bg-background border shadow-md" />
          </div>
          {children}
        </main>
        <PWAUpdatePrompt />
        <PWAOfflineIndicator />
        {isAuthenticated && (
          <>
            <PWAInstallPrompt />
            <PWAInstallBanner />
          </>
        )}
      </div>
    </SidebarProvider>
  );
}
