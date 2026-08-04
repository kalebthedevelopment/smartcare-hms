import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { PaymentMethod, Gender } from '../../types/hms';
import { StaffManagementModal } from '../common/StaffManagementModal';
import {
  UserPlus,
  CreditCard,
  Printer,
  Search,
  CheckCircle,
  Users,
  Stethoscope,
  Smartphone,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  Key,
  Trash2,
  Lock,
  User,
  Phone,
  Calendar,
  Droplet,
  Coins,
  SlidersHorizontal,
  QrCode,
  Sparkles,
} from 'lucide-react';

export const ReceptionDashboard: React.FC = () => {
  const {
    patients,
    registerPatient,
    deletePatient,
    verifyAdminPassword,
    currentRole,
    staffList,
    currentStaff,
    setPrintableCardPatient,
    openPaymentModal,
    updatePatientStatus,
    setIsQrScannerOpen,
  } = useHMS();

  const [showStaffModal, setShowStaffModal] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 911 405 921');
  const [age, setAge] = useState<number | ''>(28);
  const [gender, setGender] = useState<Gender>('Male');
  const [bloodType, setBloodType] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('+251 911 999 001');
  const [assignedDoctorId, setAssignedDoctorId] = useState(staffList[0]?.id || '');
  const [cardFee, setCardFee] = useState<number>(200);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Telebirr');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const doctors = staffList.filter((s) => s.role === 'DOCTOR');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !age) return;

    const docObj = doctors.find((d) => d.id === assignedDoctorId) || doctors[0];

    // Trigger Digital Payment Modal
    openPaymentModal({
      title: 'Digital EMR Card Fee Checkout',
      amount: cardFee,
      patientName: fullName,
      itemDescription: 'Standard EMR Digital Registration Card',
      defaultMethod: paymentMethod,
      onSuccess: (method) => {
        const newPatient = registerPatient({
          fullName,
          phone,
          age: Number(age),
          gender,
          bloodType,
          emergencyContact,
          assignedDoctorId: docObj.id,
          assignedDoctorName: docObj.fullName,
          cardFeeAmount: cardFee,
          paymentMethod: method,
        });

        // Auto open printable card modal!
        setPrintableCardPatient(newPatient);

        // Reset Form
        setFullName('');
      },
    });
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'ALL' ||
      p.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-md shrink-0">
            {currentStaff?.avatar || '👩‍💼'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {currentStaff?.fullName || 'Selam Haile'}
              </h1>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded font-mono">
                Reception Desk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Register incoming patients, generate digital EMR cards, and manage doctor consultation queues.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold flex items-center space-x-1.5 transition shadow-sm border border-emerald-500/30"
            title="Scan Patient EMR Card QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setShowStaffModal(true)}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold flex items-center space-x-1.5 transition"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Change Password</span>
          </button>

          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-500 font-medium block text-[10px]">Total Registered</span>
            <span className="text-base font-black text-slate-900 font-mono">{patients.length}</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
            <span className="text-emerald-700 font-medium block text-[10px]">Active Queue</span>
            <span className="text-base font-black text-emerald-800 font-mono">
              {patients.filter((p) => p.status === 'Queued for Doctor').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Register New Patient Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-base text-slate-900">📝 Register Patient / Groom Intake</h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setFullName('Solomon Hailemariam');
                setPhone('+251 912 345 678');
                setAge(32);
                setGender('Male');
                setBloodType('A+');
                setEmergencyContact('+251 911 888 777');
                setCardFee(200);
              }}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition"
              title="Auto-fill sample groom/patient intake data"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample Groom Input</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abebe Bikila"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Phone Number (+251) *</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 911 405 921"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Age *</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sex</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  <option value="Male">Male ♂</option>
                  <option value="Female">Female ♀</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Droplet className="w-3.5 h-3.5 text-red-500" />
                  <span>Blood</span>
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Emergency Contact Phone</span>
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+251 911 999 001 (Relative)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assign On-Duty Physician</span>
              </label>
              <select
                value={assignedDoctorId}
                onChange={(e) => setAssignedDoctorId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fullName} — {doc.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Card Registration Pay Fee & Tariff Adjustment */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-800 pb-2.5">
                <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Card Registration Pay Fee:</span>
                </span>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-400">ETB</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={cardFee}
                    onChange={(e) => setCardFee(Number(e.target.value) || 0)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-black font-mono text-right focus:border-emerald-500 outline-none"
                  />
                  <div className="flex items-center space-x-1">
                    {[150, 200, 250].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCardFee(preset)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                          cardFee === preset
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payment Method</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Telebirr', 'Chapa', 'Cash'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition ${
                        paymentMethod === method
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 transition text-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Create EMR Digital Card & Print</span>
            </button>
          </form>
        </div>

        {/* Right Column: Today's Patient Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-slate-700" />
              <h2 className="font-extrabold text-base text-slate-900">
                🔍 Patient Queue & Directory ({filteredPatients.length})
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 text-xs">
              {['ALL', 'Queued', 'Lab', 'Pharmacy', 'Completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${
                    statusFilter === f
                      ? 'bg-slate-900 border-slate-900 text-white font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Search Table Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Queue by Name, Card # (ETH-00102)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Patient Queue Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Card No</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No patients found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <span className="font-mono bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-bold text-[11px]">
                          {pat.cardNumber}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{pat.fullName}</div>
                        <div className="text-[10px] text-slate-400">{pat.age}Y / {pat.gender}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{pat.phone}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            pat.status === 'Queued for Doctor'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : pat.status === 'Lab Order Pending'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : pat.status === 'Pharmacy Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {pat.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              if (currentRole === 'ADMIN') {
                                if (confirm(`Delete patient record for ${pat.fullName}?`)) {
                                  deletePatient(pat.id);
                                }
                              } else {
                                const pass = prompt(`Admin authorization required to delete patient ${pat.fullName}.\nEnter Admin Password:`);
                                if (pass && verifyAdminPassword(pass)) {
                                  deletePatient(pat.id);
                                } else if (pass !== null) {
                                  alert('Incorrect Admin Password! Delete action cancelled.');
                                }
                              }
                            }}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setPrintableCardPatient(pat)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition flex items-center space-x-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Card</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Staff Management Modal */}
      <StaffManagementModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        initialMode="CHANGE_PASSWORD"
      />
    </div>
  );
};
