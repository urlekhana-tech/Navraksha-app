import React from 'react';
import { 
  Home, 
  Compass, 
  Map, 
  CloudSun, 
  TrendingUp, 
  AlertTriangle,
  Mic,
  Scan
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'gps', label: t('gpsNav'), icon: Compass },
    { id: 'offline-routes', label: t('offlineRoutes'), icon: Map },
    { id: 'weather', label: t('marineWeather'), icon: CloudSun },
    { id: 'fish-market', label: t('fishMarket'), icon: TrendingUp },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-sky-900/40 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors relative ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-sky-500/15' : ''
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-sky-400 stroke-[2.2]' : 'text-slate-400'}`} />
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-0.5 max-w-[64px] truncate">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-sky-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
