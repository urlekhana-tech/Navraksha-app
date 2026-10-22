import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  AlertTriangle, 
  Compass, 
  MapPin, 
  Wind, 
  TrendingUp, 
  Mic, 
  ShieldCheck, 
  PhoneCall, 
  Download, 
  ArrowRight,
  Waves,
  Scan,
  IdCard,
  Gauge
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getWeatherData } from '../services/weatherData';
import { getRoutes } from '../services/routesData';
import { getFishMarketRates } from '../services/fishMarketData';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { captain } = useAuth();
  const { t, language } = useLanguage();
  const weather = getWeatherData('port-mangalore');
  const routes = getRoutes();
  const downloadedCount = routes.filter((r) => r.isDownloaded).length;
  const marketRates = getFishMarketRates('Mangalore Old Port');

  const [currentSpeed, setCurrentSpeed] = useState<number>(8.4);
  const [heading, setHeading] = useState<number>(285);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Hero Mariner Status Card */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-800/40 bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/80 p-5 sm:p-6 shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-15 hidden md:block pointer-events-none">
          <img
            src="/src/assets/images/navraksha_hero_boat_1792679776163.jpg"
            alt="Fishing Boat"
            referrerPolicy="no-referrer"
            className="w-80 h-44 object-cover rounded-tl-3xl"
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={captain.avatarUrl || '/src/assets/images/fisherman_captain_avatar_1792679776725.jpg'}
              alt={captain.name}
              referrerPolicy="no-referrer"
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl object-cover border-2 border-sky-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  {captain.role === 'fisherman' ? 'Licensed Sea Captain' : 'Vessel Master'}
                </span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-xs font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {captain.boatRegNo}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                {captain.name}
              </h1>
              <p className="text-sm text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Anchor className="h-3.5 w-3.5 text-sky-400" />
                <span className="font-medium text-white">{captain.boatName}</span>
                <span className="text-slate-400 text-xs">({captain.basePort})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => onNavigate('access-card')}
              className="flex items-center gap-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 px-3.5 py-2 text-xs font-medium text-sky-200 transition-all active:scale-95 touch-target"
            >
              <IdCard className="h-4 w-4 text-sky-400" />
              <span>{t('digitalId')}</span>
            </button>
            <button
              onClick={() => onNavigate('sos')}
              className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 border border-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-all active:scale-95 touch-target"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>SOS DISPATCH</span>
            </button>
          </div>
        </div>

        {/* Live Sea Status Banner Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800/80">
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Current Speed</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {currentSpeed} <span className="text-xs font-normal text-sky-400">knots</span>
            </div>
            <div className="text-[10px] text-emerald-400">Economic Cruising</div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Compass Heading</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {heading}° <span className="text-xs font-normal text-sky-400">WNW</span>
            </div>
            <div className="text-[10px] text-slate-300">Course Good</div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Wave Height</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {weather.waveHeightMeters}m <span className="text-xs font-normal text-sky-400">Swell</span>
            </div>
            <div className="text-[10px] text-emerald-400">Safe Sea State</div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Offline Sea Paths</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {downloadedCount} <span className="text-xs font-normal text-sky-400">Cached</span>
            </div>
            <div className="text-[10px] text-sky-300">Zero Cellular Ready</div>
          </div>
        </div>
      </div>

      {/* Primary Emergency Banner */}
      <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/60 via-slate-900/90 to-red-950/40 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 shrink-0">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Maritime Emergency Distress System
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Hold SOS button for 3 seconds to sound loud siren and transmit coordinates to Indian Coast Guard (1554).
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('sos')}
          className="whitespace-nowrap rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 touch-target"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Open SOS Console</span>
        </button>
      </div>

      {/* Grid of 4 Key Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GPS Sea Navigation */}
        <div
          onClick={() => onNavigate('gps')}
          className="group cursor-pointer rounded-2xl border border-sky-800/40 bg-slate-900/70 p-5 hover:border-sky-500/60 hover:bg-slate-900 transition-all shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 group-hover:scale-105 transition-transform">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                GPS Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              {t('gpsNav')}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time marine chart, live speed hud, marine compass rose, and route overlays.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400 mt-4">
            <span>Launch Sea Map</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Offline Routes */}
        <div
          onClick={() => onNavigate('offline-routes')}
          className="group cursor-pointer rounded-2xl border border-sky-800/40 bg-slate-900/70 p-5 hover:border-sky-500/60 hover:bg-slate-900 transition-all shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 group-hover:scale-105 transition-transform">
                <Download className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-mono text-sky-300 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-500/30">
                {downloadedCount} Ready
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              {t('offlineRoutes')}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Download coastal patrol paths & record new fishing waypoints with zero cellular network.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 mt-4">
            <span>Manage Routes</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Marine Weather Advisory */}
        <div
          onClick={() => onNavigate('weather')}
          className="group cursor-pointer rounded-2xl border border-sky-800/40 bg-slate-900/70 p-5 hover:border-sky-500/60 hover:bg-slate-900 transition-all shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 group-hover:scale-105 transition-transform">
                <Wind className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                SAFE TO SAIL
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              {t('marineWeather')}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Wind {weather.windSpeedKnots} kn {weather.windDirection}, Wave {weather.waveHeightMeters}m. High tide at {weather.nextHighTide}.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mt-4">
            <span>View Marine Radar</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Fish Market Intelligence */}
        <div
          onClick={() => onNavigate('fish-market')}
          className="group cursor-pointer rounded-2xl border border-sky-800/40 bg-slate-900/70 p-5 hover:border-sky-500/60 hover:bg-slate-900 transition-all shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                CMFRI Live
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t('fishMarket')}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Seer fish (Surmai) ₹780/kg, Silver Pomfret ₹1,040/kg, Mackerel ₹220/kg.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mt-4">
            <span>Landing Port Rates</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Split Section: Voice AI & Market Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice AI Mariner Assistant */}
        <div className="lg:col-span-1 rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">NavRaksha Voice AI</h3>
                <p className="text-xs text-slate-400">Speak in 23 regional languages</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-slate-300 space-y-2 mt-3">
              <div className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">
                Popular Mariner Inquiries
              </div>
              <p className="italic">"Is it safe to venture 20 miles out today?"</p>
              <p className="italic">"What is the PMMSY subsidy for boat engine?"</p>
              <p className="italic">"How can I save diesel during headwind?"</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-medium text-xs py-2.5 transition-all touch-target"
            >
              <Mic className="h-4 w-4" />
              <span>Talk to Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('ai-price')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 px-3 transition-colors touch-target"
              title="Fish Scanner"
            >
              <Scan className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Scan Fish</span>
            </button>
          </div>
        </div>

        {/* Live Catch Rate Table Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Today's Landing Rates</span>
                <span className="text-xs font-normal text-slate-400">· Mangalore Old Port</span>
              </h3>
              <p className="text-xs text-slate-400">Official harbor wholesale floor price</p>
            </div>
            <button
              onClick={() => onNavigate('fish-market')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-medium">Species</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium text-right">Floor Price</th>
                  <th className="pb-2 font-medium text-right">Today's Rate</th>
                  <th className="pb-2 font-medium text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {marketRates.slice(0, 5).map((fish) => {
                  const regionalName = fish.speciesLocal[language] || Object.values(fish.speciesLocal)[0];
                  return (
                    <tr key={fish.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5">
                        <div className="font-semibold text-white">{fish.speciesEn}</div>
                        <div className="text-[11px] text-sky-400">{regionalName}</div>
                      </td>
                      <td className="py-2.5 text-slate-400">{fish.category}</td>
                      <td className="py-2.5 text-right font-mono text-slate-400">
                        ₹{fish.minRate} - ₹{fish.maxRate}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                        ₹{fish.currentRate}/kg
                      </td>
                      <td className="py-2.5 text-right">
                        {fish.trend === 'up' && (
                          <span className="text-emerald-400 font-mono text-[11px]">↑ Hike</span>
                        )}
                        {fish.trend === 'down' && (
                          <span className="text-amber-400 font-mono text-[11px]">↓ Drop</span>
                        )}
                        {fish.trend === 'stable' && (
                          <span className="text-slate-400 font-mono text-[11px]">→ Steady</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Quick Access Strip */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Direct Maritime Distress Lines</div>
            <div className="text-[11px] text-slate-400">Free 24/7 National Coastal Emergency Dispatch</div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="tel:1554"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-sky-300 border border-slate-700"
          >
            <span>Coast Guard:</span>
            <span className="font-mono font-bold text-white">1554</span>
          </a>
          <a
            href="tel:100"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-sky-300 border border-slate-700"
          >
            <span>Marine Police:</span>
            <span className="font-mono font-bold text-white">100</span>
          </a>
          <a
            href="tel:18004251660"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-sky-300 border border-slate-700"
          >
            <span>Fisheries Dept:</span>
            <span className="font-mono font-bold text-white">1800-425-1660</span>
          </a>
        </div>
      </div>
    </div>
  );
};
