import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Menu, X, User, Calendar, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenBooking: () => void;
  onOpenAppointments: () => void;
}

export function Navbar({ onOpenAuth, onOpenBooking, onOpenAppointments }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
  };

  const getInitial = () => {
    if (profile?.full_name) return profile.full_name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    return profile?.full_name || user?.email?.split('@')[0] || 'Usuário';
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight text-foreground">RICARDO</h1>
            <span className="text-[0.65rem] text-primary tracking-[0.25em] font-bold uppercase">Barbershop</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide">
            Início
          </a>
          <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide">
            Serviços
          </a>
          <a href="#team" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide">
            Equipe
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide">
            Sobre
          </a>

          {!user ? (
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <Button variant="ghost" onClick={onOpenAuth} className="text-muted-foreground hover:text-primary">
                Entrar
              </Button>
              <Button onClick={onOpenBooking} className="btn-glow gradient-gold text-primary-foreground font-bold px-6 rounded-full shadow-lg shadow-primary/30">
                Agendar Horário
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 relative">
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-muted-foreground">Olá,</p>
                  <p className="text-sm font-bold text-foreground">{getDisplayName()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary border-2 border-primary overflow-hidden flex items-center justify-center">
                  <span className="font-bold text-primary">{getInitial()}</span>
                </div>
              </div>

              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up">
                  <button 
                    onClick={() => { onOpenAppointments(); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Meus Agendamentos
                  </button>
                  <button 
                    onClick={() => { onOpenBooking(); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Novo Agendamento
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              )}

              <Button onClick={onOpenBooking} className="btn-glow gradient-gold text-primary-foreground font-bold px-6 rounded-full shadow-lg shadow-primary/30 ml-2">
                Novo Corte
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-border p-6 animate-fade-in-up absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl z-40">
          <div className="flex flex-col gap-4">
            <a href="#home" className="text-lg font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Início
            </a>
            <a href="#services" className="text-lg font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Serviços
            </a>
            <a href="#team" className="text-lg font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Equipe
            </a>
            <a href="#about" className="text-lg font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Sobre
            </a>

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {!user ? (
                <>
                  <Button variant="ghost" onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }} className="justify-start">
                    Entrar / Cadastrar
                  </Button>
                  <Button onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }} className="gradient-gold text-primary-foreground">
                    Agendar Agora
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary border border-primary flex items-center justify-center">
                      <span className="font-bold text-primary">{getInitial()}</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Logado como</p>
                      <p className="font-bold text-foreground">{getDisplayName()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => { onOpenAppointments(); setMobileMenuOpen(false); }} className="justify-start text-primary">
                    <Calendar className="w-5 h-5 mr-2" /> Meus Agendamentos
                  </Button>
                  <Button onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }} className="gradient-gold text-primary-foreground">
                    Novo Agendamento
                  </Button>
                  <Button variant="ghost" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="justify-start text-destructive">
                    <LogOut className="w-5 h-5 mr-2" /> Sair
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
