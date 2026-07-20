import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { initPWA } from "./pwa/register";

// Guarded registration — no-op in dev, Lovable preview, iframes, or ?sw=off.
initPWA();

// Log PWA installation event.
window.addEventListener("appinstalled", () => {
  console.log("PWA instalado com sucesso!");
});


createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>
);
