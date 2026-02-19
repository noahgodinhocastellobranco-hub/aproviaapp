import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Install from "./pages/Install";
import Dicas from "./pages/Dicas";
import Simulados from "./pages/Simulados";
import Materias from "./pages/Materias";
import MateriaisEstudo from "./pages/MateriaisEstudo";
import Redacao from "./pages/Redacao";
import ProfessoraVirtual from "./pages/ProfessoraVirtual";
import Chat from "./pages/Chat";
import ResolverQuestao from "./pages/ResolverQuestao";
import ComoResolverQuestao from "./pages/ComoResolverQuestao";
import FazendoSimulado from "./pages/FazendoSimulado";
import ProvaENEM from "./pages/ProvaENEM";
import ConsultarCurso from "./pages/ConsultarCurso";
import Pomodoro from "./pages/Pomodoro";
import Auth from "./pages/Auth";
import Rotina from "./pages/Rotina";
import Precos from "./pages/Precos";
import Configuracoes from "./pages/Configuracoes";
import Suporte from "./pages/Suporte";
import Vendas from "./pages/Vendas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Sales / Auth pages — no sidebar */}
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/precos" element={<Precos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/vendas" element={<Vendas />} />

          {/* App pages — with sidebar Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/install" element={<Install />} />
                  <Route path="/dicas" element={<Dicas />} />
                  <Route path="/simulados" element={<Simulados />} />
                  <Route path="/materias" element={<Materias />} />
                  <Route path="/materiais-estudo" element={<MateriaisEstudo />} />
                  <Route path="/redacao" element={<Redacao />} />
                  <Route path="/professora-virtual" element={<ProfessoraVirtual />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/resolver-questao" element={<ResolverQuestao />} />
                  <Route path="/como-resolver-questao" element={<ComoResolverQuestao />} />
                  <Route path="/fazendo-simulado" element={<FazendoSimulado />} />
                  <Route path="/prova-enem" element={<ProvaENEM />} />
                  <Route path="/consultar-curso" element={<ConsultarCurso />} />
                  <Route path="/pomodoro" element={<Pomodoro />} />
                  <Route path="/rotina" element={<Rotina />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
