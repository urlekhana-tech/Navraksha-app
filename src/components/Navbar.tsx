import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  Wifi, 
  WifiOff, 
  Globe, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  Map, 
  CloudSun, 
  TrendingUp, 
  Mic, 
  Scan, 
  IdCard, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { language, setLanguage, languages, t, currentLanguageItem } = useLanguage();
  const { captain, logout } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navLinks = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'gps', label: t('gpsNav') },
    { id: 'offline-routes', label: t('offlineRoutes') },
    { id: 'weather', label: t('marineWeather') },
    { id: 'fish-market', label: t('fishMarket') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-900/40 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md shadow-sky-500/20">
              <Anchor className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">
                  NavRaksha
                </span>
                <span className="text-xs font-semibold text-sky-400">नाव रक्षा</span>
              </div>
              <div className="hidden text-[10px] text-slate-400 sm:block">
                Smart Maritime Companion
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-sky-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full" />
                )}
              </button>
            );
          })}
          
          <button
            onClick={() => onNavigate('ai-assistant')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              currentTab === 'ai-assistant'
                ? 'text-sky-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-sky-400" />
            <span>{t('aiAssistant')}</span>
          </button>

          <button
            onClick={() => onNavigate('ai-price')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              currentTab === 'ai-price'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Scan className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t('aiScanner')}</span>
          </button>
        </nav>

        {/* Zone 3: Right Action Area (Network, Language & Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Network indicator */}
          <div
            title={isOnline ? t('onlineStatus') : t('offlineStatus')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              isOnline
                ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                : 'border-amber-500/30 bg-amber-950/40 text-amber-300'
            }`}
          >
            {isOnline ? (
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline font-mono text-[11px]">
              {isOnline ? 'Online' : 'Sea Offline'}
            </span>
          </div>

          {/* SOS Quick Button in Header */}
          <button
            onClick={() => onNavigate('sos')}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 text-white px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-lg shadow-red-600/30 transition-all touch-target"
            title="Emergency SOS Hub"
          >
            <AlertTriangle className="h-4 w-4 animate-bounce" />
            <span className="hidden md:inline">SOS</span>
          </button>

          {/* 23 Languages Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors touch-target"
              aria-label="Change Language"
            >
              <Globe className="h-4 w-4 text-sky-400" />
              <span className="hidden sm:inline font-medium">
                {currentLanguageItem.nativeName}
              </span>
              <span className="sm:hidden font-mono uppercase text-[10px]">
                {currentLanguageItem.code}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-sky-800/40 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-sky-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Select Language (23 Available)
                </div>
                <div className="space-y-0.5">
                  {languages.map((lang) => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-sky-600 text-white font-medium'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] opacity-70">
                          {lang.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Captain Profile / Access Card quick jump */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsLangDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-800/60 transition-colors focus:outline-none"
              aria-label="Captain Profile Menu"
            >
              <img
                src={captain.avatarUrl || '/src/assets/images/fisherman_captain_avatar_1792679776725.jpg'}
                alt={captain.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-lg object-cover border border-sky-400/40 shadow-sm"
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-sky-800/40 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <img
                    src={captain.avatarUrl || '/src/assets/images/fisherman_captain_avatar_1792679776725.jpg'}
                    alt={captain.name}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-lg object-cover border border-sky-400/50"
                  />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white text-sm truncate">
                      {captain.name}
                    </div>
                    <div className="text-[11px] font-mono text-sky-400 truncate">
                      {captain.boatRegNo}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {captain.boatName}
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('access-card');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-sky-300 transition-colors"
                  >
                    <IdCard className="h-4 w-4 text-sky-400" />
                    <span>{t('digitalId')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('sos');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-red-300 hover:bg-red-950/40 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span>Emergency SOS Station</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                      onNavigate('login');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-t border-slate-800/60 mt-1 pt-2"
                  >
                    <LogOut className="h-4 w-4 text-slate-400" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
