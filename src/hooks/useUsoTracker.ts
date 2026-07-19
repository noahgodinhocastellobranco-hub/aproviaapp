import { useEffect, useRef } from "react";
import { addUso } from "@/lib/progresso";

// Incrementa o tempo de uso enquanto a aba está visível.
export function useUsoTracker(intervalSec = 15) {
  const last = useRef<number>(Date.now());
  useEffect(() => {
    let alive = true;
    const flush = () => {
      const now = Date.now();
      const delta = Math.round((now - last.current) / 1000);
      last.current = now;
      if (document.visibilityState === "visible" && delta > 0 && delta < 300) {
        addUso(delta);
      }
    };
    const id = window.setInterval(() => {
      if (!alive) return;
      flush();
    }, intervalSec * 1000);
    const onVis = () => {
      last.current = Date.now();
    };
    const onHide = () => flush();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", onHide);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", onHide);
      flush();
    };
  }, [intervalSec]);
}
