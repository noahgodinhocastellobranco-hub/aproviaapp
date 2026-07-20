// Guarded PWA service-worker registration.
// Never register in dev, Lovable preview, iframes, or when the URL includes ?sw=off.
// In refused contexts, actively unregister any matching /sw.js registration so
// stale workers from a prior build cannot serve outdated HTML.

import { registerSW } from 'virtual:pwa-register';

const SW_URL = '/sw.js';

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    // Cross-origin frame — treat as refused.
    return true;
  }
  const host = window.location.hostname;
  if (host.startsWith('id-preview--') || host.startsWith('preview--')) return true;
  if (host === 'lovableproject.com' || host.endsWith('.lovableproject.com')) return true;
  if (host === 'lovableproject-dev.com' || host.endsWith('.lovableproject-dev.com')) return true;
  if (host === 'beta.lovable.dev' || host.endsWith('.beta.lovable.dev')) return true;
  if (new URLSearchParams(window.location.search).get('sw') === 'off') return true;
  return false;
}

async function unregisterAppSW() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.allSettled(
      regs
        .filter((r) => {
          const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || '';
          return url.endsWith(SW_URL);
        })
        .map((r) => r.unregister()),
    );
  } catch {
    /* noop */
  }
}

export type UpdateHandler = () => void;

let updateSWFn: ((reloadPage?: boolean) => Promise<void>) | undefined;

export function applyUpdate() {
  if (updateSWFn) updateSWFn(true);
}

export function initPWA(options?: {
  onNeedRefresh?: UpdateHandler;
  onOfflineReady?: UpdateHandler;
}) {
  if (isRefusedContext()) {
    void unregisterAppSW();
    return;
  }

  updateSWFn = registerSW({
    immediate: true,
    onNeedRefresh() {
      options?.onNeedRefresh?.();
    },
    onOfflineReady() {
      options?.onOfflineReady?.();
    },
    onRegistered(registration) {
      // Silent hourly update check.
      if (registration) {
        setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW register error', error);
    },
  });
}
