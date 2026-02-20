import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, ArrowLeft, Sparkles, Shield, X } from "lucide-react";

const includes = [
  { left: "Correção ilimitada de redações com IA", right: "Chat inteligente para tirar dúvidas" },
  { left: "Acesso a todos os simulados oficiais", right: "Estudo de todas as matérias do ENEM" },
  { left: "Dicas e estratégias exclusivas", right: "Acompanhamento de desempenho" },
  { left: "Suporte prioritário", right: "Atualizações constantes de conteúdo" },
];

const CAKTO_URL = "https://pay.cakto.com.br/3c7yw4k_710255";

export default function Precos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const checkUser = async (userId: string | null) => {
      if (!userId) { setIsLoggedIn(false); setIsPremium(false); return; }
      setIsLoggedIn(true);
      const { data } = await supabase.from("profiles").select("is_premium").eq("id", userId).single();
      setIsPremium(!!data?.is_premium);
      // Auto-abrir checkout se vier do fluxo de cadastro
      if (searchParams.get("checkout") === "1" && !data?.is_premium) {
        setCheckoutOpen(true);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUser(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      checkUser(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, [searchParams]);

  const handleComprar = () => {
    if (isPremium) {
      navigate("/dashboard");
    } else if (isLoggedIn) {
      setCheckoutOpen(true);
    } else {
      navigate("/auth");
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Modal de Checkout */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setCheckoutOpen(false)}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-card border border-border flex flex-col"
               style={{ height: "min(90vh, 700px)" }}>
            {/* Header do modal */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
              <span className="font-semibold text-sm text-foreground">Finalizar Assinatura</span>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Iframe do checkout */}
            <iframe
              src={CAKTO_URL}
              title="Checkout"
              className="flex-1 w-full border-0"
              allow="payment"
            />
          </div>
        </div>
      )}
      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <button
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-semibold mb-6">
          <Sparkles className="h-4 w-4" />
          Oferta Especial
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          Conquiste sua aprovação no{" "}
          <span className="text-primary">ENEM</span>
        </h1>

        <p className="text-muted-foreground text-base md:text-lg">
          Tenha acesso completo à plataforma de estudos com inteligência artificial
        </p>
      </section>

      {/* What's included */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="text-center font-semibold text-foreground mb-6 text-base">
          O que está incluído em todos os planos:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
          {includes.map((row, i) => (
            <>
              <div key={`left-${i}`} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {row.left}
              </div>
              <div key={`right-${i}`} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {row.right}
              </div>
            </>
          ))}
        </div>
      </section>

      {/* Pricing card */}
      <section className="max-w-xl mx-auto px-6 pb-12">
        <div className="relative rounded-2xl border-2 border-primary bg-card shadow-xl overflow-visible">
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="bg-primary text-primary-foreground text-xs font-bold px-5 py-1.5 rounded-full shadow">
              5% OFF
            </div>
          </div>

          <div className="p-8 pt-10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-1">Mensal</h3>
              <p className="text-sm text-muted-foreground">Acesso completo à plataforma</p>
            </div>

            {/* Price box */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center mb-6">
              <div className="flex items-baseline justify-center gap-3 mb-1">
                <span className="text-muted-foreground line-through text-sm">R$ 26,21</span>
                <span className="text-5xl font-extrabold text-primary">R$ 24,90</span>
              </div>
              <p className="text-sm text-muted-foreground">por mês</p>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full text-base py-6 rounded-xl font-bold gap-2"
              onClick={handleComprar}
            >
              {isPremium ? "Acessar Meu Plano PRO" : isLoggedIn ? "Comprar Agora" : "Fazer Login para Comprar"}
              <Sparkles className="h-4 w-4" />
            </Button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              7 dias de garantia — Cancele quando quiser
            </div>
          </div>
        </div>
      </section>

      {/* Footer links */}
      <section className="max-w-xl mx-auto px-6 pb-16 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Tem alguma dúvida?{" "}
          <a
            href="mailto:suporteaprovia@gmail.com"
            className="text-primary font-medium hover:underline"
          >
            Entre em contato conosco
          </a>
        </p>
        <div>
          <Link
            to="/"
            className="text-sm text-primary font-medium hover:underline"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </div>
  );
}
