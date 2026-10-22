import React, { useState } from 'react';
import { 
  Anchor, 
  Phone, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [phone, setPhone] = useState<string>('9845123456');
  const [boatRegNo, setBoatRegNo] = useState<string>('IND-KA-02-MM-4491');
  const [captainName, setCaptainName] = useState<string>('Captain Basheer Ahmed');
  const [basePort, setBasePort] = useState<string>('Mangalore Old Port / Panambur');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !boatRegNo.trim()) {
      setError('Please provide phone number and boat registration ID');
      return;
    }
    login(`+91 ${phone}`, boatRegNo, captainName, basePort);
    onSuccess();
  };

  const handleQuickDemo = (port: string, boat: string, name: string) => {
    setBasePort(port);
    setBoatRegNo(boat);
    setCaptainName(name);
    login('+91 9845123456', boat, name, port);
    onSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-sky-800/50 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25 mb-3">
            <Anchor className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            NavRaksha · नाव रक्षा
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Smart Maritime Safety & Coastal Fisherman Companion
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-950/80 border border-red-700/60 p-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Fisherman Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98451 23456"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Registered Boat ID (DG Shipping)
            </label>
            <div className="relative">
              <input
                type="text"
                value={boatRegNo}
                onChange={(e) => setBoatRegNo(e.target.value)}
                placeholder="IND-KA-02-MM-4491"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Captain / Boat Master Name
            </label>
            <input
              type="text"
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
              placeholder="Captain Name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider py-3 shadow-lg shadow-sky-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 touch-target mt-2"
          >
            <span>Sign In to Vessel Terminal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Fast-Login Profiles */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-2 text-center">
            Or Sign In as Coastal Captain:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                handleQuickDemo(
                  'Mangalore Old Port / Panambur',
                  'IND-KA-02-MM-4491',
                  'Captain Basheer Ahmed'
                )
              }
              className="text-left p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 transition-colors"
            >
              <div className="text-xs font-bold text-white">Karnataka Trawler</div>
              <div className="text-[10px] text-slate-400 font-mono">IND-KA-02-MM</div>
            </button>

            <button
              onClick={() =>
                handleQuickDemo(
                  'Kochi Fort Kochi / Thoppumpady',
                  'IND-KL-07-MM-8920',
                  'Captain Antony Xavier'
                )
              }
              className="text-left p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 transition-colors"
            >
              <div className="text-xs font-bold text-white">Kerala Deep Sea</div>
              <div className="text-[10px] text-slate-400 font-mono">IND-KL-07-MM</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
