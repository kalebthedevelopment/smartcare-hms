import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { StaffMember } from '../../types/hms';
import { Activity, Lock, User, ArrowRight, ShieldCheck, Key, Sparkles, CheckCircle2, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { login, staffList } = useHMS();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier || !password) {
      setErrorMessage('Please enter your name/email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(identifier, password);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const quickSignIn = (staff: StaffMember) => {
    setIdentifier(staff.email);
    setPassword(staff.password || 'password123');
    setErrorMessage('');
    login(staff.email, staff.password || 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand logo & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl shadow-emerald-950/60 mb-2">
            <Activity className="w-9 h-9 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              SmartCare <span className="text-emerald-400 font-mono">HMS</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ethiopian Regional Hospital Management & EMR Platform
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-mono px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Secure Local Station Sign In Required</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Staff Name, Email or Username
              </span>
              {identifier && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  Live Identity Search
                </span>
              )}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. Yonas or Meron or Dr."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white rounded-2xl px-4 py-3 text-xs font-medium placeholder-slate-500 transition outline-none"
            />

            {/* Real Name Auto-Match Output */}
            {identifier.trim().length > 0 && (() => {
              const query = identifier.trim().toLowerCase();
              const matches = staffList.filter(
                (s) =>
                  s.fullName.toLowerCase().includes(query) ||
                  s.email.toLowerCase().includes(query) ||
                  (s.username && s.username.toLowerCase().includes(query)) ||
                  s.role.toLowerCase().includes(query) ||
                  (s.department && s.department.toLowerCase().includes(query))
              );

              if (matches.length > 0) {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-slate-950 border border-emerald-800/80 rounded-2xl p-3 space-y-2 shadow-lg"
                  >
                    <div className="text-[10px] uppercase font-mono font-extrabold text-emerald-400 tracking-wider flex items-center justify-between">
                      <span>✓ Recognized Registered Real Staff Identity</span>
                      <span>{matches.length} Match{matches.length > 1 ? 'es' : ''}</span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {matches.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setIdentifier(m.fullName);
                          }}
                          className="w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700/60 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="text-lg bg-slate-800 p-1 rounded-lg shrink-0">
                              {m.avatar || '👤'}
                            </span>
                            <div>
                              <div className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition">
                                {m.fullName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Role: {m.role} • Dept: {m.department || 'General'}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-lg">
                            Select Real Name
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              }

              return (
                <div className="mt-1.5 text-[11px] text-slate-500 italic">
                  No staff member found matching "{identifier}". Enter full registered name.
                </div>
              );
            })()}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white rounded-2xl px-4 py-3 text-xs font-mono placeholder-slate-500 transition outline-none"
            />
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-950/80 border border-red-800/80 text-red-300 text-xs rounded-xl font-bold flex items-center space-x-2"
            >
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-950/60 transition text-sm flex items-center justify-center space-x-2 group"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </form>

        {/* Help hint */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-1.5">
          <p className="text-[11px] text-slate-400">
            SmartCare Hospital Local Workstation • Enter staff account credentials to log in.
          </p>
          <p className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 py-1 px-3 rounded-xl inline-block">
            🔑 System Password for all Staff & Admin: <span className="underline">password123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
