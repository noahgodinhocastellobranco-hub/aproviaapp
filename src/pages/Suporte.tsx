import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Brain, Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";

export default function Suporte() {
  const whatsappUrl = "https://wa.me/5521973781012?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20AprovI.A";

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
      </Button>

      <section className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Brain className="h-9 w-9" />
          </div>
          <h1 className="text-4xl font-black text-foreground sm:text-5xl">Suporte AprovI.A</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Fale diretamente conosco pelos canais oficiais. Atendimento humano para dúvidas de conta, pagamento, acesso PRO e uso da plataforma.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-success/30">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success text-success-foreground">
                <MessageCircle className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-foreground">WhatsApp</h2>
              <p className="mt-2 text-muted-foreground">Atendimento rápido pelo número oficial.</p>
              <p className="mt-4 text-xl font-bold text-foreground">+55 (21) 97378-1012</p>
              <Button asChild size="lg" className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Mail className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-foreground">Email</h2>
              <p className="mt-2 text-muted-foreground">Envie sua solicitação com detalhes e prints se precisar.</p>
              <p className="mt-4 break-all text-xl font-bold text-foreground">suporteaprovia@gmail.com</p>
              <Button asChild size="lg" variant="outline" className="mt-6 w-full">
                <a href="mailto:suporteaprovia@gmail.com?subject=Suporte%20AprovI.A">Enviar Email</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Clock className="mb-3 h-6 w-6 text-primary" />
            <p className="font-bold text-foreground">Horário de atendimento</p>
            <p className="mt-1 text-sm text-muted-foreground">Segunda a sábado, das 8h às 20h.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldCheck className="mb-3 h-6 w-6 text-success" />
            <p className="font-bold text-foreground">Canais oficiais</p>
            <p className="mt-1 text-sm text-muted-foreground">Use apenas o WhatsApp e email informados nesta página.</p>
          </div>
        </div>
      </section>
    </main>
  );
}