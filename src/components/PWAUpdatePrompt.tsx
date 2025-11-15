import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PWAUpdatePromptProps {
  onUpdate?: () => void;
}

export const PWAUpdatePrompt = ({ onUpdate }: PWAUpdatePromptProps) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                // Automatically update after 3 seconds
                setTimeout(() => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  toast({
                    title: "Atualizando...",
                    description: "O app será atualizado automaticamente.",
                  });
                }, 3000);
              }
            });
          }
        });

        // Check if there's already a waiting worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          // Automatically update after 3 seconds
          setTimeout(() => {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            toast({
              title: "Atualizando...",
              description: "O app será atualizado automaticamente.",
            });
          }, 3000);
        }
      });

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, [toast]);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
      onUpdate?.();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-top">
      <Card className="p-4 border-primary/20 shadow-lg bg-card/95 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Nova versão disponível</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Atualize agora para ter acesso às últimas melhorias e correções.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdate} className="flex-1">
                Atualizar Agora
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowUpdate(false)}
              >
                Depois
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={() => setShowUpdate(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
