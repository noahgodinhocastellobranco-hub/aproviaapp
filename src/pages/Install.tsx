import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-24 h-24 bg-primary rounded-2xl flex items-center justify-center">
            <Smartphone className="w-12 h-12 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Instale o AprovI.A</CardTitle>
          <CardDescription>
            Tenha acesso rápido ao seu assistente de estudos para o ENEM
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <p className="text-lg font-medium">App já instalado!</p>
              <Button onClick={() => navigate('/')} className="w-full">
                Abrir AprovI.A
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Acesso instantâneo direto da tela inicial</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Funciona offline para estudar em qualquer lugar</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Receba notificações de novos conteúdos</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Experiência completa como um app nativo</p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium text-center">Como instalar no iOS:</p>
                  <ol className="space-y-2 text-sm">
                    <li>1. Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta)</li>
                    <li>2. Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></li>
                    <li>3. Toque em <strong>"Adicionar"</strong> no canto superior direito</li>
                  </ol>
                </div>
              ) : isInstallable ? (
                <Button 
                  onClick={handleInstallClick} 
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Instalar Aplicativo
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium text-center">Como instalar no Android:</p>
                  <ol className="space-y-2 text-sm">
                    <li>1. Abra o menu do navegador (três pontos)</li>
                    <li>2. Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong></li>
                    <li>3. Confirme a instalação</li>
                  </ol>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Continuar no navegador
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
