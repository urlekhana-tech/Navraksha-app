import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Check, 
  MapPin, 
  Play, 
  Square, 
  Save, 
  Trash2, 
  Navigation, 
  Wifi, 
  WifiOff, 
  Plus, 
  Layers, 
  Clock, 
  Anchor,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SeaRoute, GpsCoordinate } from '../types';
import { 
  getRoutes, 
  toggleRouteDownload, 
  saveCustomRecordedRoute, 
  deleteRoute, 
  calculateDistanceKm,
  calculateTotalRouteDistance 
} from '../services/routesData';
import { useLanguage } from '../contexts/LanguageContext';

interface OfflineRoutesPageProps {
  onNavigateToGps?: () => void;
}

export const OfflineRoutesPage: React.FC<OfflineRoutesPageProps> = ({ onNavigateToGps }) => {
  const { t } = useLanguage();
  const [routes, setRoutes] = useState<SeaRoute[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Sea Path GPS Recorder states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedWaypoints, setRecordedWaypoints] = useState<GpsCoordinate[]>([]);
  const [liveDistanceKm, setLiveDistanceKm] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [customRouteName, setCustomRouteName] = useState<string>('');
  const [customRouteDesc, setCustomRouteDesc] = useState<string>('');

  useEffect(() => {
    setRoutes(getRoutes());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle Download Toggle
  const handleToggleDownload = (routeId: string) => {
    const updated = toggleRouteDownload(routeId);
    setRoutes(updated);
  };

  // Handle Route Delete
  const handleDeleteRoute = (routeId: string) => {
    if (window.confirm('Are you sure you want to delete this sea route?')) {
      const updated = deleteRoute(routeId);
      setRoutes(updated);
    }
  };

  // Recording Timer and Simulated GPS Trail
  useEffect(() => {
    let timer: any = null;
    let gpsSim: any = null;

    if (isRecording) {
      // Base initial point (near Panambur coast)
      let currentLat = 12.9423;
      let currentLng = 74.8021;

      timer = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);
      }, 1000);

      gpsSim = setInterval(() => {
        // Increment coordinates slightly simulating vessel movement
        currentLat += (Math.random() - 0.48) * 0.0006;
        currentLng -= 0.0007; // moving out to sea

        const newPoint: GpsCoordinate = {
          lat: Number(currentLat.toFixed(6)),
          lng: Number(currentLng.toFixed(6)),
          timestamp: Date.now(),
          speedKnots: Number((7.5 + Math.random() * 2).toFixed(1)),
        };

        setRecordedWaypoints((prev) => {
          const updated = [...prev, newPoint];
          const dist = calculateTotalRouteDistance(updated);
          setLiveDistanceKm(dist);
          return updated;
        });
      }, 3000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (gpsSim) clearInterval(gpsSim);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordedWaypoints([
      { lat: 12.9423, lng: 74.8021, timestamp: Date.now(), speedKnots: 8.0 }
    ]);
    setLiveDistanceKm(0);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordedWaypoints.length > 1) {
      setCustomRouteName(`Deep Sea Secret Spot #${routes.filter(r => r.isCustom).length + 1}`);
      setCustomRouteDesc('Artisanal gill-netting corridor recorded live at sea.');
      setIsSaveModalOpen(true);
    }
  };

  const handleConfirmSaveRoute = () => {
    if (!customRouteName.trim()) return;

    saveCustomRecordedRoute(customRouteName, recordedWaypoints, customRouteDesc);
    setRoutes(getRoutes());
    setIsSaveModalOpen(false);
    setRecordedWaypoints([]);
    setLiveDistanceKm(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadedCount = routes.filter((r) => r.isDownloaded).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Network Status Banner */}
      <div
        className={`rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors ${
          isOnline
            ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
            : 'border-amber-500/40 bg-amber-950/30 text-amber-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>
          <div>
            <div className="font-bold text-sm text-white">
              {isOnline ? 'Harbor Cellular Online' : 'Zero Cellular / Sea Offline Mode'}
            </div>
            <div className="text-xs text-slate-300">
              {isOnline
                ? 'Ready to cache offline coastal navigation routes to device storage.'
                : 'Using locally stored sea charts and GPS waypoints with zero data connection.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
          <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-sky-400">
            {downloadedCount} / {routes.length} Downloaded
          </span>
        </div>
      </div>

      {/* Sea Path GPS Live Recorder Box */}
      <div className="rounded-2xl border border-sky-800/50 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/60 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-lg font-bold text-white">Sea Path GPS Trail Recorder</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mark secret fishing banks, reef waypoints, and safe return corridors as you cruise.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isRecording ? (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs uppercase px-4 py-2.5 shadow-lg shadow-amber-600/30 transition-all touch-target"
              >
                <Square className="h-4 w-4 fill-current" />
                <span>Stop & Save Path</span>
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs uppercase px-4 py-2.5 shadow-lg shadow-sky-600/30 transition-all touch-target"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Recording Trail</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Recording HUD */}
        {isRecording && (
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
            <div className="rounded-xl bg-slate-950/80 p-3 border border-sky-500/30 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Duration</div>
              <div className="text-lg font-mono font-bold text-sky-400 mt-0.5">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/80 p-3 border border-sky-500/30 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Haversine Distance</div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                {liveDistanceKm} <span className="text-xs">km</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/80 p-3 border border-sky-500/30 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Waypoints</div>
              <div className="text-lg font-mono font-bold text-white mt-0.5">
                {recordedWaypoints.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Routes Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Coastal Sea Routes & Patrols</h3>
            <p className="text-xs text-slate-400">
              Pre-calculated channels avoiding shallow sandbars and marine shipping lanes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-md ${
                route.isDownloaded
                  ? 'border-sky-700/60 bg-slate-900/80'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {route.isCustom && (
                        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-600/40">
                          Custom
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-sky-400">
                        {route.port}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      {route.name}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleToggleDownload(route.id)}
                    className={`rounded-xl p-2 transition-all touch-target ${
                      route.isDownloaded
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-400/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                    title={route.isDownloaded ? 'Saved to Offline Storage' : 'Download for Offline Sea Use'}
                  >
                    {route.isDownloaded ? (
                      <CheckCircle2 className="h-5 w-5 text-sky-400" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {route.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Distance</span>
                    <span className="font-bold text-white">{route.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Duration</span>
                    <span className="font-bold text-white">{route.durationMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Points</span>
                    <span className="font-bold text-sky-400">{route.waypoints.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  {route.isDownloaded ? 'Downloaded · Zero Data' : 'Cloud Available'}
                </span>

                <div className="flex items-center gap-1.5">
                  {route.isCustom && (
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Custom Route"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {onNavigateToGps && (
                    <button
                      onClick={onNavigateToGps}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-medium text-white transition-colors"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>View on GPS</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Custom Route Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-sky-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Anchor className="h-5 w-5 text-sky-400" />
              <span>Save Custom Fishing Trail</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Captured {recordedWaypoints.length} GPS coordinates across {liveDistanceKm} km.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Route / Fishing Spot Name
                </label>
                <input
                  type="text"
                  value={customRouteName}
                  onChange={(e) => setCustomRouteName(e.target.value)}
                  placeholder="e.g. Someshwar Reef Secret Trawl"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Description / Catch Notes
                </label>
                <textarea
                  value={customRouteDesc}
                  onChange={(e) => setCustomRouteDesc(e.target.value)}
                  placeholder="e.g. Good depth contour for Seer fish during morning tide."
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleConfirmSaveRoute}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-600/30 transition-colors"
              >
                Save to Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
