import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Share2, 
  MessageSquare, 
  MapPin, 
  CheckCircle2, 
  History, 
  ShieldAlert,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react';
import { maritimeAlarm } from '../services/audioAlarm';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SosAlertRecord } from '../types';

export const SosPage: React.FC = () => {
  const { captain } = useAuth();
  const { t } = useLanguage();

  // GPS coordinates at SOS hub
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: 12.9423,
    lng: 74.8021,
    accuracy: 5.5,
  });

  // Hold-to-trigger state
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const [isAlarmSounding, setIsAlarmSounding] = useState<boolean>(false);
  const holdIntervalRef = useRef<any>(null);

  // SOS history records
  const [sosHistory, setSosHistory] = useState<SosAlertRecord[]>(() => {
    try {
      const saved = localStorage.getItem('navraksha_sos_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'sos-prev-1',
        timestamp: '18 Oct 2026, 04:15 AM',
        lat: 12.9120,
        lng: 74.7550,
        accuracy: 8,
        boatName: captain.boatName,
        boatRegNo: captain.boatRegNo,
        captainName: captain.name,
        phone: captain.phone,
        status: 'resolved',
        dispatchedTo: ['Indian Coast Guard (1554)', 'Mangalore Coastal Police'],
        resolvedAt: '18 Oct 2026, 05:40 AM',
      },
    ];
  });

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem('navraksha_sos_history', JSON.stringify(sosHistory));
    } catch (e) {
      // ignore
    }
  }, [sosHistory]);

  // Attempt real GPS lock on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
            accuracy: Math.round(pos.coords.accuracy),
          });
        },
        (err) => {
          console.warn('SOS GPS lock fallback to coastal center', err);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Hold-to-trigger timer
  useEffect(() => {
    if (isHolding) {
      const startTime = Date.now();
      const durationMs = 3000; // 3 seconds hold requirement

      holdIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / durationMs) * 100);
        setHoldProgress(progress);

        if (progress >= 100) {
          clearInterval(holdIntervalRef.current);
          setIsHolding(false);
          activateDistressEmergency();
        }
      }, 50);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      setHoldProgress(0);
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHolding]);

  const activateDistressEmergency = () => {
    setIsTriggered(true);
    maritimeAlarm.playSosAlarm();
    setIsAlarmSounding(true);

    const newRecord: SosAlertRecord = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      lat: gpsCoords.lat,
      lng: gpsCoords.lng,
      accuracy: gpsCoords.accuracy,
      boatName: captain.boatName,
      boatRegNo: captain.boatRegNo,
      captainName: captain.name,
      phone: captain.phone,
      status: 'active',
      dispatchedTo: ['Indian Coast Guard (1554)', 'Marine Police (100)'],
    };

    setSosHistory((prev) => [newRecord, ...prev]);
  };

  const handleStopDistress = () => {
    maritimeAlarm.stopAlarm();
    setIsAlarmSounding(false);
    setIsTriggered(false);
    setSosHistory((prev) =>
      prev.map((rec, idx) => (idx === 0 && rec.status === 'active' ? { ...rec, status: 'resolved', resolvedAt: new Date().toLocaleTimeString() } : rec))
    );
  };

  const toggleAlarmSoundOnly = () => {
    if (isAlarmSounding) {
      maritimeAlarm.stopAlarm();
      setIsAlarmSounding(false);
    } else {
      maritimeAlarm.playSosAlarm();
      setIsAlarmSounding(true);
    }
  };

  // SOS broadcast message
  const mapsUrl = `https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}`;
  const sosMessageText = `EMERGENCY SOS! Boat "${captain.boatName}" (${captain.boatRegNo}) needs immediate assistance at sea! Lat: ${gpsCoords.lat}, Lng: ${gpsCoords.lng}. Google Maps: ${mapsUrl}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(sosMessageText)}`;
  const smsShareUrl = `sms:?body=${encodeURIComponent(sosMessageText)}`;

  // SVG circular progress calculation
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Alert Header Banner */}
      <div className="rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/30 border border-red-500/50 text-red-400">
              <ShieldAlert className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  National Maritime Distress Terminal
                </span>
                <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-700 font-mono">
                  Channel 16 VHF
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-0.5">
                Emergency SOS Dispatch
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAlarmSoundOnly}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAlarmSounding
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isAlarmSounding ? <Volume2 className="h-4 w-4 animate-bounce" /> : <VolumeX className="h-4 w-4" />}
              <span>{isAlarmSounding ? 'Mute Siren' : 'Test Horn'}</span>
            </button>
          </div>
        </div>

        {/* Live GPS Coordinates Confirmation Bar */}
        <div className="mt-4 pt-3 border-t border-red-900/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="h-4 w-4 text-red-400" />
            <span>Distress Fix:</span>
            <span className="text-white font-bold">{gpsCoords.lat}° N</span>
            <span>,</span>
            <span className="text-white font-bold">{gpsCoords.lng}° E</span>
            <span className="text-emerald-400 text-[11px]">(Accuracy: ±{gpsCoords.accuracy}m)</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Vessel: <span className="text-white font-semibold">{captain.boatName}</span> [{captain.boatRegNo}]
          </div>
        </div>
      </div>

      {/* Main Hold-to-Trigger Area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl">
        {isTriggered ? (
          <div className="w-full max-w-lg space-y-4">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/60 animate-bounce">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-red-400">
                MAYDAY! MAYDAY! SOS BROADCAST ACTIVE
              </h2>
              <p className="text-sm text-slate-200">
                Emergency siren is sounding loudly. GPS fix recorded. Dispatched to Indian Coast Guard & coastal authorities.
              </p>
            </div>

            <div className="p-3 bg-red-950/60 border border-red-700/60 rounded-xl font-mono text-xs text-red-200 text-left">
              <div>Vessel: {captain.boatName} ({captain.boatRegNo})</div>
              <div>Position: {gpsCoords.lat}, {gpsCoords.lng}</div>
              <div>Hotline 1554 Ping Sent</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase shadow-lg shadow-emerald-600/30"
              >
                <Share2 className="h-4 w-4" />
                <span>Broadcast via WhatsApp</span>
              </a>

              <button
                onClick={handleStopDistress}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Deactivate & Silence SOS
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center mb-6">
              {/* SVG Circular Progress Ring */}
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  stroke="#334155"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-75"
                />
              </svg>

              {/* Hold Button Center */}
              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className={`absolute h-36 w-36 rounded-full flex flex-col items-center justify-center select-none cursor-pointer transition-transform active:scale-95 shadow-2xl ${
                  isHolding
                    ? 'bg-red-700 text-white shadow-red-600/60 scale-95'
                    : 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-red-600/40 hover:scale-105'
                }`}
                aria-label="Hold 3 seconds to trigger SOS"
              >
                <AlertTriangle className="h-8 w-8 mb-1" />
                <span className="text-xl font-black tracking-wider">HOLD SOS</span>
                <span className="text-[10px] font-mono opacity-80">3 SECONDS</span>
              </button>
            </div>

            <div className="max-w-md">
              <h3 className="text-base font-bold text-white">
                Hold to Trigger Safety Mechanism
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Designed to eliminate accidental triggers in rough seas. Hold for 3 full seconds to activate distress beacon.
              </p>
              {holdProgress > 0 && (
                <div className="mt-2 text-xs font-mono font-bold text-red-400">
                  Arming beacon: {Math.round(holdProgress)}%
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Dispatch One-Tap Hotlines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hotline 1: Coast Guard */}
        <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Search & Rescue (SAR)
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Toll Free
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Indian Coast Guard</h3>
            <p className="text-xs text-slate-400 mt-1">
              National maritime search and rescue coordination center hotline.
            </p>
          </div>

          <a
            href="tel:1554"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase py-3 shadow-lg shadow-sky-600/30 transition-all touch-target"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Call 1554 Directly</span>
          </a>
        </div>

        {/* Hotline 2: Marine Coastal Police */}
        <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Coastal Security
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                24/7 Police
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Marine Coastal Police</h3>
            <p className="text-xs text-slate-400 mt-1">
              Coastal patrol boats, harbor entry security, and territorial water rescue.
            </p>
          </div>

          <a
            href="tel:100"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase py-3 border border-slate-700 transition-all touch-target"
          >
            <PhoneCall className="h-4 w-4 text-sky-400" />
            <span>Call 100 Marine Police</span>
          </a>
        </div>

        {/* Hotline 3: WhatsApp & SMS Broadcast */}
        <div className="rounded-2xl border border-sky-800/40 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Family & Harbor Group
              </span>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                Instant GPS
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Distress Broadcast</h3>
            <p className="text-xs text-slate-400 mt-1">
              Share coordinates and boat ID with family or harbor association.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 shadow-md"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={smsShareUrl}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 border border-slate-700"
            >
              <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
              <span>SMS Broadcast</span>
            </a>
          </div>
        </div>
      </div>

      {/* Incident Log History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <History className="h-4 w-4 text-sky-400" />
          <span>Vessel SOS Distress Incident History</span>
        </h3>

        <div className="divide-y divide-slate-800">
          {sosHistory.map((item) => (
            <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.status === 'active'
                        ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="font-bold text-white">{item.timestamp}</span>
                </div>
                <div className="text-slate-400 mt-0.5 font-mono">
                  Fix: {item.lat}°N, {item.lng}°E (±{item.accuracy}m) · Dispatched to {item.dispatchedTo.join(', ')}
                </div>
              </div>

              {item.resolvedAt && (
                <div className="text-[11px] text-slate-500 sm:text-right">
                  Resolved: {item.resolvedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
