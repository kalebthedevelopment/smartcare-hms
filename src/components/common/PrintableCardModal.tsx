import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { Patient } from '../../types/hms';
import { X, Printer, Download, ShieldCheck, QrCode, Phone, User, Calendar, Droplets, Trash2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

export const PrintableCardModal: React.FC = () => {
  const { printableCardPatient, setPrintableCardPatient, deletePatient, verifyAdminPassword, currentRole } = useHMS();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!printableCardPatient) return null;

  const patient = printableCardPatient;
  const qrCodeUrl = `${window.location.origin}/?patientCard=${encodeURIComponent(patient.cardNumber)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === 'ADMIN' || verifyAdminPassword(adminPassInput)) {
      deletePatient(patient.id);
      setPrintableCardPatient(null);
      setShowConfirmDelete(false);
      setAdminPassInput('');
    } else {
      setAdminError('Incorrect Admin Password! (Default: password123)');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        >
          {/* Modal Header Actions */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm tracking-wide">Digital EMR Patient Identification Card</span>
            </div>
            <button
              onClick={() => setPrintableCardPatient(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Card Area */}
          <div className="p-6 bg-slate-50">
            {/* The Actual Digital Card Badge */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden">
              {/* Ethiopian Flag Color Accent Header Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500"></div>

              {/* Watermark Background */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
                <QrCode className="w-48 h-48 text-white" />
              </div>

              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-700/80 mb-4">
                <div>
                  <div className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                    Federal Democratic Republic of Ethiopia
                  </div>
                  <h3 className="font-extrabold text-lg text-white tracking-wide">SmartCare Healthcare Center</h3>
                  <p className="text-[10px] text-slate-400">Electronic Medical Record (EMR) Card</p>
                </div>
                <div className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-widest uppercase">
                  ACTIVE
                </div>
              </div>

              {/* Main Card Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Photo & Original Vector QR Code */}
                <div className="col-span-1 flex flex-col items-center justify-center bg-slate-950/80 p-3 rounded-2xl border border-slate-700 text-center shadow-inner">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-lg mb-2">
                    {patient.fullName.charAt(0)}
                  </div>
                  <div className="p-1.5 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <QRCodeSVG
                      value={qrCodeUrl}
                      size={72}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                    <span>📱</span> SCAN EMR
                  </span>
                </div>

                {/* Patient Details */}
                <div className="col-span-2 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Card Number (ID)</span>
                    <span className="font-mono text-base font-extrabold text-emerald-300 bg-slate-950 px-2.5 py-0.5 rounded border border-emerald-800 inline-block">
                      {patient.cardNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Patient Full Name</span>
                    <span className="font-bold text-sm text-white">{patient.fullName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Age / Sex</span>
                      <span className="font-medium text-slate-200">{patient.age} Yrs / {patient.gender}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Blood Group</span>
                      <span className="font-bold text-emerald-400">{patient.bloodType || 'O+'}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[9px] uppercase text-slate-400 block">Phone</span>
                    <span className="font-mono text-slate-300">{patient.phone}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <div>Emergency Contact: <span className="text-slate-200 font-mono">{patient.emergencyContact}</span></div>
                <div>Issued: <span className="text-slate-300 font-mono">{new Date(patient.createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>

            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Verified Digital EMR Card:</strong> Patient card fee of <strong>{patient.cardFeeAmount} ETB</strong> verified via <strong>{patient.paymentMethod || 'Telebirr'}</strong>.
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Patient Record</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPrintableCardPatient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center space-x-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical EMR Card</span>
              </button>
            </div>
          </div>

          {/* Admin Confirmation Overlay for Patient Deletion */}
          {showConfirmDelete && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex items-center justify-center">
              <motion.form
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onSubmit={handleDeleteSubmit}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-white shadow-2xl"
              >
                <div className="flex items-center space-x-3 text-red-400">
                  <div className="p-3 bg-red-950 rounded-2xl border border-red-800">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Delete Patient Record</h4>
                    <p className="text-[11px] text-slate-400">
                      Deleting <span className="text-white font-bold">{patient.fullName}</span> ({patient.cardNumber}) requires Admin Password control.
                    </p>
                  </div>
                </div>

                {currentRole !== 'ADMIN' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Enter Admin Password to Authorize Delete *
                    </label>
                    <input
                      type="password"
                      required
                      autoFocus
                      value={adminPassInput}
                      onChange={(e) => setAdminPassInput(e.target.value)}
                      placeholder="Password (default: password123)"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 font-mono text-sm focus:border-red-500 outline-none"
                    />
                  </div>
                )}

                {adminError && (
                  <div className="p-2.5 bg-red-950 text-red-300 rounded-xl text-xs font-bold border border-red-800">
                    ⚠️ {adminError}
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmDelete(false);
                      setAdminPassInput('');
                      setAdminError('');
                    }}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs shadow-lg"
                  >
                    Permanently Delete
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
