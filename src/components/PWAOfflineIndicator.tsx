import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PWAOfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      toast({
        title: "Conexão restaurada",
        description: "Você está online novamente!",
        variant: "default",
      });
      
      // Hide indicator after 3 seconds when back online
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
      toast({
        title: "Você está offline",
        description: "Alguns recursos podem estar limitados.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="px-4 py-2 shadow-lg"
      >
        {isOnline ? (
          <>
            <Wifi className="mr-2 h-4 w-4" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="mr-2 h-4 w-4" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
};
