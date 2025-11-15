import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';
import logo from '@/assets/logo-main.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao AprovI.A",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Usuário ou senha incorretos",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        <div className="flex justify-center items-center mb-8">
          <img 
            src={logo} 
            alt="AprovI.A" 
            className="w-full max-w-md animate-fade-in hover-scale mx-auto"
          />
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl text-center">Fazer Login</CardTitle>
            <CardDescription className="text-center text-sm">
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Ainda não tem acesso?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://aproviapagina.lovable.app', '_blank')}
              >
                Não tenho conta
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs sm:text-sm text-muted-foreground px-4">
          Ao fazer login, você concorda com nossos Termos de Uso
        </p>
      </div>
    </div>
  );
};

export default Login;
