import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_banner_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show banner again after 7 days
    if (dismissedTime === 0 || daysSinceDismissed > 7) {
      setIsDismissed(false);
      // Show banner after 5 seconds
      setTimeout(() => setShowBanner(true), 5000);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowBanner(false);
    }
  };

  if (isInstalled || isDismissed || !isInstallable || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 animate-in slide-in-from-bottom">
      <Card className="p-4 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Instale o AprovI.A</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Tenha acesso instantâneo e estude mesmo offline!
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Acesso rápido</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Funciona offline</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Sem ocupar espaço</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleInstall} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Instalar
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleDismiss}
              >
                Não, obrigado
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 -mt-1 -mr-1"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
