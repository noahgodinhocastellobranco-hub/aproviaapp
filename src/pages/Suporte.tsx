import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HeadphonesIcon, MessageCircle, Mail, Clock, Sparkles } from "lucide-react";

export default function Suporte() {
  const navigate = useNavigate();

  const whatsappNumber = "5521973781012";
  const whatsappMessage = encodeURIComponent("Olá! Preciso de ajuda com a AprovI.A.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <HeadphonesIcon className="h-5 w-5 text-primary" />
          Suporte
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4">

        {/* Hero */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <HeadphonesIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            Como podemos te ajudar?
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Nossa equipe está pronta para te atender. Escolha a forma de contato que preferir abaixo.
          </p>
        </div>

        {/* WhatsApp */}
        <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-green-400/40 hover:shadow-md group">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex p-2 rounded-xl bg-green-100 dark:bg-green-950/40">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">WhatsApp</h2>
              <p className="text-xs text-muted-foreground">Resposta rápida pelo chat</p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-4 mb-4">
            <p className="text-xs text-muted-foreground mb-0.5">Número</p>
            <p className="font-semibold text-foreground text-lg tracking-wide">+55 (21) 97378-1012</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Atendimento de segunda a sábado, das 8h às 20h
          </div>

          <Button
            className="w-full h-11 rounded-xl font-bold gap-2 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <MessageCircle className="h-4 w-4" />
            Chamar no WhatsApp
          </Button>
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-md group">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Email</h2>
              <p className="text-xs text-muted-foreground">Para dúvidas detalhadas ou sugestões</p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-4 mb-4">
            <p className="text-xs text-muted-foreground mb-0.5">Endereço</p>
            <p className="font-semibold text-foreground break-all">suporteaprovia@gmail.com</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Respondemos em até 24 horas úteis
          </div>

          <Button
            variant="outline"
            className="w-full h-11 rounded-xl font-bold gap-2"
            onClick={() => window.open("mailto:suporteaprovia@gmail.com?subject=Suporte AprovI.A", "_blank")}
          >
            <Mail className="h-4 w-4" />
            Enviar Email
          </Button>
        </div>

        {/* Tip */}
        <div className="rounded-2xl border border-border bg-muted/30 p-5 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Dica rápida</p>
            <p className="text-sm text-muted-foreground">
              Antes de entrar em contato, experimente perguntar à nossa{" "}
              <button
                onClick={() => navigate("/chat")}
                className="text-primary font-medium hover:underline"
              >
                IA no Chat
              </button>{" "}
              — ela responde em segundos e resolve a maioria das dúvidas sobre o ENEM!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
