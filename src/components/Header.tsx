import React, { useState } from 'react';
import { useHMS } from '../context/HMSContext';
import { UserRole } from '../types/hms';
import { StaffManagementModal } from './common/StaffManagementModal';
import {
  Activity,
  Bell,
  Search,
  CheckCircle2,
  Trash2,
  UserCheck,
  Smartphone,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  ClipboardList,
  Building2,
  Globe,
  Sparkles,
  UserPlus,
  Key,
  UserCog,
  Menu,
  X,
  ChevronRight,
  Lock,
  LogOut,
  QrCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentStaff,
    logout,
    verifyAdminPassword,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    activeSearchQuery,
    setActiveSearchQuery,
    patients,
    setPrintableCardPatient,
    setIsQrScannerOpen,
    isSidebarVisible,
    setIsSidebarVisible,
    toggleSidebar,
  } = useHMS();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF'>('MANAGE_LIST');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin Password Verification Modal state for restricted features
  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminPassError, setAdminPassError] = useState('');
  const [targetRoleToSwitch, setTargetRoleToSwitch] = useState<UserRole | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'RECEPTIONIST',
      label: 'Reception & Cards',
      desc: 'Patient Intake & EMR Cards',
      icon: <ClipboardList className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      role: 'DOCTOR',
      label: 'Doctor EMR',
      desc: 'Consultation & Diagnostics',
      icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      role: 'LAB_TECH',
      label: 'Laboratory',
      desc: 'LIS Test Metrics & Specimen',
      icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    {
      role: 'PHARMACIST',
      label: 'Pharmacy Stock',
      desc: 'Medication & Dispensing',
      icon: <Pill className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      role: 'ADMIN',
      label: 'Admin Analytics',
      desc: 'Executive Revenue & Staff',
      icon: <Building2 className="w-5 h-5 text-slate-300" />,
      color: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    },
    {
      role: 'PUBLIC',
      label: 'Public Booking',
      desc: 'Online Appointments',
      icon: <Globe className="w-5 h-5 text-teal-400" />,
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    },
  ];

  // Quick patient search results
  const searchResults = activeSearchQuery.trim()
    ? patients.filter(
        (p) =>
          p.cardNumber.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          p.fullName.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          p.phone.includes(activeSearchQuery)
      )
    : [];

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* MOBILE TOP BAR (Visible on small screens) */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:hidden bg-slate-900 text-white p-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3" onClick={() => setCurrentRole('PUBLIC')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-wide text-white flex items-center">
              SmartCare <span className="text-emerald-400 ml-1">HMS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {currentRole} WORKSPACE
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Toggle Vertical Drawer Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP VERTICAL SIDEBAR + MOBILE OVERLAY DRAWER */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarVisible ? 'lg:translate-x-0' : 'lg:-translate-x-full'
        } ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* 1. Sidebar Brand Section */}
          <div className="p-5 border-b border-slate-800/90 bg-slate-950/70">
            <div className="flex items-center justify-between">
              <div
                onClick={() => {
                  setCurrentRole('PUBLIC');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-lg tracking-wide text-white">
                    SmartCare <span className="text-emerald-400 font-mono">HMS</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Ethiopia Regional EMR
                  </p>
                </div>
              </div>

              {/* Close/Hide Dashboard Button */}
              <button
                onClick={() => {
                  setIsSidebarVisible(false);
                  setMobileMenuOpen(false);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Hide Dashboard Navigation"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </button>
            </div>

            <div className="mt-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl px-2.5 py-1 text-[11px] text-emerald-300 font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                WebSockets Active
              </span>
              <span className="text-slate-400">v2.4</span>
            </div>
          </div>

          {/* 2. Active Staff Worker Profile & Security Controls */}
          {currentStaff && (
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <span>Active Worker Profile</span>
                <span className="text-emerald-400 font-mono font-bold">ONLINE</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                  {currentStaff.avatar || '👤'}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="font-extrabold text-xs text-white truncate">
                    {currentStaff.fullName}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold truncate">
                    {currentStaff.role} • {currentStaff.department}
                  </div>
                </div>
              </div>

              {/* Quick Actions (Add Staff, Password, Roster) */}
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => {
                    if (currentStaff?.role !== 'ADMIN') {
                      setTargetRoleToSwitch(null);
                      setAdminPromptOpen(true);
                      setStaffModalMode('ADD_STAFF');
                    } else {
                      setStaffModalMode('ADD_STAFF');
                      setShowStaffModal(true);
                    }
                  }}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl flex items-center justify-center gap-1 transition text-[11px] font-bold"
                  title="Add New Worker"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Staff</span>
                  {currentStaff?.role !== 'ADMIN' && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    if (currentStaff?.role !== 'ADMIN') {
                      setTargetRoleToSwitch(null);
                      setAdminPromptOpen(true);
                      setStaffModalMode('CHANGE_PASSWORD');
                    } else {
                      setStaffModalMode('CHANGE_PASSWORD');
                      setShowStaffModal(true);
                    }
                  }}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl flex items-center justify-center gap-1 transition text-[11px] font-bold"
                  title="Set or Change Staff Password"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Pass</span>
                  {currentStaff?.role !== 'ADMIN' && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    if (currentStaff?.role !== 'ADMIN') {
                      setTargetRoleToSwitch(null);
                      setAdminPromptOpen(true);
                      setStaffModalMode('MANAGE_LIST');
                    } else {
                      setStaffModalMode('MANAGE_LIST');
                      setShowStaffModal(true);
                    }
                  }}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl flex items-center justify-center gap-1 transition text-[11px] font-bold"
                  title="Staff Directory"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>List</span>
                  {currentStaff?.role !== 'ADMIN' && <Lock className="w-3 h-3 text-amber-400" />}
                </button>
              </div>
            </div>
          )}

          {/* 3. Vertical Navigation Dashboard Menu */}
          <div className="p-4 space-y-1 flex-1">
            <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>VERTICAL DASHBOARD MODULES</span>
            </div>

            <nav className="space-y-1">
              {roles.map((r) => {
                const isActive = currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      if (r.role === 'ADMIN' && currentStaff?.role !== 'ADMIN') {
                        setTargetRoleToSwitch('ADMIN');
                        setAdminPromptOpen(true);
                      } else {
                        setCurrentRole(r.role);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/60 font-extrabold scale-[1.01]'
                        : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl border ${r.color}`}>
                        {r.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                          <span>{r.label}</span>
                          {r.role === 'ADMIN' && currentStaff?.role !== 'ADMIN' && (
                            <Lock className="w-3 h-3 text-amber-400" />
                          )}
                        </div>
                        <div className="text-[10px] opacity-75 font-normal">{r.desc}</div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 4. Sidebar Footer & Sign Out */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 text-slate-400 text-[11px] space-y-3">
            <button
              onClick={logout}
              className="w-full py-2.5 px-3 bg-red-950/80 hover:bg-red-900/90 text-red-300 border border-red-800/80 rounded-xl font-bold flex items-center justify-center space-x-2 transition text-xs shadow-sm"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out of Station</span>
            </button>

            <div className="flex items-center justify-between text-[10px]">
              <span>Telebirr & Chapa Payment</span>
              <span className="text-emerald-400 font-bold font-mono">READY</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP TOP HEADER CONTENT BAR (Positioned in main panel) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 text-white px-4 lg:px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
        {/* Toggle / Hide / Unhide Dashboard Navigation Menu (Three Icon Lines) */}
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center space-x-2 font-bold text-xs shrink-0 shadow-sm cursor-pointer"
          title={isSidebarVisible ? "Hide Dashboard Navigation Menu" : "Unhide / Open Dashboard Navigation Menu"}
        >
          <Menu className="w-5 h-5 text-emerald-400" />
          <span className="hidden sm:inline font-mono text-[11px] text-emerald-300">
            {isSidebarVisible ? "Hide Dashboard" : "Open Dashboard"}
          </span>
        </button>

        {/* Global EMR Search Field & Scan QR Button */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => {
                setActiveSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search Patient EMR Card (e.g. ETH-00102), Name, Phone..."
              className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-sm pl-10 pr-16 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-sans"
            />
            <div className="absolute right-3 top-2.5 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 rounded shadow-xs">
                ⌘K
              </kbd>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {showSearchResults && activeSearchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto p-2"
                >
                  <div className="text-xs font-semibold text-slate-400 px-3 py-1 border-b border-slate-800 flex justify-between">
                    <span>Patients Found ({searchResults.length})</span>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="text-emerald-400 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">
                      No patient records match "{activeSearchQuery}".
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800 mt-1">
                      {searchResults.map((pat) => (
                        <div
                          key={pat.id}
                          onClick={() => {
                            setPrintableCardPatient(pat);
                            setShowSearchResults(false);
                          }}
                          className="p-3 hover:bg-slate-800/80 rounded-xl cursor-pointer flex items-center justify-between transition"
                        >
                          <div>
                            <div className="font-semibold text-sm text-white flex items-center gap-2">
                              <span>{pat.fullName}</span>
                              <span className="text-xs font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                                {pat.cardNumber}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {pat.age}Y / {pat.gender} • {pat.phone} • Status: {pat.status}
                            </div>
                          </div>
                          <button className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium">
                            View EMR Card
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition shrink-0 shadow-md border border-emerald-500/30"
            title="Scan EMR Digital Card QR Code"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        </div>

        {/* Top Header Actions (Notifications & Staff Password Quick Switcher) */}
        <div className="flex items-center space-x-3">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title="Notifications & SMS Log"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Live System Logs & SMS</span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 p-2">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No recent notifications or SMS alerts.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 rounded-lg text-xs cursor-pointer transition ${
                            notif.read ? 'bg-slate-900/50 opacity-70' : 'bg-slate-800/80 border-l-2 border-emerald-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-200">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(notif.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Staff Add / Password Trigger Buttons Top Right */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => {
                setStaffModalMode('ADD_STAFF');
                setShowStaffModal(true);
              }}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>

            <button
              onClick={() => {
                setStaffModalMode('CHANGE_PASSWORD');
                setShowStaffModal(true);
              }}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition shadow-sm"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Management Modal */}
      <StaffManagementModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        initialMode={staffModalMode}
      />

      {/* Admin Password Prompt Modal for Restricted View Access */}
      <AnimatePresence>
        {adminPromptOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (verifyAdminPassword(adminPassInput)) {
                  setAdminPassError('');
                  setAdminPromptOpen(false);
                  setAdminPassInput('');
                  if (targetRoleToSwitch) {
                    setCurrentRole(targetRoleToSwitch);
                  } else {
                    setShowStaffModal(true);
                  }
                  setMobileMenuOpen(false);
                } else {
                  setAdminPassError('Incorrect Admin Password! (Default: password123)');
                }
              }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-white shadow-2xl"
            >
              <div className="flex items-center space-x-3 text-amber-400">
                <div className="p-3 bg-amber-950 rounded-2xl border border-amber-800">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Admin Authorization Prompt</h4>
                  <p className="text-[11px] text-slate-400">
                    Only Administrators can view system analytics and full staff details. Enter Admin Password to proceed.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  System Admin Password *
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="Password (default: password123)"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {adminPassError && (
                <div className="p-2.5 bg-red-950 text-red-300 rounded-xl text-xs font-bold border border-red-800">
                  ⚠️ {adminPassError}
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminPromptOpen(false);
                    setAdminPassInput('');
                    setAdminPassError('');
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg"
                >
                  Unlock Admin View
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Three Lines Icon Button when Dashboard Navigation is Hidden */}
      <AnimatePresence>
        {!isSidebarVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed bottom-5 left-5 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-2xl border-2 border-emerald-400 font-bold flex items-center space-x-2 transition cursor-pointer"
            title="Open / Unhide Dashboard Navigation Menu"
          >
            <Menu className="w-6 h-6" />
            <span className="font-extrabold text-xs tracking-wide">Open Dashboard Menu</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

