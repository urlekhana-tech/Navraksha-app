import React, { useState } from 'react';
import { 
  Wind, 
  Waves, 
  Compass, 
  Droplets, 
  Gauge, 
  Eye, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowUpRight,
  Clock,
  CloudRain,
  Sun,
  CloudSun
} from 'lucide-react';
import { COASTAL_PORTS_WEATHER, getWeatherData } from '../services/weatherData';
import { SafetyAdvisoryLevel } from '../types';

export const WeatherPage: React.FC = () => {
  const [selectedPortId, setSelectedPortId] = useState<string>('port-mangalore');
  const weather = getWeatherData(selectedPortId);

  const getAdvisoryBadge = (level: SafetyAdvisoryLevel) => {
    switch (level) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
          title: 'SAFE TO SAIL · हरी झंडी',
          icon: CheckCircle2,
          description: 'Favorable marine parameters. Small & motorized vessels permitted for normal fishing operations.',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-950/80 border-amber-500/60 text-amber-200',
          title: 'CAUTION: MODERATE SWELL · पीली चेतावनी',
          icon: AlertTriangle,
          description: 'Gusty sea squalls. Small artisanal canoes avoid deep waters. Exercise continuous radio watch.',
        };
      case 'DANGER':
        return {
          bg: 'bg-red-950/90 border-red-500/80 text-red-200',
          title: 'CYCLONE / DANGER ALERT · लाल चेतावनी: समुद्र में न जाएं',
          icon: ShieldAlert,
          description: 'IMD Red Warning! Rough to phenomenal sea conditions. DO NOT VENTURE INTO SEA. Return to harbor immediately.',
        };
    }
  };

  const advisory = getAdvisoryBadge(weather.advisoryLevel);
  const AdvisoryIcon = advisory.icon;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Port Switcher Bar */}
      <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
            Select Indian Coastal Port / Landing Wharf
          </span>
          <h1 className="text-xl font-bold text-white mt-0.5">
            {weather.portName}
          </h1>
        </div>

        <select
          value={selectedPortId}
          onChange={(e) => setSelectedPortId(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500 max-w-xs"
        >
          {COASTAL_PORTS_WEATHER.map((p) => (
            <option key={p.portId} value={p.portId}>
              {p.portName} ({p.state})
            </option>
          ))}
        </select>
      </div>

      {/* Sailing Safety Advisory Banner */}
      <div className={`rounded-2xl border p-5 shadow-xl transition-colors ${advisory.bg}`}>
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-white/10 shrink-0 mt-0.5">
            <AdvisoryIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-wider uppercase opacity-90">
              National Coastal Safety Advisory
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              {advisory.title}
            </h2>
            <p className="text-sm text-slate-100/90 mt-1 leading-relaxed">
              {weather.advisorySummary}
            </p>
            <p className="text-xs text-slate-200/80 mt-1 font-mono">
              {weather.advisoryDetails}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Marine Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Wind Speed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Wind className="h-4 w-4 text-sky-400" />
            <span>Wind Speed</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {weather.windSpeedKnots} <span className="text-xs font-normal text-sky-400">knots</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            {weather.windSpeedKmh} km/h
          </div>
        </div>

        {/* Metric 2: Wind Direction */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Compass className="h-4 w-4 text-sky-400" />
            <span>Direction</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {weather.windDirection}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Heading {weather.windHeadingDeg}°
          </div>
        </div>

        {/* Metric 3: Wave Height */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Waves className="h-4 w-4 text-sky-400" />
            <span>Wave Swell</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {weather.waveHeightMeters}m
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Period: {weather.swellPeriodSeconds}s
          </div>
        </div>

        {/* Metric 4: Visibility */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Eye className="h-4 w-4 text-sky-400" />
            <span>Visibility</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {weather.visibilityKm} <span className="text-xs font-normal text-sky-400">km</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {weather.visibilityKm > 10 ? 'High Clarity' : 'Hazy Sea'}
          </div>
        </div>

        {/* Metric 5: Pressure */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Gauge className="h-4 w-4 text-sky-400" />
            <span>Pressure</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {Math.round(weather.pressureHpa)}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            hPa Barometric
          </div>
        </div>

        {/* Metric 6: Water Temp */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Thermometer className="h-4 w-4 text-sky-400" />
            <span>Sea Surface</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {weather.waterTempC}°C
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Air {weather.temperatureC}°C
          </div>
        </div>
      </div>

      {/* Tidal Information Strip */}
      <div className="rounded-2xl border border-sky-800/40 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Upcoming High Tide (भरती)</div>
            <div className="text-base font-bold font-mono text-white">{weather.nextHighTide}</div>
            <div className="text-[11px] text-slate-400">Harbor bar mouth navigable for deeper draft vessels</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Upcoming Low Tide (ओहोटी)</div>
            <div className="text-base font-bold font-mono text-white">{weather.nextLowTide}</div>
            <div className="text-[11px] text-slate-400">Watch shallow sandbars when entering estuary basin</div>
          </div>
        </div>
      </div>

      {/* Hourly Coastal Marine Forecast */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-sky-400" />
          <span>Hourly Marine Forecast Timeline</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {weather.hourlyForecast.map((hour, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 text-center transition-all ${
                hour.status === 'SAFE'
                  ? 'border-slate-800 bg-slate-950/60'
                  : hour.status === 'CAUTION'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-red-500/50 bg-red-950/30'
              }`}
            >
              <div className="text-xs font-mono font-bold text-slate-300">{hour.time}</div>
              <div className="flex justify-center my-2">
                {hour.rainProb > 40 ? (
                  <CloudRain className="h-6 w-6 text-sky-400" />
                ) : (
                  <CloudSun className="h-6 w-6 text-amber-400" />
                )}
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {hour.windKnots} <span className="text-[10px] font-normal text-slate-400">knots</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Wave: {hour.waveMeters}m
              </div>
              <div className="text-[10px] font-mono text-sky-300 mt-1">
                Rain: {hour.rainProb}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
