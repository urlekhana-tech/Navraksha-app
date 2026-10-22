import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Calculator, 
  Anchor, 
  Info,
  Clock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { PORTS_LIST, getFishMarketRates } from '../services/fishMarketData';
import { useLanguage } from '../contexts/LanguageContext';
import { FishSpeciesRate } from '../types';

export const FishMarketPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedPort, setSelectedPort] = useState<string>('Mangalore Old Port (Panambur)');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Quick Catch Valuation Calculator modal/state
  const [calcFish, setCalcFish] = useState<FishSpeciesRate | null>(null);
  const [calcWeightKg, setCalcWeightKg] = useState<number>(25);

  const rates = getFishMarketRates(selectedPort);

  const categories = ['All', 'Pelagic', 'Demersal', 'Crustacean', 'Cephalopod'];

  const filteredRates = rates.filter((fish) => {
    const matchesCategory = selectedCategory === 'All' || fish.category === selectedCategory;
    const localName = fish.speciesLocal[language] || '';
    const allLocalNames = Object.values(fish.speciesLocal).join(' ');
    const matchesSearch =
      fish.speciesEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allLocalNames.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Port Switcher & Subtitle */}
      <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              CMFRI & FMPIS Verified Harbor Floor Prices
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-[11px] font-mono text-slate-300">Updated Today 07:00 AM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Fish Market Intelligence & Daily Landing Rates
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time auction rates protecting fishermen against aggressive middleman markdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 whitespace-nowrap">Landing Port:</label>
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
          >
            {PORTS_LIST.map((port) => (
              <option key={port.id} value={port.name}>
                {port.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by English or local name (Surmai, Anjal, Paplet)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-xl bg-slate-900 border border-slate-800">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fish Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRates.map((fish) => {
          const regionalName = fish.speciesLocal[language] || Object.values(fish.speciesLocal)[0];
          return (
            <div
              key={fish.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between hover:border-sky-700/60 hover:bg-slate-900 transition-all shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                      {fish.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5 leading-snug">
                      {fish.speciesEn}
                    </h3>
                    <div className="text-xs font-semibold text-emerald-400">
                      {regionalName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-white">
                      ₹{fish.currentRate}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">per kg wholesale</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic mb-3">
                  {fish.scientificName}
                </div>

                {/* Min-Max Protected Floor Range */}
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Protected Range:</span>
                    <span className="text-white font-bold">
                      ₹{fish.minRate} - ₹{fish.maxRate} / kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Quality: {fish.freshnessGrade}</span>
                    <span className="text-emerald-400 font-medium">{fish.demandStatus} Demand</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {fish.trend === 'up' && (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>Hike (+₹{fish.currentRate - fish.previousRate})</span>
                    </span>
                  )}
                  {fish.trend === 'down' && (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <ArrowDown className="h-3.5 w-3.5" />
                      <span>Drop (-₹{fish.previousRate - fish.currentRate})</span>
                    </span>
                  )}
                  {fish.trend === 'stable' && (
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Minus className="h-3.5 w-3.5" />
                      <span>Steady Rate</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCalcFish(fish);
                    setCalcWeightKg(35);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 px-2.5 py-1.5 text-xs font-medium text-sky-300 transition-colors"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Calc Catch Value</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Catch Valuation Modal */}
      {calcFish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-sky-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-sky-400" />
              <span>Catch Auction Valuation Estimator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {calcFish.speciesEn} ({calcFish.speciesLocal[language] || ''}) at {selectedPort}
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Total Landed Catch Weight (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={calcWeightKg}
                    onChange={(e) => setCalcWeightKg(Number(e.target.value))}
                    className="flex-1 accent-sky-500"
                  />
                  <div className="w-20 text-center font-mono font-bold text-white bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-700">
                    {calcWeightKg} kg
                  </div>
                </div>
              </div>

              {/* Estimated Valuation Results */}
              <div className="rounded-xl bg-slate-950 p-4 border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Current Harbor Floor Rate:</span>
                  <span className="font-mono text-white">₹{calcFish.currentRate} / kg</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Landed Catch Weight:</span>
                  <span className="font-mono text-white">{calcWeightKg} kg</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-white">Estimated Auction Value:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ₹{(calcWeightKg * calcFish.currentRate).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  Fair value range: ₹{(calcWeightKg * calcFish.minRate).toLocaleString('en-IN')} - ₹{(calcWeightKg * calcFish.maxRate).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCalcFish(null)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg transition-colors"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
