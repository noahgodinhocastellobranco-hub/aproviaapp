import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Smartphone, Monitor, Download, Share, Plus, MoreVertical } from "lucide-react";
import logo from "@/assets/logo-aprovia.jpg";

interface Props {
  trigger: ReactNode;
}

export function InstallAppDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <img src={logo} alt="AprovI.A" className="h-12 w-12 rounded-xl" />
            <div>
              <DialogTitle className="text-xl">Baixar o AprovI.A</DialogTitle>
              <DialogDescription>Instale como aplicativo no seu dispositivo</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="android" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="android" className="gap-1"><Smartphone className="h-4 w-4" />Android</TabsTrigger>
            <TabsTrigger value="ios" className="gap-1"><Apple className="h-4 w-4" />iOS</TabsTrigger>
            <TabsTrigger value="pc" className="gap-1"><Monitor className="h-4 w-4" />PC</TabsTrigger>
          </TabsList>

          <TabsContent value="android" className="space-y-3 pt-4 text-sm">
            <Step n={1} icon={<Smartphone className="h-4 w-4" />}>Abra o site <b>aproviaapp.lovable.app</b> no <b>Google Chrome</b> do seu Android.</Step>
            <Step n={2} icon={<MoreVertical className="h-4 w-4" />}>Toque no menu de <b>três pontinhos</b> no canto superior direito.</Step>
            <Step n={3} icon={<Download className="h-4 w-4" />}>Toque em <b>"Instalar aplicativo"</b> ou <b>"Adicionar à tela inicial"</b>.</Step>
            <Step n={4} icon={<Plus className="h-4 w-4" />}>Confirme em <b>Instalar</b> — o ícone do AprovI.A aparecerá na sua tela inicial.</Step>
          </TabsContent>

          <TabsContent value="ios" className="space-y-3 pt-4 text-sm">
            <Step n={1} icon={<Apple className="h-4 w-4" />}>Abra o site <b>aproviaapp.lovable.app</b> no <b>Safari</b> do iPhone ou iPad.</Step>
            <Step n={2} icon={<Share className="h-4 w-4" />}>Toque no botão <b>Compartilhar</b> (ícone de quadrado com seta) na barra inferior.</Step>
            <Step n={3} icon={<Plus className="h-4 w-4" />}>Role e toque em <b>"Adicionar à Tela de Início"</b>.</Step>
            <Step n={4} icon={<Download className="h-4 w-4" />}>Confirme em <b>Adicionar</b> — o app ficará na sua tela como um aplicativo nativo.</Step>
          </TabsContent>

          <TabsContent value="pc" className="space-y-3 pt-4 text-sm">
            <Step n={1} icon={<Monitor className="h-4 w-4" />}>Abra <b>aproviaapp.lovable.app</b> no <b>Chrome</b>, <b>Edge</b> ou <b>Brave</b>.</Step>
            <Step n={2} icon={<Download className="h-4 w-4" />}>Na barra de endereços, clique no ícone de <b>instalar</b> (monitor com seta ↓) à direita.</Step>
            <Step n={3} icon={<Plus className="h-4 w-4" />}>Se não aparecer, abra o menu ⋮ e escolha <b>"Instalar AprovI.A..."</b>.</Step>
            <Step n={4} icon={<Monitor className="h-4 w-4" />}>Clique em <b>Instalar</b> — o AprovI.A abrirá em janela própria e ficará no menu iniciar.</Step>
          </TabsContent>
        </Tabs>

        <div className="mt-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
          💡 Instalar deixa o AprovI.A com <b>ícone próprio</b>, abre em <b>tela cheia</b> e funciona <b>mais rápido</b>.
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Step({ n, icon, children }: { n: number; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{n}</div>
      <div className="flex-1 leading-relaxed">
        <div className="mb-1 flex items-center gap-1.5 text-primary">{icon}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
