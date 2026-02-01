import { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ServicesSection } from '@/components/ServicesSection';
import { TeamSection } from '@/components/TeamSection';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { AuthModal } from '@/components/AuthModal';
import { BookingModal } from '@/components/BookingModal';
import { AppointmentsModal } from '@/components/AppointmentsModal';
import { useAuth } from '@/hooks/useAuth';
import { Service } from '@/types/barbershop';

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string>();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [pendingBooking, setPendingBooking] = useState(false);

  const { user } = useAuth();

  const openAuth = useCallback((message?: string) => {
    setAuthMessage(message);
    setAuthModalOpen(true);
  }, []);

  const openBooking = useCallback((service?: Service) => {
    if (!user) {
      setPendingBooking(true);
      setSelectedService(service || null);
      openAuth('Para agendar seu horário, faça login ou crie sua conta.');
      return;
    }
    setSelectedService(service || null);
    setBookingModalOpen(true);
  }, [user, openAuth]);

  const handleAuthSuccess = useCallback(() => {
    if (pendingBooking) {
      setPendingBooking(false);
      setBookingModalOpen(true);
    }
  }, [pendingBooking]);

  const handleNeedAuth = useCallback(() => {
    setBookingModalOpen(false);
    openAuth('Para agendar seu horário, faça login ou crie sua conta.');
  }, [openAuth]);

  const openAppointments = useCallback(() => {
    if (!user) {
      openAuth('Faça login para ver seus agendamentos.');
      return;
    }
    setAppointmentsModalOpen(true);
  }, [user, openAuth]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onOpenAuth={() => openAuth()}
        onOpenBooking={() => openBooking()}
        onOpenAppointments={openAppointments}
      />

      <Hero onOpenBooking={() => openBooking()} />
      
      <ServicesSection onSelectService={(service) => openBooking(service)} />
      
      <TeamSection onOpenBooking={() => openBooking()} />
      
      <AboutSection />
      
      <Footer />
      
      <WhatsAppFloat />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingBooking(false);
        }}
        onSuccess={handleAuthSuccess}
        message={authMessage}
      />

      <BookingModal 
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedService(null);
        }}
        onNeedAuth={handleNeedAuth}
        initialService={selectedService}
      />

      <AppointmentsModal 
        isOpen={appointmentsModalOpen}
        onClose={() => setAppointmentsModalOpen(false)}
        onNewBooking={() => {
          setAppointmentsModalOpen(false);
          openBooking();
        }}
      />
    </div>
  );
};

export default Index;
