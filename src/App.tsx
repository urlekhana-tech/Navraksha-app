import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { GpsNavigationPage } from './pages/GpsNavigationPage';
import { OfflineRoutesPage } from './pages/OfflineRoutesPage';
import { SosPage } from './pages/SosPage';
import { WeatherPage } from './pages/WeatherPage';
import { FishMarketPage } from './pages/FishMarketPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { FishScannerPage } from './pages/FishScannerPage';
import { DigitalIdCardPage } from './pages/DigitalIdCardPage';
import { LoginPage } from './pages/LoginPage';
import { AlertTriangle, Mic } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'dashboard';
  });

  // Sync hash with current tab
  useEffect(() => {
    window.location.hash = `#/${currentTab}`;
  }, [currentTab]);

  // Handle hash change from browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Protected route guard: if not authenticated, show login page
  if (!isAuthenticated && currentTab !== 'login') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center">
        <LoginPage onSuccess={() => setCurrentTab('dashboard')} />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'gps':
        return <GpsNavigationPage />;
      case 'offline-routes':
        return <OfflineRoutesPage onNavigateToGps={() => setCurrentTab('gps')} />;
      case 'sos':
        return <SosPage />;
      case 'weather':
        return <WeatherPage />;
      case 'fish-market':
        return <FishMarketPage />;
      case 'ai-assistant':
        return <VoiceAssistantPage />;
      case 'ai-price':
        return <FishScannerPage />;
      case 'access-card':
        return <DigitalIdCardPage />;
      case 'login':
        return <LoginPage onSuccess={() => setCurrentTab('dashboard')} />;
      default:
        return <DashboardPage onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Bar Contract (Wordmark + Desktop Links + Right Actions) */}
      <Navbar currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {renderActiveTab()}
      </main>

      {/* Floating Action Trigger on Mobile (Quick Voice Assistant & SOS if not on those tabs) */}
      {currentTab !== 'sos' && (
        <div className="lg:hidden fixed bottom-20 right-4 z-30 flex flex-col items-center gap-2.5">
          {currentTab !== 'ai-assistant' && (
            <button
              onClick={() => setCurrentTab('ai-assistant')}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-xl shadow-sky-600/40 border border-sky-400/40 transition-transform active:scale-95 touch-target"
              aria-label="Voice AI"
              title="Voice Assistant"
            >
              <Mic className="h-6 w-6" />
            </button>
          )}

          <button
            onClick={() => setCurrentTab('sos')}
            className="flex h-13 w-13 items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/50 border-2 border-red-400 animate-pulse transition-transform active:scale-95 touch-target"
            aria-label="Distress SOS"
            title="Emergency SOS"
          >
            <AlertTriangle className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
