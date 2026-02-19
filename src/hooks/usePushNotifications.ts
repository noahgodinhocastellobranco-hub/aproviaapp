import { useState, useEffect } from "react";

const NOTIFICATION_HOUR = 19; // 19h como horário padrão de lembrete
const STORAGE_KEY_NOTIFIED_TODAY = "aprovia_notified_today";
const STORAGE_KEY_PERMISSION_ASKED = "aprovia_notification_permission_asked";

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    "Notification" in window ? Notification.permission : "denied"
  );

  const isSupported = "Notification" in window && "serviceWorker" in navigator;

  /** Pede permissão ao usuário */
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    localStorage.setItem(STORAGE_KEY_PERMISSION_ASKED, "true");
    return result === "granted";
  };

  /** Mostra uma notificação imediatamente (para testar ou disparar manual) */
  const showNotification = (title: string, body: string, icon = "/icon-192.png") => {
    if (!isSupported || Notification.permission !== "granted") return;
    const notif = new Notification(title, { body, icon, badge: "/icon-192.png" });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  };

  /**
   * Agenda um lembrete local para hoje às NOTIFICATION_HOUR horas.
   * Se já passou do horário, agenda para amanhã.
   * Usa setTimeout + localStorage para evitar notificações duplicadas.
   */
  const scheduleDaily = () => {
    if (!isSupported || Notification.permission !== "granted") return;

    const now = new Date();
    const todayKey = now.toISOString().split("T")[0]; // "2026-02-19"
    const alreadyNotified = localStorage.getItem(STORAGE_KEY_NOTIFIED_TODAY) === todayKey;
    if (alreadyNotified) return;

    const target = new Date();
    target.setHours(NOTIFICATION_HOUR, 0, 0, 0);
    if (target <= now) {
      // Já passou das 19h: agenda para amanhã às 19h
      target.setDate(target.getDate() + 1);
    }

    const msUntil = target.getTime() - now.getTime();

    const timerId = window.setTimeout(() => {
      const streak = parseInt(localStorage.getItem("aprovia_streak") ?? "0", 10);
      const streakMsg = streak > 0
        ? `Você está com ${streak} dia${streak > 1 ? "s" : ""} seguidos! Não perca o streak! 🔥`
        : "Comece a estudar hoje e acenda o foguinho! 🔥";

      showNotification("⏰ Hora de estudar!", streakMsg);
      localStorage.setItem(STORAGE_KEY_NOTIFIED_TODAY, new Date().toISOString().split("T")[0]);
    }, msUntil);

    // limpa o timer se o componente desmontar (via retorno do useEffect)
    return () => window.clearTimeout(timerId);
  };

  // Agenda automaticamente toda vez que a permissão for "granted"
  useEffect(() => {
    if (permission !== "granted") return;
    const cleanup = scheduleDaily();
    return cleanup;
  }, [permission]);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    scheduleDaily,
  };
}
