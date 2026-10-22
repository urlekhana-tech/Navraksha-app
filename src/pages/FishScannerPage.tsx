import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Scan, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  RotateCw,
  Crown,
  ChevronRight,
  Fish
} from 'lucide-react';
import { FishScanResult } from '../types';

export const FishScannerPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(
    '/src/assets/images/fish_seer_surmai_1792679776889.jpg'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<FishScanResult | null>({
    speciesName: 'King Mackerel / Seer Fish (Surmai)',
    localName: 'ಅಂಜಲ್ (Anjal) / നെയ്മീൻ (Neymeen)',
    scientificName: 'Scomberomorus commerson',
    confidence: 97.4,
    estimatedWeightKg: 4.8,
    estimatedLengthCm: 72,
    freshnessGrade: 'Grade A Premium',
    estimatedMarketRatePerKg: 780,
    totalEstimatedBatchValue: 3744,
    marketDemand: 'High',
    coolingAdvice: 'Pack immediately in 1:1 ratio seawater ice slurry to preserve firm flesh and glistening silver skin.',
    bestLandingPort: 'Mangalore Old Port / Kochi Wharf',
  });

  // PremiumGate subscription state
  const [freeScansRemaining, setFreeScansRemaining] = useState<number>(2);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const sampleCatches = [
    {
      name: 'Kingfish Seer (Surmai)',
      image: '/src/assets/images/fish_seer_surmai_1792679776889.jpg',
      result: {
        speciesName: 'King Mackerel / Seer Fish (Surmai)',
        localName: 'ಅಂಜಲ್ (Anjal) / നെയ്മീൻ (Neymeen)',
        scientificName: 'Scomberomorus commerson',
        confidence: 97.4,
        estimatedWeightKg: 4.8,
        estimatedLengthCm: 72,
        freshnessGrade: 'Grade A Premium' as const,
        estimatedMarketRatePerKg: 780,
        totalEstimatedBatchValue: 3744,
        marketDemand: 'High' as const,
        coolingAdvice: 'Pack immediately in 1:1 ratio seawater ice slurry to preserve firm flesh and glistening silver skin.',
        bestLandingPort: 'Mangalore Old Port / Kochi Wharf',
      },
    },
    {
      name: 'Silver Pomfret (Paplet)',
      image: '/src/assets/images/navraksha_hero_boat_1792679776163.jpg',
      result: {
        speciesName: 'Silver Pomfret (White Paplet)',
        localName: 'ಮಾಂಜಿ (Manji) / വെള്ള ആവോലി',
        scientificName: 'Pampus argenteus',
        confidence: 95.8,
        estimatedWeightKg: 0.65,
        estimatedLengthCm: 28,
        freshnessGrade: 'Grade A Premium' as const,
        estimatedMarketRatePerKg: 1040,
        totalEstimatedBatchValue: 676,
        marketDemand: 'High' as const,
        coolingAdvice: 'Handle gently without stacking to avoid scale abrasions. Rapid chilling yields peak auction price.',
        bestLandingPort: 'Mumbai Sassoon Docks / Mangalore',
      },
    },
  ];

  const handleRunScan = () => {
    if (!isPremiumUnlocked && freeScansRemaining <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(sampleCatches[0].result);
      if (!isPremiumUnlocked) {
        setFreeScansRemaining((prev) => Math.max(0, prev - 1));
      }
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          handleRunScan();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Computer Vision Maritime AI
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs font-mono text-sky-400">Species & Valuation Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            AI Fish Scanner & Landing Price Estimator
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Snap catch photo at sea for instant species recognition, weight/grade appraisal, and wholesale valuation.
          </p>
        </div>

        {/* Premium Badge status */}
        <div className="flex items-center gap-2">
          {isPremiumUnlocked ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Crown className="h-4 w-4 text-amber-400" />
              <span>NavRaksha Pro Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700">
                {freeScansRemaining} Free Scans Left
              </span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs px-3 py-1.5 shadow-md transition-all active:scale-95"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Upgrade</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Split: Image Slot & Classification Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Image Canvas & Upload */}
        <div className="rounded-2xl border border-sky-800/40 bg-slate-900/70 p-5 flex flex-col justify-between">
          <div>
            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950 aspect-[4/3] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Catch Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {isScanning && (
                <div className="absolute inset-0 bg-sky-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full border-4 border-sky-400 border-t-transparent animate-spin mb-3" />
                  <div className="text-sm font-bold text-white">Analyzing Morphology & Scales...</div>
                  <div className="text-xs text-sky-300 font-mono mt-1">Cross-referencing CMFRI Species Bank</div>
                </div>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Sample Harbor Catch Photos:
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {sampleCatches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(item.image);
                      setScanResult(item.result);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-colors ${
                      selectedImage === item.image
                        ? 'border-sky-400 bg-sky-950/60 text-white font-medium'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Fish className="h-3.5 w-3.5 text-sky-400" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <label className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-3 border border-slate-700 transition-colors touch-target">
              <Upload className="h-4 w-4 text-sky-400" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-3 shadow-lg shadow-sky-600/30 transition-all touch-target"
            >
              <Scan className="h-4 w-4" />
              <span>{isScanning ? 'Scanning...' : 'Scan & Value'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Appraisal Card */}
        <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5 flex flex-col justify-between">
          {scanResult ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      {scanResult.confidence}% Confidence
                    </span>
                    <span className="text-[10px] font-mono text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-500/30">
                      {scanResult.freshnessGrade}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-1.5">
                    {scanResult.speciesName}
                  </h3>
                  <div className="text-sm font-semibold text-emerald-400">
                    {scanResult.localName}
                  </div>
                  <div className="text-xs text-slate-400 italic">
                    {scanResult.scientificName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Today's Wholesale</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    ₹{scanResult.estimatedMarketRatePerKg}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">per kg</div>
                </div>
              </div>

              {/* Physical Appraisal Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Est. Weight</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {scanResult.estimatedWeightKg} kg
                  </div>
                </div>
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Est. Length</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {scanResult.estimatedLengthCm} cm
                  </div>
                </div>
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Market Demand</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">
                    {scanResult.marketDemand}
                  </div>
                </div>
              </div>

              {/* Total Estimated Batch Valuation */}
              <div className="rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 p-4 border border-emerald-500/30">
                <div className="text-xs text-slate-300">Specimen Wholesale Landing Valuation:</div>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  ₹{scanResult.totalEstimatedBatchValue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Optimal landing wharf: <span className="text-white font-medium">{scanResult.bestLandingPort}</span>
                </div>
              </div>

              {/* Quality Preservation & Ice Slurry Advice */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Quality Preservation & Chilling Protocol</span>
                </div>
                <p className="leading-relaxed text-slate-300">{scanResult.coolingAdvice}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Scan className="h-12 w-12 text-slate-600 mb-2" />
              <div className="text-sm font-semibold text-white">No Catch Scanned Yet</div>
              <div className="text-xs text-slate-400 mt-1 max-w-xs">
                Upload a photo or tap a sample catch on the left to appraise species and market rate.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Subscription Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-3">
              <Crown className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Unlock Unlimited AI Fish Scanning
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Upgrade to NavRaksha Pro for unlimited high-resolution species classification, automated batch tallying, and export valuation logs.
            </p>

            <div className="my-4 space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Unlimited catch photos at sea</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Deep morphological quality grading</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Direct auction floor price verification</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center mb-4">
              <span className="text-2xl font-black font-mono text-white">₹199</span>
              <span className="text-xs text-slate-400"> / fishing season (6 months)</span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setIsPremiumUnlocked(true);
                  setShowUpgradeModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Activate Pro Membership</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
