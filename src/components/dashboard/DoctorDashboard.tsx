import React, { useState, useEffect } from 'react';
import { useHMS } from '../../context/HMSContext';
import { Patient, Vitals, PrescriptionItem } from '../../types/hms';
import { StaffManagementModal } from '../common/StaffManagementModal';
import {
  Stethoscope,
  Search,
  FlaskConical,
  Pill,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  Activity,
  User,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Key,
  ShieldCheck,
  UserCheck,
  QrCode,
} from 'lucide-react';
import { motion } from 'motion/react';

export const DoctorDashboard: React.FC = () => {
  const {
    patients,
    medicalRecords,
    labTests,
    medicineStock,
    createMedicalRecord,
    getPatientByCardNumber,
    currentStaff,
    setIsQrScannerOpen,
    printableCardPatient,
  } = useHMS();

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF'>('CHANGE_PASSWORD');

  // Active Selected Patient State
  const [searchCardInput, setSearchCardInput] = useState('ETH-00102');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(() => {
    return patients.find((p) => p.cardNumber === 'ETH-00102') || patients[0] || null;
  });

  // Automatically switch selected patient when QR code is scanned or printable card is opened
  useEffect(() => {
    if (printableCardPatient) {
      setSelectedPatient(printableCardPatient);
      setSearchCardInput(printableCardPatient.cardNumber);
    }
  }, [printableCardPatient]);

  // Clinical Vitals Form
  const [vitals, setVitals] = useState<Vitals>({
    bp: '130/85',
    temp: 38.8,
    pulse: 94,
    weight: 68,
    spo2: 97,
  });

  const [symptoms, setSymptoms] = useState('High fever for 3 days, chills, joint fatigue, headache and mild nausea.');
  const [diagnosis, setDiagnosis] = useState('Suspected Typhoid / Malaria fever.');
  const [doctorNotes, setDoctorNotes] = useState('Patient presented with acute febrile illness. Ordered Widal & Malaria blood film.');

  // Lab Test Requisition Checklist with adjustable prices
  const [labTestPrices, setLabTestPrices] = useState<Record<string, number>>({
    'Widal Serology Test (Typhoid)': 350,
    'Malaria Blood Film (BS for MPS)': 250,
    'Complete Blood Count (CBC)': 400,
    'Fasting Blood Sugar (FBS)': 180,
    'Urinalysis (Routine)': 150,
    'Stool Examination': 150,
    'Liver Function Test (LFT)': 550,
    'Lipid Profile (Cholesterol)': 480,
  });

  const [availableLabTests, setAvailableLabTests] = useState([
    { name: 'Widal Serology Test (Typhoid)', category: 'Serology' },
    { name: 'Malaria Blood Film (BS for MPS)', category: 'Parasitology' },
    { name: 'Complete Blood Count (CBC)', category: 'Hematology' },
    { name: 'Fasting Blood Sugar (FBS)', category: 'Biochemistry' },
    { name: 'Urinalysis (Routine)', category: 'Microbiology' },
    { name: 'Stool Examination', category: 'Parasitology' },
    { name: 'Liver Function Test (LFT)', category: 'Biochemistry' },
    { name: 'Lipid Profile (Cholesterol)', category: 'Biochemistry' },
  ]);

  const [selectedLabs, setSelectedLabs] = useState<string[]>([
    'Widal Serology Test (Typhoid)',
    'Malaria Blood Film (BS for MPS)',
  ]);

  // Custom Lab Test Input
  const [customTestName, setCustomTestName] = useState('');
  const [customTestCategory, setCustomTestCategory] = useState('General');
  const [customTestPrice, setCustomTestPrice] = useState<number>(300);

  // E-Prescription Items
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicineName: 'Ciprofloxacin 500mg',
      dosage: '500mg',
      frequency: 'BID (Twice Daily)',
      duration: '7 Days',
      quantity: 14,
      unitPriceETB: 15,
      totalPriceETB: 210,
    },
  ]);

  // Rx Mode: 'INVENTORY' or 'CUSTOM'
  const [rxInputMode, setRxInputMode] = useState<'INVENTORY' | 'CUSTOM'>('INVENTORY');
  const [newMedName, setNewMedName] = useState(medicineStock[0]?.medicineName || 'Amoxicillin 500mg');
  const [customMedName, setCustomMedName] = useState('');
  const [customUnitPrice, setCustomUnitPrice] = useState<number>(15);
  const [newDosage, setNewDosage] = useState('500mg');
  const [newFreq, setNewFreq] = useState('TID (3x Daily)');
  const [newDuration, setNewDuration] = useState('5 Days');
  const [newQty, setNewQty] = useState(15);

  const handlePatientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCardInput.trim()) return;
    const found = getPatientByCardNumber(searchCardInput);
    if (found) {
      setSelectedPatient(found);
    }
  };

  const handleAddPrescriptionItem = () => {
    let finalMedName = '';
    let unitPrice = 0;

    if (rxInputMode === 'CUSTOM') {
      if (!customMedName.trim()) return;
      finalMedName = customMedName.trim();
      unitPrice = Number(customUnitPrice) || 0;
    } else {
      finalMedName = newMedName;
      const stockItem = medicineStock.find(
        (m) => m.medicineName.toLowerCase() === newMedName.toLowerCase()
      );
      unitPrice = stockItem ? stockItem.unitPriceETB : 12;
    }

    const totalPrice = unitPrice * newQty;

    const newItem: PrescriptionItem = {
      medicineName: finalMedName,
      dosage: newDosage,
      frequency: newFreq,
      duration: newDuration,
      quantity: newQty,
      unitPriceETB: unitPrice,
      totalPriceETB: totalPrice,
    };

    setPrescriptions((prev) => [...prev, newItem]);
    if (rxInputMode === 'CUSTOM') {
      setCustomMedName('');
    }
  };

  const handleRemovePrescriptionItem = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleToggleLab = (testName: string) => {
    setSelectedLabs((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    );
  };

  const handleLabPriceChange = (testName: string, price: number) => {
    setLabTestPrices((prev) => ({
      ...prev,
      [testName]: Math.max(0, price),
    }));
  };

  const handleAddCustomLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestName.trim()) return;
    const testName = customTestName.trim();

    if (!availableLabTests.some((t) => t.name.toLowerCase() === testName.toLowerCase())) {
      setAvailableLabTests((prev) => [
        ...prev,
        { name: testName, category: customTestCategory || 'General Diagnostic' },
      ]);
    }

    setLabTestPrices((prev) => ({
      ...prev,
      [testName]: Number(customTestPrice) || 250,
    }));

    if (!selectedLabs.includes(testName)) {
      setSelectedLabs((prev) => [...prev, testName]);
    }

    setCustomTestName('');
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const labOrders = selectedLabs.map((name) => {
      const found = availableLabTests.find((t) => t.name === name);
      const configuredPrice = labTestPrices[name] !== undefined ? labTestPrices[name] : 250;
      return {
        testName: name,
        category: found ? found.category : 'General Diagnostic',
        priceETB: configuredPrice,
      };
    });

    createMedicalRecord({
      patientId: selectedPatient.id,
      patientCardNumber: selectedPatient.cardNumber,
      patientName: selectedPatient.fullName,
      doctorId: 'doc-1',
      doctorName: 'Dr. Yonas Tadesse',
      vitals,
      symptoms,
      diagnosis,
      doctorNotes,
      labTestsToOrder: labOrders,
      prescriptionItems: prescriptions,
    });
  };

  // Filter EMR history for selected patient
  const patientHistory = selectedPatient
    ? medicalRecords.filter((m) => m.patientId === selectedPatient.id)
    : [];

  // Live Lab Results for selected patient
  const patientLabResults = selectedPatient
    ? labTests.filter((l) => l.patientId === selectedPatient.id)
    : [];

  const queuePatients = patients.filter(
    (p) => p.status === 'Queued for Doctor' || p.status === 'Lab Completed'
  );

  return (
    <div className="space-y-6">
      {/* Top Doctor Hub Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-md shrink-0">
            {currentStaff?.avatar || '👨‍⚕️'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {currentStaff?.fullName || 'Dr. Yonas Tadesse'}
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
                {currentStaff?.specialization || 'General Practice'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              EMR Diagnostics Hub • Review patient histories, order lab tests, and write e-prescriptions.
            </p>
          </div>
        </div>

        {/* Patient Queue Switcher & Staff Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setModalMode('CHANGE_PASSWORD');
              setShowStaffModal(true);
            }}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Change Password</span>
          </button>

          <form onSubmit={handlePatientSearch} className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={searchCardInput}
                onChange={(e) => setSearchCardInput(e.target.value)}
                placeholder="ETH-00102"
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold w-32 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-sm"
              title="Scan Patient EMR Digital Card QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
          </form>

          <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800">
            Active Queue: {queuePatients.length}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Patient Banner + EMR History (4 cols), Right Consultation Form (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Patient Overview & EMR History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Patient Card */}
          {selectedPatient ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedPatient.cardNumber}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedPatient.status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">{selectedPatient.fullName}</h3>
                <p className="text-xs text-slate-300">
                  {selectedPatient.age} Yrs • {selectedPatient.gender} • Blood: <strong className="text-emerald-400">{selectedPatient.bloodType || 'O+'}</strong>
                </p>
                <p className="text-xs text-slate-400 font-mono">Phone: {selectedPatient.phone}</p>
                <p className="text-[11px] text-slate-400">Emergency: {selectedPatient.emergencyContact}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No patient selected.
            </div>
          )}

          {/* Patient Active Consultation Queue Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Waiting Patients Queue</span>
              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                {queuePatients.length}
              </span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {queuePatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p);
                    setSearchCardInput(p.cardNumber);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedPatient?.id === p.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-bold">{p.fullName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{p.cardNumber}</div>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Lab Test Results Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>🧪 Lab Results (Real-time Feed)</span>
            </h4>

            {patientLabResults.length === 0 ? (
              <p className="text-xs text-slate-400">No lab requisitions found for this patient.</p>
            ) : (
              <div className="space-y-2">
                {patientLabResults.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{l.testName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          l.status === 'DONE'
                            ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>

                    {l.results ? (
                      <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-800 font-semibold">
                        Result: {l.results}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        Pending lab technician analysis...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Doctor Consultation Form & Order Writer */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmitConsultation} className="space-y-6">
            {/* Vitals Input Strip */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Patient Vital Signs</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temp}
                    onChange={(e) => setVitals({ ...vitals, temp: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-center font-bold text-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={vitals.pulse}
                    onChange={(e) => setVitals({ ...vitals, pulse: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-center font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Diagnosis Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">🩺 Clinical Symptoms & Diagnosis</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chief Symptoms & Presentation</label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Differential Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Physician Notes & Directives</label>
                  <textarea
                    rows={2}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Laboratory Requisitions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <FlaskConical className="w-4 h-4 text-purple-600" />
                  <span>🧪 Order Laboratory Diagnostic Tests</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-purple-900 font-extrabold bg-purple-100 border border-purple-300 px-2.5 py-1 rounded-lg font-mono">
                    Total Lab Fee: ETB {selectedLabs.reduce((sum, name) => sum + (labTestPrices[name] ?? 250), 0)}
                  </span>
                  <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-1 rounded-lg">
                    {selectedLabs.length} Selected
                  </span>
                </div>
              </div>

              {/* Lab Tests Grid with Fee Adjuster */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {availableLabTests.map((t) => {
                  const isChecked = selectedLabs.includes(t.name);
                  const currentPrice = labTestPrices[t.name] ?? 250;
                  return (
                    <div
                      key={t.name}
                      className={`p-3 rounded-xl border transition space-y-2 ${
                        isChecked
                          ? 'bg-purple-50/80 border-purple-400 text-purple-950 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleLab(t.name)}
                            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="text-xs">{t.name}</span>
                        </label>
                        <span className="text-[10px] text-purple-700 font-mono bg-purple-100/60 px-1.5 py-0.5 rounded">
                          {t.category}
                        </span>
                      </div>

                      {/* Fee Money Adjustment Input */}
                      <div className="flex items-center justify-between pt-1 border-t border-purple-200/50">
                        <span className="text-[11px] font-semibold text-slate-600">
                          Money / Fee to Pay:
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-[11px] font-mono text-slate-500">ETB</span>
                          <input
                            type="number"
                            min="0"
                            value={currentPrice}
                            onChange={(e) => handleLabPriceChange(t.name, Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-20 bg-white border border-purple-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-purple-900 text-right focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                            title="Adjust fee for this diagnostic lab test"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Diagnostic Lab Test Row */}
              <div className="pt-2 border-t border-slate-200">
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-200 space-y-2">
                  <span className="text-[11px] font-extrabold text-purple-900 block uppercase tracking-wider">
                    ✍️ Write & Order Custom Laboratory Test
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Custom test name (e.g. Thyroid Panel, Blood Typing, GeneXpert...)"
                      value={customTestName}
                      onChange={(e) => setCustomTestName(e.target.value)}
                      className="sm:col-span-5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Category (e.g. Serology, PCR)"
                      value={customTestCategory}
                      onChange={(e) => setCustomTestCategory(e.target.value)}
                      className="sm:col-span-3 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="sm:col-span-2 flex items-center space-x-1">
                      <span className="text-[10px] text-slate-500 font-mono">ETB</span>
                      <input
                        type="number"
                        placeholder="Fee"
                        value={customTestPrice}
                        onChange={(e) => setCustomTestPrice(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-purple-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomLabTest}
                      className="sm:col-span-2 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center space-x-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Test</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* E-Prescription Writer */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>💊 E-Prescription Items</span>
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Total Billable: ETB {prescriptions.reduce((s, i) => s + i.totalPriceETB, 0)}
                </span>
              </div>

              {/* Added Rx List */}
              <div className="space-y-2">
                {prescriptions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{item.medicineName}</span>
                      <div className="text-[11px] text-slate-500">
                        Dosage: <strong>{item.dosage}</strong> • Freq: <strong>{item.frequency}</strong> • Duration: {item.duration} (Qty: {item.quantity})
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-emerald-700">
                        ETB {item.totalPriceETB} ({item.unitPriceETB} / unit)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrescriptionItem(idx)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Prescription Box */}
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Add Medicine From Pharmacy Inventory or Write Manually
                  </span>

                  {/* Mode Selector Toggle */}
                  <div className="flex items-center space-x-1 bg-slate-200 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRxInputMode('INVENTORY')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        rxInputMode === 'INVENTORY'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📦 Central Inventory Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setRxInputMode('CUSTOM')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        rxInputMode === 'CUSTOM'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ✍️ Write Custom Drug Name
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                  {/* Medication Name Input / Dropdown */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                      Medication Name {rxInputMode === 'CUSTOM' ? '(Write by yourself)' : '(From Stock)'}
                    </label>
                    {rxInputMode === 'INVENTORY' ? (
                      <select
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                      >
                        {medicineStock.map((m) => (
                          <option key={m.id} value={m.medicineName}>
                            {m.medicineName} (Stock: {m.stockLevel})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Type medication name manually..."
                        value={customMedName}
                        onChange={(e) => setCustomMedName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Unit Price Input if Custom */}
                  {rxInputMode === 'CUSTOM' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Unit Price (ETB)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={customUnitPrice}
                        onChange={(e) => setCustomUnitPrice(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono font-bold text-emerald-800"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Dosage</label>
                    <input
                      type="text"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Frequency</label>
                    <input
                      type="text"
                      value={newFreq}
                      onChange={(e) => setNewFreq(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={newQty}
                      onChange={(e) => setNewQty(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-mono text-slate-600">
                    Est. Item Total: <strong className="text-emerald-700">ETB {((rxInputMode === 'CUSTOM' ? customUnitPrice : (medicineStock.find((m) => m.medicineName === newMedName)?.unitPriceETB || 12)) * newQty).toFixed(0)}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPrescriptionItem}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Drug Item</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Broadcast Consultation Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center space-x-2 transition text-base"
            >
              <Send className="w-5 h-5" />
              <span>📤 Transmit Requisitions to Lab & Pharmacy Portals</span>
            </button>
          </form>
        </div>
      </div>

      {/* Staff Security Modal */}
      <StaffManagementModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        initialMode={modalMode}
      />
    </div>
  );
};
