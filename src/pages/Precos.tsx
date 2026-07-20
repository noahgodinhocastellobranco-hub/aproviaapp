import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft, Brain, Shield, Sparkles, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CAKTO_URL = "https://pay.cakto.com.br/3c7yw4k_710255";

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
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.is_premium) {
        setIsPremium(true);
        if (!checkoutOpen && searchParams.get("checkout") !== "1") navigate("/dashboard", { replace: true });
      }
    };

    load();
    if (searchParams.get("checkout") === "1") setCheckoutOpen(true);

    return () => {
      if (interval) window.clearInterval(interval);
    };
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

  const handleComprar = () => {
    if (!isLoggedIn) {
      navigate("/auth?next=/precos?checkout=1");
      return;
    }
    if (isPremium) {
      navigate("/dashboard");
      return;
    }
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

      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Brain className="h-7 w-7" />
            </div>
            <span className="text-2xl font-black text-primary">AprovI.A</span>
          </div>

          <Badge className="mb-4 bg-primary text-primary-foreground">Oferta Especial</Badge>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-6xl">
            Conquiste sua aprovação no ENEM com o plano PRO
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Todas as ferramentas premium em uma plataforma só: IA, redação, simulados, plano de estudos, professora virtual e suporte.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <span className="text-sm font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-primary/30 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-foreground">Plano Mensal</h2>
                <p className="text-sm text-muted-foreground">Acesso completo, cancele quando quiser</p>
              </div>
              <Badge className="bg-success text-success-foreground">5% OFF</Badge>
            </div>

            <div className="mb-6 rounded-2xl bg-primary/10 p-5 text-center">
              <p className="text-sm text-muted-foreground line-through">R$ 26,21</p>
              <div className="mt-1 flex items-end justify-center gap-1">
                <span className="text-2xl font-bold text-foreground">R$</span>
                <span className="text-6xl font-black text-primary">24,90</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">por mês</p>
            </div>

            <Button size="lg" className="w-full text-base font-black" onClick={handleComprar}>
              <Sparkles className="mr-2 h-5 w-5" />
              {isPremium ? "Acessar Meu Plano PRO" : isLoggedIn ? "Comprar Agora" : "Fazer Login para Comprar"}
            </Button>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" /> Garantia de 7 dias
            </div>
          </CardContent>
        </Card>
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
            <iframe src={CAKTO_URL} title="Checkout Cakto" className="min-h-0 flex-1 border-0" allow="payment" />
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