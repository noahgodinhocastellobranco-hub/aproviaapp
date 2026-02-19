import { Bell, BellOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";

export function NotificationSetup() {
  const { isSupported, permission, requestPermission, showNotification } = usePushNotifications();

  if (!isSupported) return null;

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Notificações ativadas! 🔥", {
        description: "Você receberá lembretes diários às 19h para estudar.",
      });
      // Mostra uma notificação de boas-vindas imediatamente
      showNotification(
        "AprovI.A ativado! 🎉",
        "Você receberá lembretes diários às 19h para não perder seu streak de estudos."
      );
    } else {
      toast.error("Permissão negada", {
        description: "Você pode ativar notificações nas configurações do navegador.",
      });
    }
  };

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
        <Check className="h-3.5 w-3.5" />
        Lembretes ativos
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground text-xs">
        <BellOff className="h-3.5 w-3.5" />
        Notificações bloqueadas
      </div>
    );
  }

  // "default" — ainda não pediu permissão
  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5 text-xs rounded-full h-8 border-primary/40 text-primary hover:bg-primary/10"
      onClick={handleEnable}
    >
      <Bell className="h-3.5 w-3.5" />
      Ativar lembretes
    </Button>
  );
}
