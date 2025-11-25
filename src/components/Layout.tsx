import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { PWAUpdatePrompt } from "./PWAUpdatePrompt";
import { PWAOfflineIndicator } from "./PWAOfflineIndicator";
import { PWAInstallBanner } from "./PWAInstallBanner";
import { useAuth } from "@/contexts/AuthContext";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { useIsMobile } from "@/hooks/use-mobile";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  useSwipeGesture({
    onSwipeRight: () => {
      if (isMobile && !open) {
        setOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (isMobile && open) {
        setOpen(false);
      }
    },
    minSwipeDistance: 80,
  });

  return (
    <>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          {!open && (
            <div className="fixed top-4 left-4 z-50">
              <SidebarTrigger className="bg-background border shadow-md" />
            </div>
          )}
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
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
