import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { UserRole, StaffMember } from '../../types/hms';
import {
  UserPlus,
  Key,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  User,
  X,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Award,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StaffManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF';
  selectedStaffForPassword?: StaffMember | null;
}

const AVATAR_OPTIONS = ['👨‍⚕️', '👩‍⚕️', '🩺', '🥼', '💊', '👩‍💼', '🛡️', '🧪', '💉', '🧑‍🔬', '⚙️', '🏥'];

export const StaffManagementModal: React.FC<StaffManagementModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'MANAGE_LIST',
  selectedStaffForPassword = null,
}) => {
  const {
    staffList,
    currentStaff,
    currentRole,
    setCurrentStaff,
    setCurrentRole,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    changeStaffPassword,
    verifyAdminPassword,
  } = useHMS();

  const [mode, setMode] = useState<'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF'>(
    initialMode
  );

  // Selected Staff for password change or editing
  const [targetStaff, setTargetStaff] = useState<StaffMember | null>(
    selectedStaffForPassword || currentStaff || staffList[0] || null
  );

  // Form State for Adding Staff
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('DOCTOR');
  const [department, setDepartment] = useState('General Practice');
  const [specialization, setSpecialization] = useState('General Physician');
  const [phone, setPhone] = useState('+251 911 000 222');
  const [status, setStatus] = useState<'Active' | 'On Duty' | 'Off Duty'>('On Duty');
  const [avatar, setAvatar] = useState('👨‍⚕️');

  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);

  // Switch Staff State
  const [switchPassword, setSwitchPassword] = useState('');
  const [switchError, setSwitchError] = useState('');

  // Admin Verification & Lock State
  const [isUnlocked, setIsUnlocked] = useState(currentRole === 'ADMIN');
  const [pendingAction, setPendingAction] = useState<{
    type: 'DELETE' | 'VIEW_DETAILS' | 'ADD_STAFF' | 'UNLOCK_TAB';
    staffId?: string;
    targetMode?: 'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF';
  } | null>(null);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  if (!isOpen) return null;

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPassword(adminPassInput)) {
      setAdminAuthError('Incorrect Admin Password! (Default: password123)');
      return;
    }

    setAdminAuthError('');
    setIsUnlocked(true);

    if (pendingAction?.type === 'DELETE' && pendingAction.staffId) {
      deleteStaffMember(pendingAction.staffId);
    } else if (pendingAction?.type === 'UNLOCK_TAB' && pendingAction.targetMode) {
      setMode(pendingAction.targetMode);
    }

    setPendingAction(null);
    setAdminPassInput('');
  };

  const handleTabChange = (targetMode: 'ADD_STAFF' | 'CHANGE_PASSWORD' | 'MANAGE_LIST' | 'SWITCH_STAFF') => {
    if (targetMode === 'SWITCH_STAFF') {
      setMode(targetMode);
      return;
    }

    if (currentRole === 'ADMIN' || isUnlocked) {
      setMode(targetMode);
    } else {
      setPendingAction({ type: 'UNLOCK_TAB', targetMode });
    }
  };

  const confirmDeleteStaff = (st: StaffMember) => {
    if (currentRole === 'ADMIN') {
      if (confirm(`Are you sure you want to permanently delete staff member ${st.fullName}?`)) {
        deleteStaffMember(st.id);
      }
    } else {
      setPendingAction({ type: 'DELETE', staffId: st.id });
    }
  };

  const handleCreateStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    const newStaff = addStaffMember({
      fullName,
      email,
      username: username || email.split('@')[0],
      password,
      role,
      department,
      specialization,
      phone,
      status,
      avatar,
    });

    // Reset Form & Switch to List
    setFullName('');
    setEmail('');
    setUsername('');
    setPassword('password123');
    setMode('MANAGE_LIST');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStaff || !newPassword) return;
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    changeStaffPassword(targetStaff.id, newPassword);
    setPassChangeSuccess(true);
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPassChangeSuccess(false);
    }, 3000);
  };

  const handleSwitchStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStaff) return;

    if (targetStaff.password && switchPassword !== targetStaff.password) {
      setSwitchError('Incorrect password for ' + targetStaff.fullName);
      return;
    }

    setCurrentStaff(targetStaff);
    setCurrentRole(targetStaff.role);
    setSwitchError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8"
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl font-bold shadow-md">
              {targetStaff?.avatar || '👤'}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>Staff & Worker Security Portal</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  HMS v2.4
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage staff credentials, set passwords, and switch active profiles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-around text-xs font-bold">
          <button
            onClick={() => handleTabChange('MANAGE_LIST')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
              mode === 'MANAGE_LIST'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Staff Roster</span>
            {currentRole !== 'ADMIN' && !isUnlocked && <Lock className="w-3 h-3 text-amber-500" />}
          </button>

          <button
            onClick={() => handleTabChange('ADD_STAFF')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
              mode === 'ADD_STAFF'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>➕ Add Staff</span>
            {currentRole !== 'ADMIN' && !isUnlocked && <Lock className="w-3 h-3 text-amber-500" />}
          </button>

          <button
            onClick={() => handleTabChange('CHANGE_PASSWORD')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
              mode === 'CHANGE_PASSWORD'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-amber-600" />
            <span>🔑 Pass</span>
            {currentRole !== 'ADMIN' && !isUnlocked && <Lock className="w-3 h-3 text-amber-500" />}
          </button>

          <button
            onClick={() => handleTabChange('SWITCH_STAFF')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition ${
              mode === 'SWITCH_STAFF'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>🔄 Switch Profile</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* 1. MANAGE ROSTER MODE */}
          {mode === 'MANAGE_LIST' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>🏥 All Registered Hospital Staff</span>
                  <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                    {staffList.length} Workers
                  </span>
                </h4>
                <button
                  onClick={() => setMode('ADD_STAFF')}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                >
                  + Register Staff Member
                </button>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl max-h-80 overflow-y-auto">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                        {st.avatar || '👤'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{st.fullName}</span>
                          <span className="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                            {st.role}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {st.specialization || st.department} • <span className="font-mono">{st.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setTargetStaff(st);
                          setMode('CHANGE_PASSWORD');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold border border-slate-300 flex items-center gap-1 transition"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-600" />
                        <span>Password</span>
                      </button>

                      <button
                        onClick={() => confirmDeleteStaff(st)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold flex items-center gap-1 transition"
                        title="Delete Staff Member Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Delete</span>
                      </button>

                      <button
                        onClick={() => {
                          setTargetStaff(st);
                          setMode('SWITCH_STAFF');
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. ADD NEW STAFF MODE */}
          {mode === 'ADD_STAFF' && (
            <form onSubmit={handleCreateStaffSubmit} className="space-y-4 text-xs">
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                ✨ Enter the worker details below to register a new clinical or administrative staff member with secure login credentials and password.
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Staff Icon / Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition ${
                        avatar === av
                          ? 'bg-emerald-100 border-emerald-500 scale-110 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Meron Hailu"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="meron.h@smartcare.et"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="DOCTOR">Doctor (Physician / Specialist)</option>
                    <option value="RECEPTIONIST">Receptionist (Front Desk)</option>
                    <option value="LAB_TECH">Lab Technician</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="ADMIN">Hospital Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone (+251) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 911 000 222"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="General Practice"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization / Title</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="General Physician (GP)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="font-bold text-xs text-emerald-400 block flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Set Staff Security Credentials & Password
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 text-[11px]">Username / Handle</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="meron.doc"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 text-[11px]">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Staff Worker Profile & Grant Access</span>
              </button>
            </form>
          )}

          {/* 3. CHANGE PASSWORD MODE */}
          {mode === 'CHANGE_PASSWORD' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs flex items-center space-x-3">
                <Key className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold">Set / Reset Password for Staff Member</div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Selected Staff: <strong>{targetStaff?.fullName}</strong> ({targetStaff?.role} • {targetStaff?.email})
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Staff Worker</label>
                <select
                  value={targetStaff?.id || ''}
                  onChange={(e) => {
                    const found = staffList.find((s) => s.id === e.target.value);
                    if (found) setTargetStaff(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.avatar} {s.fullName} ({s.role} — {s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pr-10 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to verify"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-sm"
                />
              </div>

              {passChangeSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Password updated successfully for {targetStaff?.fullName}!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
              >
                🔐 Update Password Credentials
              </button>
            </form>
          )}

          {/* 4. SWITCH STAFF MODE */}
          {mode === 'SWITCH_STAFF' && (
            <form onSubmit={handleSwitchStaffSubmit} className="space-y-4 text-xs">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-purple-900 text-xs flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold">Authenticate & Switch Active Staff Session</div>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    Select a staff account and enter password to sign in as that user.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Staff Account</label>
                <select
                  value={targetStaff?.id || ''}
                  onChange={(e) => {
                    const found = staffList.find((s) => s.id === e.target.value);
                    if (found) setTargetStaff(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.avatar} {s.fullName} ({s.role} — {s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Enter Password for {targetStaff?.fullName}
                </label>
                <input
                  type="password"
                  required
                  value={switchPassword}
                  onChange={(e) => setSwitchPassword(e.target.value)}
                  placeholder="Password (default: password123)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-sm"
                />
              </div>

              {switchError && (
                <div className="p-3 bg-red-100 text-red-800 rounded-xl font-bold">
                  ⚠️ {switchError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-sm transition"
              >
                Sign In as {targetStaff?.fullName} ({targetStaff?.role})
              </button>
            </form>
          )}
        </div>

        {/* Admin Password Overlay Prompt */}
        {pendingAction && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex items-center justify-center">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleAdminVerify}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-white shadow-2xl"
            >
              <div className="flex items-center space-x-3 text-red-400">
                <div className="p-3 bg-red-950 rounded-2xl border border-red-800">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Admin Authorization Required</h4>
                  <p className="text-[11px] text-slate-400">
                    System security requires the Admin password to control & delete staff members.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Enter System Admin Password *
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="Password (default: password123)"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 font-mono text-sm focus:border-red-500"
                />
              </div>

              {adminAuthError && (
                <div className="p-2.5 bg-red-950 text-red-300 rounded-xl text-xs font-bold border border-red-800">
                  ⚠️ {adminAuthError}
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingAction(null);
                    setAdminPassInput('');
                    setAdminAuthError('');
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs shadow-lg"
                >
                  Confirm Action
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
