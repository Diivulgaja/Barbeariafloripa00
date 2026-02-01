import { useState } from 'react';
import { X, AlertCircle, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, message }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: error.message,
      });
      return;
    }

    toast({
      title: 'Login efetuado!',
      description: 'Bem-vindo de volta.',
    });

    onClose();
    onSuccess?.();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ 
      name: registerName, 
      email: registerEmail, 
      password: registerPassword 
    });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await signUp(registerEmail, registerPassword, registerName);
    setLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error.message,
      });
      return;
    }

    toast({
      title: 'Conta criada!',
      description: 'Verifique seu email para confirmar o cadastro.',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scale-up border border-border bg-card">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Message */}
          {message && (
            <div className="mb-6 bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-primary">{message}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-6">
            <button
              onClick={() => setTab('login')}
              className={`pb-2 font-bold text-lg transition-all ${
                tab === 'login' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab('register')}
              className={`pb-2 font-bold text-lg transition-all ${
                tab === 'register' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="glass-input rounded-xl py-3 pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="glass-input rounded-xl py-3 pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full gradient-gold text-primary-foreground font-bold py-3 rounded-xl"
              >
                {loading ? <span className="loader" /> : 'Entrar'}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="glass-input rounded-xl py-3 pl-10"
                    placeholder="Seu nome"
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="glass-input rounded-xl py-3 pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="glass-input rounded-xl py-3 pl-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full gradient-gold text-primary-foreground font-bold py-3 rounded-xl"
              >
                {loading ? <span className="loader" /> : 'Criar Conta'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
