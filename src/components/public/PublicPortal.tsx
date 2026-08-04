import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { PaymentMethod } from '../../types/hms';
import {
  Calendar,
  Search,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  Clock,
  UserPlus,
  ArrowRight,
  PhoneCall,
  MapPin,
  Sparkles,
  QrCode,
  FileText,
  Microscope,
  Pill,
  Coins,
  CalendarCheck,
  UserCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'motion/react';

export const PublicPortal: React.FC = () => {
  const {
    setCurrentRole,
    staffList,
    bookAppointment,
    openPaymentModal,
    getPatientByCardNumber,
    setPrintableCardPatient,
    setIsQrScannerOpen,
    handleQrScanInput,
  } = useHMS();

  // Search card state
  const [lookupCardNo, setLookupCardNo] = useState('');
  const [cardSearchResult, setCardSearchResult] = useState<any>(null);
  const [hasSearchedCard, setHasSearchedCard] = useState(false);

  // Appointment Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(staffList[0]?.id || '');
  const [department, setDepartment] = useState('General Practice');
  const [aptDate, setAptDate] = useState('2026-07-30');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [reason, setReason] = useState('Routine health checkup & blood test review');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Telebirr');

  const doctors = staffList.filter((s) => s.role === 'DOCTOR');

  const handleLookupCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCardNo.trim()) return;
    handleQrScanInput(lookupCardNo);
  };

  const handleInitiateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const doctorObj = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

    // Trigger Telebirr/Chapa payment modal first
    openPaymentModal({
      title: 'Appointment Booking Checkout',
      amount: 300,
      itemDescription: `Consultation with ${doctorObj.fullName}`,
      defaultMethod: paymentMethod,
      onSuccess: (method, ref) => {
        bookAppointment({
          patientName,
          patientPhone,
          doctorId: doctorObj.id,
          doctorName: doctorObj.fullName,
          department: doctorObj.department || department,
          date: aptDate,
          time: aptTime,
          reason,
          paymentAmount: 300,
          paymentMethod: method,
        });
        setShowBookingModal(false);
      },
    });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-700">
        {/* Glow Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Tenant Ethiopian Healthcare EMR Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Modern Healthcare Management for Ethiopian Hospitals
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Fast digital EMR cards, real-time lab diagnostic synchronization, automated e-prescriptions, and instant appointment payments powered by Telebirr and Chapa.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center space-x-2 transition text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>📅 Book Appointment Online</span>
            </button>

            <button
              onClick={() => setIsQrScannerOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 flex items-center space-x-2 transition text-sm border border-blue-500/30"
            >
              <QrCode className="w-4 h-4 text-blue-200" />
              <span>📱 Scan EMR QR Code</span>
            </button>

            <button
              onClick={() => setCurrentRole('RECEPTIONIST')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-600 flex items-center space-x-2 transition text-sm"
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>🏥 Hospital Staff Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Value Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mb-1 flex items-center space-x-1.5">
            <span>EMR Digital Cards</span>
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Instant digital cards with unique Ethiopian EMR IDs (<code className="font-mono bg-slate-100 px-1 rounded text-blue-700">ETH-CARD-XXXXX</code>), printable barcode/QR, and instant status tracking.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mb-1">Online Appointments</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Direct online consultation booking with on-duty specialist doctors with instant Telebirr & Chapa mobile fee settlement.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 border border-purple-100">
            <Microscope className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mb-1">Lab Diagnostics</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Electronic diagnostic orders for Widal, CBC, Malaria, and Chemistry tests with real-time result delivery to doctor panels.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
            <Pill className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mb-1">Pharmacy Sales</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Automated e-prescription dispensing, stock batch tracking, automated pricing, and instant SMS receipts for patients.
          </p>
        </div>
      </div>

      {/* Patient Digital Card Lookup & Status Tracker Box */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="max-w-2xl mb-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-600" />
            <span>Check Patient EMR Status & Digital Card</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Already registered? Enter your digital card number (e.g., <code className="font-mono bg-slate-100 px-1 text-emerald-700 font-bold">ETH-00102</code>) to check live status or print your ID card.
          </p>
        </div>

        <form onSubmit={handleLookupCard} className="flex flex-col sm:flex-row gap-3 max-w-xl mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={lookupCardNo}
              onChange={(e) => setLookupCardNo(e.target.value)}
              placeholder="e.g. ETH-00102"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
          >
            Track Status
          </button>
        </form>

        {hasSearchedCard && (
          <div className="mt-4">
            {cardSearchResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-slate-900 text-base">{cardSearchResult.fullName}</span>
                    <span className="font-mono text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">
                      {cardSearchResult.cardNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>Status: <strong className="text-emerald-800">{cardSearchResult.status}</strong></div>
                    <div>Assigned Doctor: <strong>{cardSearchResult.assignedDoctorName || 'General Practice'}</strong></div>
                    <div>Phone: <span className="font-mono">{cardSearchResult.phone}</span></div>
                  </div>
                </div>
                <button
                  onClick={() => setPrintableCardPatient(cardSearchResult)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Digital EMR Card</span>
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-medium">
                No patient found with Card ID "{lookupCardNo}". Try searching for <code className="font-mono font-bold">ETH-00102</code> or register at Reception Desk.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Available Doctor Directory */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">On-Duty Physicians & Specialists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  🩺
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.fullName}</h4>
                  <p className="text-xs text-emerald-600 font-medium">{doc.specialization}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{doc.department} • {doc.phone}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDoctorId(doc.id);
                  setShowBookingModal(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
          >
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Online Doctor Appointment Booking</span>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInitiateBooking} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Mulugeta Tesfaye"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (+251) *</label>
                <input
                  type="text"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+251 911 654 321"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Physician</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                  <input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Consultation</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Method (300 ETB Consultation Fee)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Telebirr', 'Chapa', 'Cash'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2.5 rounded-xl border font-bold text-xs transition ${
                        paymentMethod === m
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition"
                >
                  Proceed to {paymentMethod} Checkout (ETB 300)
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
