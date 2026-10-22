import React, { useState } from 'react';
import { 
  Anchor, 
  ShieldCheck, 
  QrCode, 
  Download, 
  RotateCw, 
  Printer, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2,
  FileBadge
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const DigitalIdCardPage: React.FC = () => {
  const { captain } = useAuth();
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-900/40 pb-4">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block">
            Government of India · Ministry of Fisheries & DG Shipping
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Digital Maritime Identification & Vessel Access Card
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Official electronic biometrics and harbor landing credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Flip Card</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="flex justify-center py-6">
        <div
          className="relative w-full max-w-md h-[270px] cursor-pointer perspective-1000 select-none"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`w-full h-full duration-700 transform-style-3d relative transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* FRONT OF ACCESS CARD */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl p-5 text-white flex flex-col justify-between overflow-hidden shadow-2xl backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #032042 0%, #0c4a6e 50%, #0369a1 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white border border-white/25 backdrop-blur-md">
                    <Anchor className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-wider font-extrabold uppercase text-sky-200">
                      MARITIME ACCESS PERMIT
                    </div>
                    <div className="text-sm font-black tracking-tight text-white">
                      NAVRAKSHA HARBOR PASS
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  <span>VERIFIED</span>
                </div>
              </div>

              {/* Captain Body Details */}
              <div className="flex items-center gap-4 my-auto">
                <img
                  src={captain.avatarUrl || '/src/assets/images/fisherman_captain_avatar_1792679776725.jpg'}
                  alt={captain.name}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-[10px] font-mono text-sky-300 uppercase">
                    Master Mariner / {captain.role}
                  </div>
                  <h3 className="text-lg font-black text-white truncate">
                    {captain.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-sky-100 mt-0.5">
                    ID: {captain.boatRegNo}
                  </div>
                  <div className="text-[11px] text-sky-200 truncate mt-0.5">
                    Vessel: {captain.boatName}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Details */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-mono text-sky-200">
                <div>
                  <span className="opacity-70">Port:</span> {captain.basePort.split('/')[0]}
                </div>
                <div>
                  <span className="opacity-70">Valid Thru:</span> {captain.expiryDate}
                </div>
                <div className="text-white font-bold flex items-center gap-0.5">
                  <span>Tap to Flip</span>
                </div>
              </div>
            </div>

            {/* BACK OF ACCESS CARD */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl p-5 text-white flex flex-col justify-between overflow-hidden shadow-2xl backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #09131d 0%, #0f172a 60%, #1e293b 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
              }}
            >
              {/* Back Header */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                  SECURITY & EMERGENCY TELEMETRY
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Lic: {captain.licenseNo}
                </div>
              </div>

              {/* Back Body with QR code */}
              <div className="flex items-center justify-between gap-4 my-auto">
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Emergency Contact:</span>
                    <span className="font-semibold text-white text-[11px]">{captain.emergencyContactName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Contact Phone:</span>
                    <span className="font-mono text-sky-400">{captain.emergencyContactPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registration State:</span>
                    <span className="text-white">{captain.state}, India</span>
                  </div>
                </div>

                {/* Simulated SVG QR Code */}
                <div className="p-2.5 bg-white rounded-xl shadow-md shrink-0">
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="#0284c7">
                    <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
                    <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

                    <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
                    <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

                    <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
                    <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

                    <rect x="40" y="10" width="10" height="10" fill="#0284c7" />
                    <rect x="55" y="20" width="10" height="10" fill="#0284c7" />
                    <rect x="40" y="40" width="20" height="20" fill="#0284c7" />
                    <rect x="70" y="50" width="10" height="15" fill="#0284c7" />
                    <rect x="45" y="75" width="15" height="15" fill="#0284c7" />
                  </svg>
                </div>
              </div>

              {/* Back Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Scan for Coast Guard Verification</span>
                <span className="text-sky-400">Tap to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mariner Credentials Summary Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileBadge className="h-5 w-5 text-sky-400" />
          <span>Verified Maritime Vessel Registration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Vessel Name</span>
            <span className="font-bold text-white mt-0.5 block">{captain.boatName}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Reg Number</span>
            <span className="font-mono font-bold text-sky-400 mt-0.5 block">{captain.boatRegNo}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Fishery License</span>
            <span className="font-mono font-bold text-white mt-0.5 block">{captain.licenseNo}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Base Wharf</span>
            <span className="font-bold text-emerald-400 mt-0.5 block">{captain.basePort}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
