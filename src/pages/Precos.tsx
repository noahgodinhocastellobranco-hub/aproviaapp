import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft, Brain, Shield, Sparkles, X, Loader2, Crown, Zap } from "lucide-react";
import { toast } from "sonner";

const CAKTO_URLS = {
  mensal: "https://pay.cakto.com.br/3c7yw4k_710255",
};

type PlanKey = keyof typeof CAKTO_URLS;

const benefits = [
  "Correção de redação com nota ENEM",
  "Chat AprovI.A para dúvidas 24h",
  "Professora virtual com explicações",
  "Simulados e prova ENEM exclusiva",
  "Resolver questão por foto",
  "Rotina de estudos personalizada",
  "Pomodoro e acompanhamento de progresso",
  "Suporte direto por WhatsApp e email",
];

export default function Precos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("mensal");
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (!user) return;

      setUserEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium,nome")
        .eq("id", user.id)
        .maybeSingle();

      setUserName(profile?.nome || "");
      if (profile?.is_premium) {
        setIsPremium(true);
        if (!checkoutOpen && searchParams.get("checkout") !== "1") navigate("/dashboard", { replace: true });
      }
    };

    load();
    if (searchParams.get("checkout") === "1") setCheckoutOpen(true);
  }, [navigate, searchParams, checkoutOpen]);

  useEffect(() => {
    if (!checkoutOpen || !isLoggedIn) return;

    setCheckingPayment(true);
    const interval = window.setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("is_premium").eq("id", user.id).maybeSingle();
      if (data?.is_premium) {
        window.clearInterval(interval);
        setCheckoutOpen(false);
        toast.success("Compra aprovada! Seu PRO foi liberado.");
        navigate("/dashboard", { replace: true });
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, [checkoutOpen, isLoggedIn, navigate]);

  const handleComprar = (plan: PlanKey) => {
    if (!isLoggedIn) {
      navigate("/auth?next=/precos?checkout=1");
      return;
    }
    if (isPremium) {
      navigate("/dashboard");
      return;
    }
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <section className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Brain className="h-7 w-7" />
            </div>
            <span className="text-2xl font-black text-primary">AprovI.A</span>
          </div>
          <Badge className="mb-4 bg-primary text-primary-foreground">Escolha seu plano</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-5xl">
            Conquiste sua aprovação no ENEM com o plano PRO
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Todas as ferramentas premium em uma plataforma só. Escolha o plano ideal e comece hoje.
          </p>
        </div>

        <div className="mx-auto grid max-w-md gap-6">
          {/* Plano Mensal */}
          <Card className="relative flex flex-col border-2 border-primary shadow-2xl transition hover:-translate-y-1 hover:shadow-primary/30">
            <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-foreground">Plano Mensal</h2>
                <p className="mt-1 text-sm text-muted-foreground">Acesso completo, cancele quando quiser</p>
              </div>

              <div className="mb-6 rounded-2xl bg-muted/50 p-5 text-center">
                <p className="text-sm text-muted-foreground line-through">R$ 26,21</p>
                <div className="mt-1 flex items-end justify-center gap-1">
                  <span className="text-2xl font-bold text-foreground">R$</span>
                  <span className="text-6xl font-black text-foreground">24,90</span>
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground">por mês</p>
              </div>

              <ul className="mb-6 space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button size="lg" className="w-full text-base font-bold" onClick={() => handleComprar("mensal")}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isPremium ? "Acessar Meu Plano PRO" : isLoggedIn ? "Assinar Mensal" : "Fazer Login"}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-success" /> Garantia de 7 dias
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          <button className="absolute inset-0 bg-foreground/70 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)} aria-label="Fechar checkout" />
          <div className="relative z-10 flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="font-bold text-foreground">Checkout Seguro</p>
                <p className="text-xs text-muted-foreground">Assim que a compra for aprovada, você será levado ao Dashboard PRO.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCheckoutOpen(false)} aria-label="Fechar">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <iframe src={CAKTO_URLS[selectedPlan]} title="Checkout Cakto" className="min-h-0 flex-1 border-0" allow="payment" />
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">{checkingPayment && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Verificando pagamento automaticamente</span>
              <Button size="sm" variant="outline" onClick={() => navigate("/dashboard")}>Já sou PRO</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
