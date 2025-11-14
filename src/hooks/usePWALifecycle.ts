import { useEffect, useState } from 'react';

export interface PWALifecycleState {
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  isInstallable: boolean;
  appVersion: string;
}

export const usePWALifecycle = () => {
  const [state, setState] = useState<PWALifecycleState>({
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    isOnline: navigator.onLine,
    hasUpdate: false,
    isInstallable: false,
    appVersion: '1.0.0',
  });

  useEffect(() => {
    // Check installation status
    const checkInstallation = () => {
      const isInstalled = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setState(prev => ({ ...prev, isInstalled }));
    };

    // Monitor online/offline status
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    // Check for updates
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update();
          
          if (registration.waiting) {
            setState(prev => ({ ...prev, hasUpdate: true }));
          }

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, hasUpdate: true }));
                }
              });
            }
          });
        });
      }
    };

    // Check if installable
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Initial checks
    checkInstallation();
    checkForUpdates();

    // Periodic update check (every 30 minutes)
    const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearInterval(updateInterval);
    };
  }, []);

  const triggerUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };

  const checkForUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    }
  };

  return {
    ...state,
    triggerUpdate,
    checkForUpdate,
  };
};
