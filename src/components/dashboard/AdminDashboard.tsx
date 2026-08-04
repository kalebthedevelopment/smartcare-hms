import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { StaffManagementModal } from '../common/StaffManagementModal';
import { UserRole, StaffMember } from '../../types/hms';
import {
  Building2,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  Smartphone,
  ShieldCheck,
  Activity,
  UserCheck,
  UserPlus,
  Key,
  Search,
  Lock,
  Eye,
  CheckCircle2,
  Filter,
  Trash2,
  Plus,
  Minus,
  PlusCircle,
  Coins,
  FileSpreadsheet,
  Edit3,
  CalendarCheck,
  Microscope,
  Pill,
  SlidersHorizontal,
  QrCode,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    patients,
    appointments,
    labTests,
    prescriptions,
    staffList,
    medicineStock,
    updateStaffMember,
    deleteStaffMember,
    financialAdjustments,
    addFinancialAdjustment,
    deleteFinancialAdjustment,
  } = useHMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF'>('ADD_STAFF');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Financial adjustment form state
  const [showAdjForm, setShowAdjForm] = useState(false);
  const [adjTitle, setAdjTitle] = useState('');
  const [adjAmount, setAdjAmount] = useState<number | ''>('');
  const [adjType, setAdjType] = useState<'INCOME_ADD' | 'INCOME_DEDUCT'>('INCOME_ADD');
  const [adjCategory, setAdjCategory] = useState<'CONSULTATION_TARIFF' | 'CARD_TARIFF' | 'GOVT_SUBSIDY' | 'EXPENSE' | 'RECONCILIATION_CORRECTION' | 'OTHER'>('CONSULTATION_TARIFF');
  const [adjNote, setAdjNote] = useState('');

  // Financial calculations
  const cardFeesTotal = patients.reduce((s, p) => s + (p.cardFeePaid ? p.cardFeeAmount : 0), 0);
  const appointmentTotal = appointments.reduce((s, a) => s + (a.paymentPaid ? a.paymentAmount : 0), 0);
  const labTotal = labTests.filter((l) => l.status === 'DONE').reduce((s, l) => s + l.priceETB, 0);
  const pharmacyTotal = prescriptions.filter((p) => p.isDispensed).reduce((s, p) => s + p.totalAmountETB, 0);

  const grandTotalETB = cardFeesTotal + appointmentTotal + labTotal + pharmacyTotal;

  const totalAdditions = financialAdjustments
    .filter((a) => a.type === 'INCOME_ADD')
    .reduce((s, a) => s + a.amountETB, 0);

  const totalDeductions = financialAdjustments
    .filter((a) => a.type === 'INCOME_DEDUCT')
    .reduce((s, a) => s + a.amountETB, 0);

  const netAdjustedRevenueETB = grandTotalETB + totalAdditions - totalDeductions;

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjTitle || !adjAmount || Number(adjAmount) <= 0) {
      alert('Please enter a valid title and adjustment amount.');
      return;
    }

    addFinancialAdjustment({
      title: adjTitle,
      amountETB: Number(adjAmount),
      type: adjType,
      category: adjCategory,
      note: adjNote || 'Adjusted in Admin Analytics',
      createdBy: 'System Administrator',
    });

    setAdjTitle('');
    setAdjAmount('');
    setAdjNote('');
    setShowAdjForm(false);
  };

  // Stock valuation
  const inventoryValuationETB = medicineStock.reduce(
    (s, item) => s + item.stockLevel * item.unitPriceETB,
    0
  );

  // Filter staff list
  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.username && s.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Hospital Executive Analytics & Staff Control
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial reconciliation, staff password security, and clinical operational metrics across all hospital departments.
          </p>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Net Adjusted Hospital Income
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ETB {netAdjustedRevenueETB.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                (Gross: ETB {grandTotalETB.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdjForm(!showAdjForm)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition shrink-0"
            >
              <Coins className="w-4 h-4" />
              <span>💵 Adjust Money / Income</span>
            </button>

            <button
              onClick={() => {
                setStaffModalMode('ADD_STAFF');
                setShowStaffModal(true);
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md transition shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Staff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown KPI Cards - 2-Color Design (Slate + Emerald) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EMR Digital Cards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>EMR Digital Cards</span>
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                <QrCode className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ETB {cardFeesTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {patients.length} Digital Cards Issued
            </div>
          </div>

          <button
            onClick={() => {
              setAdjCategory('CARD_TARIFF');
              setAdjTitle('EMR Card Registration Fee Adjustment');
              setShowAdjForm(true);
            }}
            className="mt-4 w-full py-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-200 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust Card Fee</span>
          </button>
        </div>

        {/* Online Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Online Appointments</span>
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                <CalendarCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ETB {appointmentTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {appointments.length} Consultations Booked
            </div>
          </div>

          <button
            onClick={() => {
              setAdjCategory('CONSULTATION_TARIFF');
              setAdjTitle('Online Appointment Fee Adjustment');
              setShowAdjForm(true);
            }}
            className="mt-4 w-full py-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-200 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust Appointment Pay</span>
          </button>
        </div>

        {/* Lab Diagnostics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                <Microscope className="w-4 h-4 text-emerald-600" />
                <span>Lab Diagnostics</span>
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                <Microscope className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ETB {labTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {labTests.filter((l) => l.status === 'DONE').length} Completed Tests
            </div>
          </div>

          <button
            onClick={() => {
              setAdjCategory('RECONCILIATION_CORRECTION');
              setAdjTitle('Lab Diagnostics Tariff Adjustment');
              setShowAdjForm(true);
            }}
            className="mt-4 w-full py-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-200 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust Lab Fee</span>
          </button>
        </div>

        {/* Pharmacy Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Pharmacy Sales</span>
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                <Pill className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ETB {pharmacyTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {prescriptions.filter((p) => p.isDispensed).length} Prescriptions Dispensed
            </div>
          </div>

          <button
            onClick={() => {
              setAdjCategory('OTHER');
              setAdjTitle('Pharmacy Drug Sales Price Adjustment');
              setShowAdjForm(true);
            }}
            className="mt-4 w-full py-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-200 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust Pharmacy Pricing</span>
          </button>
        </div>
      </div>

      {/* Admin Executive Income & Financial Tariff Adjustment Panel */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Coins className="w-6 h-6 text-emerald-400" />
              <h2 className="text-lg font-black tracking-tight">
                Admin Analytics Income & Money Adjustment Control
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Directly adjust hospital revenue, record subsidy injections, update fee tariffs, or apply financial corrections into Admin Executive Analytics.
            </p>
          </div>

          <button
            onClick={() => setShowAdjForm(!showAdjForm)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl flex items-center space-x-2 shadow-lg transition shrink-0"
          >
            {showAdjForm ? <Minus className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{showAdjForm ? 'Close Adjustment Form' : '➕ Add Income / Tariff Adjustment'}</span>
          </button>
        </div>

        {/* Financial Adjustment Creation Form */}
        {showAdjForm && (
          <form
            onSubmit={handleCreateAdjustment}
            className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-slate-800 pb-2">
              <span className="flex items-center space-x-1.5">
                <Edit3 className="w-4 h-4" />
                <span>Create New Money / Income Adjustment Record</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Admin Authorization Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Adjustment Title</label>
                <input
                  type="text"
                  required
                  value={adjTitle}
                  onChange={(e) => setAdjTitle(e.target.value)}
                  placeholder="e.g. Consultation Fee Tariff Update"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Amount (ETB)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 5000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Type of Money Impact</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                >
                  <option value="INCOME_ADD">➕ Add Income (+) to Total Revenue</option>
                  <option value="INCOME_DEDUCT">➖ Deduct Expense (-) from Total Revenue</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Financial Category</label>
                <select
                  value={adjCategory}
                  onChange={(e) => setAdjCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                >
                  <option value="CONSULTATION_TARIFF">Doctor Consultation Tariff</option>
                  <option value="CARD_TARIFF">EMR Card Fee Tariff</option>
                  <option value="GOVT_SUBSIDY">Govt Ministry Subsidy Grant</option>
                  <option value="EXPENSE">Hospital Operational Expense</option>
                  <option value="RECONCILIATION_CORRECTION">Reconciliation Correction</option>
                  <option value="OTHER">Other Income Source</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Notes / Reason for Money Adjustment</label>
              <input
                type="text"
                value={adjNote}
                onChange={(e) => setAdjNote(e.target.value)}
                placeholder="Optional notes e.g. Executive directive for Q3 regional tariff adjustment"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-md hover:brightness-110 transition flex items-center space-x-1.5"
              >
                <span>Save Adjustment Record</span>
              </button>
            </div>
          </form>
        )}

        {/* Financial Adjustments Summary Table / Cards */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-extrabold text-slate-200 flex items-center space-x-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Active Revenue Adjustments & Tariff Overrides ({financialAdjustments.length})</span>
            </span>

            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span className="text-emerald-400 font-bold">Total Added: +ETB {totalAdditions.toLocaleString()}</span>
              <span className="text-red-400 font-bold">Total Deducted: -ETB {totalDeductions.toLocaleString()}</span>
            </div>
          </div>

          {financialAdjustments.length === 0 ? (
            <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-500">
              No financial adjustments recorded yet. Click "Add Income / Tariff Adjustment" to adjust hospital revenue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {financialAdjustments.map((adj) => (
                <div
                  key={adj.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between space-x-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`p-1.5 rounded-lg text-xs font-extrabold ${
                          adj.type === 'INCOME_ADD'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {adj.type === 'INCOME_ADD' ? '➕ ADD' : '➖ DEDUCT'}
                      </span>
                      <span className="font-extrabold text-white text-xs">{adj.title}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono">
                      Category: <span className="text-slate-300 font-bold">{adj.category}</span> • Note: {adj.note}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      Added on {new Date(adj.date).toLocaleDateString()} by {adj.createdBy}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div
                      className={`text-sm font-black font-mono ${
                        adj.type === 'INCOME_ADD' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {adj.type === 'INCOME_ADD' ? '+' : '-'}ETB {adj.amountETB.toLocaleString()}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete adjustment record "${adj.title}"?`)) {
                          deleteFinancialAdjustment(adj.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
                      title="Delete Financial Adjustment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Staff Worker Management Control Center */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>👥 Hospital Staff Directory & Security Credentials</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new workers, assign avatars/icons, manage passwords, and toggle duty status.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setStaffModalMode('ADD_STAFF');
                setShowStaffModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>

            <button
              onClick={() => {
                setStaffModalMode('CHANGE_PASSWORD');
                setShowStaffModal(true);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition"
            >
              <Key className="w-4 h-4" />
              <span>Set Password</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, email, or phone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="font-bold text-slate-600 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['ALL', 'DOCTOR', 'RECEPTIONIST', 'LAB_TECH', 'PHARMACIST', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] whitespace-nowrap ${
                  roleFilter === r
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Worker Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {s.avatar || '👤'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{s.fullName}</h3>
                      <div className="text-[11px] text-slate-500">{s.specialization || s.department}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.email}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      s.status === 'On Duty'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Role Tag:</span>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {s.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Phone:</span>
                    <span className="font-mono font-semibold text-slate-800">{s.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Security Password:</span>
                    <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      {s.password ? '••••••••' : 'Default Set'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/80">
                <button
                  onClick={() => {
                    setSelectedStaff(s);
                    setStaffModalMode('CHANGE_PASSWORD');
                    setShowStaffModal(true);
                  }}
                  className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-[11px] flex items-center justify-center space-x-1 transition"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pass</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Permanently delete staff member ${s.fullName} (${s.role})?`)) {
                      deleteStaffMember(s.id);
                    }
                  }}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition"
                  title="Delete Staff Member Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    const nextStatus = s.status === 'On Duty' ? 'Off Duty' : 'On Duty';
                    updateStaffMember(s.id, { status: nextStatus });
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-[11px] transition"
                >
                  Toggle Duty
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory & Telebirr Sync Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Building2 className="w-5 h-5 text-slate-700" />
          <span>📦 Pharmacy Stock Valuation</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400">Total Asset Valuation</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              ETB {inventoryValuationETB.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Across {medicineStock.length} Pharmaceutical Stock Items
            </div>
          </div>

          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2 text-xs text-blue-900 flex flex-col justify-center">
            <div className="font-bold flex items-center space-x-2 text-sm">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Telebirr & Chapa Payment Gateway Status</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Automated Ethio Telecom API webhooks are actively reconciling digital payments every 30 seconds. All Telebirr USSD prompts are verified.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Management Modal Instance */}
      <StaffManagementModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        initialMode={staffModalMode}
        selectedStaffForPassword={selectedStaff}
      />
    </div>
  );
};

