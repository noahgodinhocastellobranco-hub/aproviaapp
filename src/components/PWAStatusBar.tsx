import { Badge } from '@/components/ui/badge';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { Smartphone, Wifi, WifiOff, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PWAStatusBar = () => {
  const { isInstalled, isOnline, hasUpdate, appVersion } = usePWALifecycle();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 text-xs">
        {isInstalled && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="gap-1">
                <Smartphone className="h-3 w-3" />
                <span className="hidden sm:inline">Instalado</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>App instalado no dispositivo</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={isOnline ? "default" : "destructive"} 
              className="gap-1"
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOnline ? 'Conectado à internet' : 'Modo offline ativo'}</p>
          </TooltipContent>
        </Tooltip>

        {hasUpdate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="gap-1 animate-pulse">
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">Atualização</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nova versão disponível</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground hidden md:inline">
              v{appVersion}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Versão do aplicativo</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
