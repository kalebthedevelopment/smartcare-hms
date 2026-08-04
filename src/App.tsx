import React from 'react';
import { HMSProvider, useHMS } from './context/HMSContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { PrintableCardModal } from './components/common/PrintableCardModal';
import { PaymentModal } from './components/common/PaymentModal';
import { QRScannerModal } from './components/common/QRScannerModal';
import { ReceptionDashboard } from './components/dashboard/ReceptionDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { LabDashboard } from './components/dashboard/LabDashboard';
import { PharmacyDashboard } from './components/dashboard/PharmacyDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PublicPortal } from './components/public/PublicPortal';

const DashboardContent: React.FC = () => {
  const { currentRole } = useHMS();

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 overflow-y-auto">
      {currentRole === 'RECEPTIONIST' && <ReceptionDashboard />}
      {currentRole === 'DOCTOR' && <DoctorDashboard />}
      {currentRole === 'LAB_TECH' && <LabDashboard />}
      {currentRole === 'PHARMACIST' && <PharmacyDashboard />}
      {currentRole === 'ADMIN' && <AdminDashboard />}
      {currentRole === 'PUBLIC' && <PublicPortal />}
    </main>
  );
};

const MainLayout: React.FC = () => {
  const { isAuthenticated, handleQrScanInput, isSidebarVisible } = useHMS();

  // Check URL query parameters for QR code scan links (e.g. ?patientCard=ETH-00102)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scannedCard = params.get('patientCard');
    if (scannedCard) {
      handleQrScanInput(scannedCard);
      // Clean up search param without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [handleQrScanInput]);

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <QRScannerModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] text-slate-800 font-sans">
      {/* Vertical Sidebar & Top Bar Header */}
      <Header />

      {/* Right Content Area offset by lg:pl-72 when vertical sidebar is visible */}
      <div className={`flex flex-col min-h-screen justify-between transition-all duration-300 ${isSidebarVisible ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Main Dashboard Panel */}
        <DashboardContent />

        {/* Universal Modals */}
        <PrintableCardModal />
        <PaymentModal />
        <QRScannerModal />

        {/* Footer Bar */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 font-medium mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              🏥 <strong>SmartCare HMS</strong> (Ethiopian Regional Edition) • Cloud Electronic Medical Record (EMR) Platform
            </div>
            <div className="flex items-center space-x-4 text-[11px] text-slate-400">
              <span>Telebirr & Chapa Payment Gateway Ready</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">🟢 Real-time WebSockets Sync Active</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HMSProvider>
      <MainLayout />
    </HMSProvider>
  );
}
