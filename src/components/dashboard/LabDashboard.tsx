import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { StaffManagementModal } from '../common/StaffManagementModal';
import {
  FlaskConical,
  CheckCircle,
  Clock,
  Send,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  User,
  Key,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LabDashboard: React.FC = () => {
  const { labTests, submitLabResults, currentStaff } = useHMS();
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Test Result Form Inputs
  const [resultInputMap, setResultInputMap] = useState<Record<string, string>>({
    'lab-203': 'WBC: 6.8 10^3/uL, RBC: 4.9 10^6/uL, Hemoglobin: 14.2 g/dL (NORMAL 🟢)',
  });

  const [notesInputMap, setNotesInputMap] = useState<Record<string, string>>({});

  const pendingTests = labTests.filter((l) => l.status === 'PENDING');
  const completedTests = labTests.filter((l) => l.status === 'DONE');

  const handleResultChange = (id: string, val: string) => {
    setResultInputMap((prev) => ({ ...prev, [id]: val }));
  };

  const handleNotesChange = (id: string, val: string) => {
    setNotesInputMap((prev) => ({ ...prev, [id]: val }));
  };

  const handleTransmit = (id: string) => {
    const resultVal = resultInputMap[id] || 'Test performed according to standard SOPs. No abnormal findings.';
    const notesVal = notesInputMap[id] || 'Analyzed under light microscopy.';

    submitLabResults(id, resultVal, notesVal);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-md shrink-0">
            {currentStaff?.avatar || '🥼'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {currentStaff?.fullName || 'Bekele Worku'}
              </h1>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded font-mono">
                Senior Lab Tech
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Receive electronic requisitions, enter test metrics, and transmit diagnostic results.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setShowStaffModal(true)}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold flex items-center space-x-1.5 transition"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Change Password</span>
          </button>

          <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-xl text-center">
            <span className="text-purple-700 font-medium block text-[10px]">Pending Orders</span>
            <span className="text-base font-black text-purple-900 font-mono">{pendingTests.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
            <span className="text-emerald-700 font-medium block text-[10px]">Completed Today</span>
            <span className="text-base font-black text-emerald-900 font-mono">{completedTests.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Laboratory Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Pending Diagnostic Orders ({pendingTests.length})</span>
              </h2>
            </div>

            {pendingTests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                🎉 All laboratory orders have been processed and transmitted!
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTests.map((test) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-purple-50/50 border-2 border-purple-200 rounded-2xl space-y-4 shadow-sm"
                  >
                    {/* Patient & Requisitioner Banner */}
                    <div className="flex items-start justify-between border-b border-purple-200 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{test.patientName}</span>
                          <span className="font-mono text-xs bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-bold">
                            {test.patientCardNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Requested By: <strong>{test.doctorName}</strong> • {new Date(test.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <span className="text-xs bg-purple-200 text-purple-900 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {test.testCategory}
                      </span>
                    </div>

                    {/* Test Title */}
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block uppercase">Test Required</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{test.testName}</h4>
                    </div>

                    {/* Results Input Box */}
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-purple-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Test Results & Metrics Entry *
                        </label>
                        <textarea
                          rows={2}
                          value={resultInputMap[test.id] || ''}
                          onChange={(e) => handleResultChange(test.id, e.target.value)}
                          placeholder="e.g. Widal O Antigen: 1:160 Positive (🔴), Widal H: 1:80 Negative"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Lab Technician Comments / Observation Notes
                        </label>
                        <input
                          type="text"
                          value={notesInputMap[test.id] || ''}
                          onChange={(e) => handleNotesChange(test.id, e.target.value)}
                          placeholder="e.g. High antibody titer observed."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleTransmit(test.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition text-xs"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>🟢 Complete & Transmit Result to Doctor</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Completed Laboratory History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Transmitted Test Results Log ({completedTests.length})</span>
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {completedTests.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{t.patientName}</span>
                    <span className="font-mono text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-bold">
                      {t.patientCardNumber}
                    </span>
                  </div>

                  <div className="text-slate-600 font-semibold">{t.testName}</div>

                  <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-lg font-mono text-emerald-900 font-bold text-[11px]">
                    {t.results}
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Requisitioner: {t.doctorName}</span>
                    <span>Done: {new Date(t.completedAt || t.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Security Modal */}
      <StaffManagementModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        initialMode="CHANGE_PASSWORD"
      />
    </div>
  );
};
