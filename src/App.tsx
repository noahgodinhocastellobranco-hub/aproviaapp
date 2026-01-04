import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
