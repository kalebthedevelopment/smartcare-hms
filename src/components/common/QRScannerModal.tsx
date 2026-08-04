import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import {
  X,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Search,
  Lock,
  UserCheck,
  Stethoscope,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QRScannerModal: React.FC = () => {
  const {
    isQrScannerOpen,
    setIsQrScannerOpen,
    handleQrScanInput,
    securedScanNotice,
    setSecuredScanNotice,
    patients,
    isAuthenticated,
    currentRole,
    setCurrentRole,
    logout,
  } = useHMS();

  const [scanInput, setScanInput] = useState('');
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(true);

  if (!isQrScannerOpen && !securedScanNotice) return null;

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) {
      handleQrScanInput(scanInput.trim());
      setScanInput('');
    }
  };

  const handleQuickCardClick = (cardNum: string) => {
    handleQrScanInput(cardNum);
  };

  return (
    <AnimatePresence>
      {/* 1. SECURED SCAN NOTICE MODAL (Shown when unauthenticated/public scans QR code) */}
      {securedScanNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            {/* Secured Header Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-slate-900 to-slate-950 text-white p-6 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-amber-300">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase block">
                      FDRE Health Data Security
                    </span>
                    <h3 className="font-black text-lg text-white tracking-tight">Secured EMR Record</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSecuredScanNotice(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Watermark Lock */}
              <Lock className="absolute -right-6 -bottom-6 w-36 h-36 text-amber-500/10 pointer-events-none" />
            </div>

            {/* Secured Content Body */}
            <div className="p-6 space-y-5">
              {/* Privacy Warning Alert Box */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Secured & Privacy Protected</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Medical profile for card <code className="font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded text-amber-950">{securedScanNotice.cardNumber}</code> is encrypted and secured under Ethiopian Health Privacy Protection Regulations. Public QR scanner access is restricted.
                </p>
              </div>

              {/* Status Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Verification Status:</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED ACTIVE EMR</span>
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Patient Name:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {securedScanNotice.patientNameMasked || '🔒 [Secured / Masked]'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Access Permission:</span>
                  <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                    Authorized Doctors & Staff Only
                  </span>
                </div>
              </div>

              {/* Instructions Call to Action */}
              <div className="text-center space-y-3 pt-1">
                <p className="text-xs text-slate-500">
                  When a doctor or registrar scans this QR code while authenticated, their system will automatically display the full medical profile.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSecuredScanNotice(null);
                      // Switch role to Doctor or Registrar to demonstrate automatic lookup
                      setCurrentRole('DOCTOR');
                      // Re-trigger scan for doctor automatically!
                      handleQrScanInput(securedScanNotice.cardNumber);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 transition text-xs"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Authenticate as Doctor & Open Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setSecuredScanNotice(null);
                      setCurrentRole('RECEPTIONIST');
                      handleQrScanInput(securedScanNotice.cardNumber);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold rounded-2xl flex items-center justify-center space-x-2 transition text-xs border border-slate-700"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Authenticate as Receptionist / Registrar</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. CAMERA & QR CODE SCANNER MODAL */}
      {isQrScannerOpen && !securedScanNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">SmartCare Web QR Code Scanner</h3>
                  <p className="text-[11px] text-slate-400">
                    Scan EMR Digital Card QR Code or paste card identifier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQrScannerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Body */}
            <div className="p-6 space-y-6 bg-slate-50">
              {/* Simulated Camera Scanner Window */}
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-500/50 aspect-video flex flex-col items-center justify-center shadow-inner group">
                {/* Camera Viewport Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] opacity-20 [background-size:12px_12px]" />

                {/* Animated Scanning Beam Line */}
                <motion.div
                  animate={{ y: [-70, 70, -70] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="absolute w-4/5 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
                />

                {/* Corner Frame Viewfinder Crosshairs */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

                {/* Center Target Icon */}
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <Camera className="w-10 h-10 text-emerald-400 animate-pulse mb-2" />
                  <span className="text-xs font-mono font-extrabold text-white tracking-wide">
                    ALIGN PATIENT QR CODE IN VIEWPORT
                  </span>
                  <span className="text-[10px] text-emerald-300/80 mt-1 font-mono">
                    {isAuthenticated
                      ? `🟢 Staff Authorized (${currentRole}) • Auto-Open Enabled`
                      : '🔒 Public View • Security Verification Enforced'}
                  </span>
                </div>
              </div>

              {/* Manual Input / Scan Form */}
              <form onSubmit={handleManualScanSubmit} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Enter or Scan Card Code (e.g., ETH-00102):</span>
                  <span className="text-[11px] text-emerald-600 font-mono font-bold">Web Scanner Ready</span>
                </label>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      placeholder="e.g. ETH-00102 or full QR URL"
                      className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-md shrink-0"
                  >
                    <span>Scan Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Sample QR Patient Quick-Test Buttons */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test Scan Registered Patient Cards:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Click card to simulate scan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {patients.slice(0, 6).map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => handleQuickCardClick(pat.cardNumber)}
                      className="p-2.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition text-xs group"
                    >
                      <div className="font-mono font-extrabold text-emerald-700 text-[11px] group-hover:text-emerald-800 flex items-center justify-between">
                        <span>{pat.cardNumber}</span>
                        <QrCode className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <div className="text-[11px] font-bold text-slate-900 truncate mt-0.5">
                        {pat.fullName}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">
                        {pat.age}Y / {pat.gender} • {pat.bloodType || 'O+'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SmartCare Web EMR Barcode & QR Reader</span>
              </span>

              <button
                onClick={() => setIsQrScannerOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Close Scanner
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
