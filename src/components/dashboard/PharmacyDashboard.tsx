import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { PaymentMethod } from '../../types/hms';
import { StaffManagementModal } from '../common/StaffManagementModal';
import {
  Pill,
  Package,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  DollarSign,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { motion } from 'motion/react';

export const PharmacyDashboard: React.FC = () => {
  const {
    prescriptions,
    medicineStock,
    dispenseMedication,
    addStockShipment,
    openPaymentModal,
    currentStaff,
  } = useHMS();

  const [showStaffModal, setShowStaffModal] = useState(false);

  // Stock shipment modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [shipMedName, setShipMedName] = useState('Ciprofloxacin 500mg');
  const [shipCategory, setShipCategory] = useState('Antibiotics');
  const [shipQty, setShipQty] = useState(200);
  const [shipUnit, setShipUnit] = useState('Tabs');
  const [shipReorder, setShipReorder] = useState(50);
  const [shipPrice, setShipPrice] = useState(15);
  const [shipBatch, setShipBatch] = useState('CIP-2026-99');
  const [shipExpiry, setShipExpiry] = useState('2028-06-30');
  const [shipLocation, setShipLocation] = useState('Shelf A-4');

  // Search filter for stock
  const [stockSearch, setStockSearch] = useState('');

  const pendingRx = prescriptions.filter((p) => !p.isDispensed);
  const dispensedRx = prescriptions.filter((p) => p.isDispensed);
  const lowStockItems = medicineStock.filter((s) => s.stockLevel <= s.reorderPoint);

  const handleDispenseClick = (rxId: string, totalAmount: number, patientName: string) => {
    openPaymentModal({
      title: 'Prescription Payment Reconciliation',
      amount: totalAmount,
      patientName,
      itemDescription: 'Dispensed Pharmaceutical Prescription',
      defaultMethod: 'Telebirr',
      onSuccess: (method) => {
        dispenseMedication(rxId, method);
      },
    });
  };

  const handleAddShipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipMedName || shipQty <= 0) return;

    addStockShipment({
      medicineName: shipMedName,
      category: shipCategory,
      quantityToAdd: shipQty,
      unit: shipUnit,
      reorderPoint: shipReorder,
      unitPriceETB: shipPrice,
      batchNumber: shipBatch,
      expiryDate: shipExpiry,
      location: shipLocation,
    });

    setShowStockModal(false);
  };

  const filteredStock = medicineStock.filter((s) =>
    s.medicineName.toLowerCase().includes(stockSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-md shrink-0">
            {currentStaff?.avatar || '💊'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {currentStaff?.fullName || 'Rahel Girma'}
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
                Chief Pharmacist
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispense e-prescriptions, track real-time drug stock levels, and collect payments.
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

          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center">
            <span className="text-amber-800 font-medium block text-[10px]">Low Stock Alerts</span>
            <span className="text-base font-black text-amber-900 font-mono">{lowStockItems.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
            <span className="text-emerald-700 font-medium block text-[10px]">Pending Prescriptions</span>
            <span className="text-base font-black text-emerald-900 font-mono">{pendingRx.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Prescriptions (6 cols), Right Inventory Table (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Prescriptions Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>📦 Pending Electronic Prescriptions ({pendingRx.length})</span>
              </h2>
            </div>

            {pendingRx.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                🎉 All prescriptions have been dispensed!
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRx.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{rx.patientName}</div>
                        <div className="text-xs text-slate-500">
                          Prescribed By: <strong>{rx.doctorName}</strong>
                        </div>
                      </div>
                      <span className="font-mono text-xs bg-slate-900 text-emerald-400 px-2.5 py-1 rounded font-bold">
                        {rx.patientCardNumber}
                      </span>
                    </div>

                    {/* Drug Items */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      {rx.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                          <div>
                            <span className="font-bold text-slate-800">{i.medicineName}</span>
                            <span className="text-slate-500 ml-2">({i.dosage} • {i.frequency} • {i.duration})</span>
                          </div>
                          <span className="font-mono font-bold text-slate-700">x{i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Payment & Dispense Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Total Price</span>
                        <span className="font-mono text-base font-extrabold text-emerald-700">
                          ETB {rx.totalAmountETB}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDispenseClick(rx.id, rx.totalAmountETB, rx.patientName)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center space-x-1 transition"
                      >
                        <Pill className="w-4 h-4" />
                        <span>📦 Dispense Medication & Collect Fee</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Medicine Stock Levels & Restock */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Pill className="w-5 h-5 text-amber-600" />
                <span>📊 Pharmacy Medicine Stock Inventory</span>
              </h2>

              <button
                onClick={() => setShowStockModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stock Shipment</span>
              </button>
            </div>

            {/* Stock Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                placeholder="Search inventory drugs..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Stock Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Medicine</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Stock Level</th>
                    <th className="p-3">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredStock.map((s) => {
                    const isLow = s.stockLevel <= s.reorderPoint;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{s.medicineName}</div>
                          <div className="text-[10px] text-slate-400">Loc: {s.location} • Batch: {s.batchNumber}</div>
                        </td>
                        <td className="p-3 text-slate-600">{s.category}</td>
                        <td className="p-3 font-mono">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center space-x-1 ${
                              isLow
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            <span>
                              {s.stockLevel} {s.unit}
                            </span>
                            {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-700 ml-1" />}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          ETB {s.unitPriceETB}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Stock Shipment Modal */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
          >
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <span className="font-bold text-sm">➕ Add Medicine Stock Shipment</span>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddShipmentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={shipMedName}
                  onChange={(e) => setShipMedName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={shipCategory}
                    onChange={(e) => setShipCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity to Add *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={shipQty}
                    onChange={(e) => setShipQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Price (ETB)</label>
                  <input
                    type="number"
                    value={shipPrice}
                    onChange={(e) => setShipPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reorder Limit</label>
                  <input
                    type="number"
                    value={shipReorder}
                    onChange={(e) => setShipReorder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={shipLocation}
                    onChange={(e) => setShipLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Add Inventory Shipment
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Staff Security Modal */}
      <StaffManagementModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        initialMode="CHANGE_PASSWORD"
      />
    </div>
  );
};
