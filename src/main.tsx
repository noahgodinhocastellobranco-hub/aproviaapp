import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA with lifecycle management
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nova versão disponível');
    // Let the PWAUpdatePrompt component handle this
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline');
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('AprovI.A está pronto!', {
        body: 'Você pode usar o app mesmo offline agora.',
        icon: '/icon-192.png',
      });
    }
  },
  onRegistered(registration) {
    console.log('Service Worker registrado');
    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    }
  },
  onRegisterError(error) {
    console.error('Erro ao registrar Service Worker:', error);
  },
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Log PWA installation event
window.addEventListener('appinstalled', () => {
  console.log('PWA instalado com sucesso!');
  // Track installation analytics here if needed
});

createRoot(document.getElementById("root")!).render(<App />);
