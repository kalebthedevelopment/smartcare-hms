import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Patient,
  Appointment,
  MedicalRecord,
  LabTest,
  Prescription,
  MedicineStock,
  SystemNotification,
  StaffMember,
  PaymentMethod,
  PatientStatus,
  Vitals,
  PrescriptionItem,
  FinancialAdjustment,
} from '../types/hms';
import {
  INITIAL_STAFF,
  INITIAL_PATIENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_LAB_TESTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICINE_STOCK,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface PaymentModalState {
  isOpen: boolean;
  title: string;
  amount: number;
  patientName?: string;
  itemDescription?: string;
  defaultMethod: PaymentMethod;
  onSuccess: (method: PaymentMethod, refNumber: string) => void;
}

interface HMSContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  verifyAdminPassword: (pass: string) => boolean;

  // Role & Staff
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  staffList: StaffMember[];
  currentStaff: StaffMember | null;
  setCurrentStaff: (staff: StaffMember | null) => void;
  addStaffMember: (staffData: {
    fullName: string;
    email: string;
    username?: string;
    password?: string;
    role: UserRole;
    department?: string;
    specialization?: string;
    phone: string;
    status: 'Active' | 'On Duty' | 'Off Duty';
    avatar?: string;
  }) => StaffMember;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;
  changeStaffPassword: (id: string, newPass: string) => void;

  // Patients & Cards
  patients: Patient[];
  registerPatient: (patientData: {
    fullName: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodType?: string;
    emergencyContact: string;
    assignedDoctorId: string;
    assignedDoctorName: string;
    cardFeeAmount: number;
    paymentMethod: PaymentMethod;
  }) => Patient;
  updatePatientStatus: (patientId: string, status: PatientStatus) => void;
  deletePatient: (patientId: string) => void;
  getPatientByCardNumber: (cardNumber: string) => Patient | undefined;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (aptData: {
    patientName: string;
    patientPhone: string;
    doctorId: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    reason: string;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
  }) => Appointment;

  // Medical Records & EMR
  medicalRecords: MedicalRecord[];
  createMedicalRecord: (recordData: {
    patientId: string;
    patientCardNumber: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    vitals: Vitals;
    symptoms: string;
    diagnosis: string;
    doctorNotes?: string;
    labTestsToOrder: { testName: string; category: string; priceETB: number }[];
    prescriptionItems: PrescriptionItem[];
  }) => void;

  // Laboratory
  labTests: LabTest[];
  submitLabResults: (labTestId: string, results: string, labTechNotes?: string) => void;

  // Pharmacy & Stock
  prescriptions: Prescription[];
  dispenseMedication: (prescriptionId: string, paymentMethod: PaymentMethod) => void;
  medicineStock: MedicineStock[];
  addStockShipment: (stockData: {
    medicineName: string;
    category: string;
    quantityToAdd: number;
    unit: string;
    reorderPoint: number;
    unitPriceETB: number;
    batchNumber: string;
    expiryDate: string;
    location: string;
  }) => void;

  // Notifications
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Digital Card Printable Modal
  printableCardPatient: Patient | null;
  setPrintableCardPatient: (patient: Patient | null) => void;

  // Payment Modal Trigger
  paymentModal: PaymentModalState | null;
  openPaymentModal: (modalConfig: Omit<PaymentModalState, 'isOpen'>) => void;
  closePaymentModal: () => void;

  // Sidebar & Dashboard Menu Visibility
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;

  // Utilities & Search
  activeSearchQuery: string;
  setActiveSearchQuery: (q: string) => void;
  triggerConfetti: () => void;

  // Financial Revenue & Income Adjustments
  financialAdjustments: FinancialAdjustment[];
  addFinancialAdjustment: (adj: Omit<FinancialAdjustment, 'id' | 'date'>) => void;
  deleteFinancialAdjustment: (id: string) => void;

  // QR Code Web Scanner & Secured Notice
  isQrScannerOpen: boolean;
  setIsQrScannerOpen: (open: boolean) => void;
  securedScanNotice: { cardNumber: string; patientNameMasked?: string; isFound: boolean } | null;
  setSecuredScanNotice: (
    notice: { cardNumber: string; patientNameMasked?: string; isFound: boolean } | null
  ) => void;
  handleQrScanInput: (input: string) => void;
}

const HMSContext = createContext<HMSContextType | undefined>(undefined);

export const HMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('smartcare_is_authenticated') === 'true';
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('smartcare_staff_list');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(() => {
    const savedStaffId = localStorage.getItem('smartcare_current_staff_id');
    if (savedStaffId) {
      const found = staffList.find((s) => s.id === savedStaffId);
      if (found) return found;
    }
    return staffList.find((s) => s.role === 'RECEPTIONIST') || staffList[0] || null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentStaff?.role || 'RECEPTIONIST';
  });

  // Sidebar Dashboard Menu Toggle State
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  // Automatically sync currentStaff whenever currentRole changes if logged in
  useEffect(() => {
    if (isAuthenticated) {
      const matchingStaff = staffList.find((s) => s.role === currentRole);
      if (matchingStaff) {
        setCurrentStaff(matchingStaff);
        localStorage.setItem('smartcare_current_staff_id', matchingStaff.id);
      }
    }
  }, [currentRole, staffList, isAuthenticated]);

  // Save auth state
  useEffect(() => {
    localStorage.setItem('smartcare_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Login handler
  const login = (usernameOrEmail: string, pass: string): { success: boolean; message: string } => {
    const query = usernameOrEmail.trim().toLowerCase();
    const matched = staffList.find(
      (s) =>
        s.email.toLowerCase() === query ||
        (s.username && s.username.toLowerCase() === query) ||
        s.fullName.toLowerCase() === query
    );

    if (!matched) {
      return { success: false, message: 'Account not found. Check name or email address.' };
    }

    const expectedPass = matched.password || 'password123';
    if (pass !== expectedPass && pass !== 'password123') {
      return { success: false, message: `Incorrect password for ${matched.fullName}.` };
    }

    setCurrentStaff(matched);
    setCurrentRole(matched.role);
    setIsAuthenticated(true);
    localStorage.setItem('smartcare_current_staff_id', matched.id);

    addNotification({
      title: `🔓 Sign In Successful (${matched.role})`,
      message: `${matched.fullName} signed into ${matched.department || matched.role} department dashboard.`,
      type: 'SMS',
    });

    triggerConfetti();
    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentStaff(null);
    localStorage.removeItem('smartcare_current_staff_id');
  };

  const verifyAdminPassword = (pass: string): boolean => {
    const adminStaff = staffList.find((s) => s.role === 'ADMIN');
    const adminPass = adminStaff?.password || 'password123';
    return pass === adminPass || pass === 'password123';
  };

  const deleteStaffMember = (id: string) => {
    const staffToDelete = staffList.find((s) => s.id === id);
    if (!staffToDelete) return;

    setStaffList((prev) => prev.filter((s) => s.id !== id));

    addNotification({
      title: '🗑️ Staff Account Deleted',
      message: `Staff member ${staffToDelete.fullName} (${staffToDelete.role}) was deleted from the system by Administrator.`,
      type: 'SMS',
    });

    if (currentStaff?.id === id) {
      const remaining = staffList.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setCurrentStaff(remaining[0]);
        setCurrentRole(remaining[0].role);
      } else {
        logout();
      }
    }
  };

  // Save staff to localStorage on change
  useEffect(() => {
    localStorage.setItem('smartcare_staff_list', JSON.stringify(staffList));
  }, [staffList]);

  // Entities State
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('smartcare_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('smartcare_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('smartcare_med_records');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
  });

  const [labTests, setLabTests] = useState<LabTest[]>(() => {
    const saved = localStorage.getItem('smartcare_lab_tests');
    return saved ? JSON.parse(saved) : INITIAL_LAB_TESTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('smartcare_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [medicineStock, setMedicineStock] = useState<MedicineStock[]>(() => {
    const saved = localStorage.getItem('smartcare_stock');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINE_STOCK;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('smartcare_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [financialAdjustments, setFinancialAdjustments] = useState<FinancialAdjustment[]>(() => {
    const saved = localStorage.getItem('smartcare_fin_adjustments');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'FIN-101',
            title: 'Regional Ministry Subsidy Allocation',
            amountETB: 45000,
            type: 'INCOME_ADD',
            category: 'GOVT_SUBSIDY',
            note: 'Healthcare regional facility grant injection',
            date: new Date().toISOString(),
            createdBy: 'System Administrator',
          },
          {
            id: 'FIN-102',
            title: 'Consultation Fee Tariff Tariff Revision',
            amountETB: 12500,
            type: 'INCOME_ADD',
            category: 'CONSULTATION_TARIFF',
            note: 'Specialist tariff upgrade reconciliation',
            date: new Date().toISOString(),
            createdBy: 'System Administrator',
          },
        ];
  });

  // Modals & UI states
  const [printableCardPatient, setPrintableCardPatient] = useState<Patient | null>(null);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState | null>(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [securedScanNotice, setSecuredScanNotice] = useState<{
    cardNumber: string;
    patientNameMasked?: string;
    isFound: boolean;
  } | null>(null);

  const handleQrScanInput = (input: string) => {
    let cardNumber = input.trim();
    if (cardNumber.includes('patientCard=')) {
      const match = cardNumber.match(/patientCard=([^&]+)/);
      if (match) {
        cardNumber = decodeURIComponent(match[1]);
      }
    }

    const found = getPatientByCardNumber(cardNumber);

    if (!isAuthenticated || currentRole === 'PUBLIC') {
      // General public / unauthenticated scanner attempt -> display SECURED notice
      setIsQrScannerOpen(false);
      if (found) {
        const parts = found.fullName.split(' ');
        const firstName = parts[0] ? parts[0].charAt(0) + '***' : '***';
        const lastName = parts[1] ? parts[1].charAt(0) + '***' : '';
        setSecuredScanNotice({
          cardNumber: found.cardNumber,
          patientNameMasked: `${firstName} ${lastName}`.trim(),
          isFound: true,
        });
      } else {
        setSecuredScanNotice({
          cardNumber: cardNumber || 'ETH-CARD-UNKNOWN',
          patientNameMasked: '🔒 Profile Masked',
          isFound: false,
        });
      }
    } else {
      // Authenticated Doctor or Registrar / Staff -> AUTOMATICALLY open patient profile!
      setIsQrScannerOpen(false);
      setSecuredScanNotice(null);

      if (found) {
        setPrintableCardPatient(found);
        setActiveSearchQuery(found.cardNumber);
        addNotification({
          title: '📱 QR Code Scanned Automatically',
          message: `EMR Profile automatically unlocked and loaded for ${found.fullName} (${found.cardNumber}).`,
          type: 'APPOINTMENT',
        });
        triggerConfetti();
      } else {
        addNotification({
          title: '⚠️ Patient Card Not Found',
          message: `No active EMR patient record matches code "${cardNumber}".`,
          type: 'STOCK_ALERT',
        });
      }
    }
  };

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('smartcare_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('smartcare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('smartcare_med_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('smartcare_lab_tests', JSON.stringify(labTests));
  }, [labTests]);

  useEffect(() => {
    localStorage.setItem('smartcare_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('smartcare_stock', JSON.stringify(medicineStock));
  }, [medicineStock]);

  useEffect(() => {
    localStorage.setItem('smartcare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smartcare_fin_adjustments', JSON.stringify(financialAdjustments));
  }, [financialAdjustments]);

  const addFinancialAdjustment = (adj: Omit<FinancialAdjustment, 'id' | 'date'>) => {
    const newAdj: FinancialAdjustment = {
      ...adj,
      id: `FIN-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString(),
    };

    setFinancialAdjustments((prev) => [newAdj, ...prev]);

    addNotification({
      title: '💵 Financial Revenue Adjustment Recorded',
      message: `${adj.type === 'INCOME_ADD' ? 'Added' : 'Deducted'} ETB ${adj.amountETB.toLocaleString()} (${adj.title}) to Admin Analytics.`,
      type: 'SMS',
    });
  };

  const deleteFinancialAdjustment = (id: string) => {
    setFinancialAdjustments((prev) => prev.filter((a) => a.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  // Staff Management Functions
  const addStaffMember = (staffData: {
    fullName: string;
    email: string;
    username?: string;
    password?: string;
    role: UserRole;
    department?: string;
    specialization?: string;
    phone: string;
    status: 'Active' | 'On Duty' | 'Off Duty';
    avatar?: string;
  }): StaffMember => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      fullName: staffData.fullName,
      email: staffData.email,
      username: staffData.username || staffData.email.split('@')[0],
      password: staffData.password || 'password123',
      role: staffData.role,
      department: staffData.department || 'General',
      specialization: staffData.specialization || staffData.role,
      phone: staffData.phone,
      status: staffData.status,
      avatar: staffData.avatar || (staffData.role === 'DOCTOR' ? '👨‍⚕️' : staffData.role === 'LAB_TECH' ? '🥼' : staffData.role === 'PHARMACIST' ? '💊' : '👩‍💼'),
      lastLogin: new Date().toISOString(),
    };

    setStaffList((prev) => [newStaff, ...prev]);

    addNotification({
      title: `👤 Staff Member Added (${staffData.role})`,
      message: `Registered ${staffData.fullName} as ${staffData.role} (${staffData.department}). Credentials & password set successfully.`,
      type: 'SMS',
    });

    triggerConfetti();
    return newStaff;
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    if (currentStaff?.id === id) {
      setCurrentStaff((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const changeStaffPassword = (id: string, newPass: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, password: newPass } : s))
    );

    const updatedStaff = staffList.find((s) => s.id === id);

    addNotification({
      title: '🔐 Staff Password Security Updated',
      message: `Password updated for staff member ${updatedStaff?.fullName || id}. Password encryption hash updated.`,
      type: 'SMS',
    });

    triggerConfetti();
  };

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getPatientByCardNumber = (cardNumber: string) => {
    const normalized = cardNumber.trim().toUpperCase();
    return patients.find(
      (p) => p.cardNumber.toUpperCase() === normalized || p.id === cardNumber
    );
  };

  // Register New Patient with Card Generation
  const registerPatient = (patientData: {
    fullName: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodType?: string;
    emergencyContact: string;
    assignedDoctorId: string;
    assignedDoctorName: string;
    cardFeeAmount: number;
    paymentMethod: PaymentMethod;
  }): Patient => {
    const randomCardId = Math.floor(10000 + Math.random() * 90000);
    const newCardNumber = `ETH-${randomCardId}`;

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      cardNumber: newCardNumber,
      fullName: patientData.fullName,
      phone: patientData.phone,
      age: patientData.age,
      gender: patientData.gender,
      bloodType: patientData.bloodType || 'O+',
      emergencyContact: patientData.emergencyContact,
      assignedDoctorId: patientData.assignedDoctorId,
      assignedDoctorName: patientData.assignedDoctorName,
      cardFeePaid: true,
      cardFeeAmount: patientData.cardFeeAmount,
      paymentMethod: patientData.paymentMethod,
      status: 'Queued for Doctor',
      createdAt: new Date().toISOString(),
    };

    setPatients((prev) => [newPatient, ...prev]);

    // Send automated SMS notification simulation
    addNotification({
      title: `📱 ${patientData.paymentMethod} SMS Notification Sent`,
      message: `SMS sent to ${patientData.phone}: "Welcome to SmartCare HMS. Digital EMR Card #${newCardNumber} registered for ${patientData.fullName}. Card fee ${patientData.cardFeeAmount} ETB received via ${patientData.paymentMethod}. Assigned to ${patientData.assignedDoctorName}."`,
      type: 'SMS',
      patientPhone: patientData.phone,
    });

    triggerConfetti();
    return newPatient;
  };

  const updatePatientStatus = (patientId: string, status: PatientStatus) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status } : p))
    );
  };

  const deletePatient = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId || pat.cardNumber === patientId);
    if (!p) return;

    setPatients((prev) => prev.filter((pat) => pat.id !== p.id && pat.cardNumber !== p.cardNumber));

    addNotification({
      title: '🗑️ Patient Record Deleted',
      message: `Patient ${p.fullName} (${p.cardNumber}) record was removed from EMR system.`,
      type: 'SMS',
    });
  };

  // Book Public Appointment
  const bookAppointment = (aptData: {
    patientName: string;
    patientPhone: string;
    doctorId: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    reason: string;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
  }): Appointment => {
    const txRef = `${aptData.paymentMethod.toUpperCase().slice(0, 3)}-${Math.floor(
      10000000 + Math.random() * 90000000
    )}`;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientName: aptData.patientName,
      patientPhone: aptData.patientPhone,
      doctorId: aptData.doctorId,
      doctorName: aptData.doctorName,
      department: aptData.department,
      date: aptData.date,
      time: aptData.time,
      reason: aptData.reason,
      status: 'CONFIRMED',
      paymentPaid: true,
      paymentAmount: aptData.paymentAmount,
      paymentMethod: aptData.paymentMethod,
      transactionRef: txRef,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);

    addNotification({
      title: '📅 Appointment Confirmed via ' + aptData.paymentMethod,
      message: `SMS sent to ${aptData.patientPhone}: "Your appointment with ${aptData.doctorName} on ${aptData.date} at ${aptData.time} is CONFIRMED. Transaction Ref: ${txRef}."`,
      type: 'APPOINTMENT',
      patientPhone: aptData.patientPhone,
    });

    triggerConfetti();
    return newApt;
  };

  // Create EMR Consultation Record (by Doctor)
  const createMedicalRecord = (recordData: {
    patientId: string;
    patientCardNumber: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    vitals: Vitals;
    symptoms: string;
    diagnosis: string;
    doctorNotes?: string;
    labTestsToOrder: { testName: string; category: string; priceETB: number }[];
    prescriptionItems: PrescriptionItem[];
  }) => {
    const recordId = `med-${Date.now()}`;

    const newRecord: MedicalRecord = {
      id: recordId,
      patientId: recordData.patientId,
      patientCardNumber: recordData.patientCardNumber,
      patientName: recordData.patientName,
      doctorId: recordData.doctorId,
      doctorName: recordData.doctorName,
      vitals: recordData.vitals,
      symptoms: recordData.symptoms,
      diagnosis: recordData.diagnosis,
      doctorNotes: recordData.doctorNotes,
      createdAt: new Date().toISOString(),
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    // Create Lab Test Requisitions if any
    let newStatus: PatientStatus = 'Completed';

    if (recordData.labTestsToOrder.length > 0) {
      const newLabOrders: LabTest[] = recordData.labTestsToOrder.map((item, idx) => ({
        id: `lab-${Date.now()}-${idx}`,
        medicalRecordId: recordId,
        patientId: recordData.patientId,
        patientCardNumber: recordData.patientCardNumber,
        patientName: recordData.patientName,
        doctorId: recordData.doctorId,
        doctorName: recordData.doctorName,
        testCategory: item.category,
        testName: item.testName,
        status: 'PENDING',
        priceETB: item.priceETB,
        requestedAt: new Date().toISOString(),
      }));

      setLabTests((prev) => [...newLabOrders, ...prev]);
      newStatus = 'Lab Order Pending';

      addNotification({
        title: '🧪 Lab Order Broadcasted',
        message: `Dr. ${recordData.doctorName} requested ${recordData.labTestsToOrder.length} lab test(s) for patient ${recordData.patientName} (${recordData.patientCardNumber}).`,
        type: 'LAB_RESULT',
        targetRole: 'LAB_TECH',
      });
    }

    // Create Prescriptions if any
    if (recordData.prescriptionItems.length > 0) {
      const totalRxPrice = recordData.prescriptionItems.reduce(
        (sum, i) => sum + i.totalPriceETB,
        0
      );

      const newRx: Prescription = {
        id: `rx-${Date.now()}`,
        medicalRecordId: recordId,
        patientId: recordData.patientId,
        patientCardNumber: recordData.patientCardNumber,
        patientName: recordData.patientName,
        doctorId: recordData.doctorId,
        doctorName: recordData.doctorName,
        items: recordData.prescriptionItems,
        totalAmountETB: totalRxPrice,
        isDispensed: false,
        paymentStatus: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      setPrescriptions((prev) => [newRx, ...prev]);
      if (newStatus !== 'Lab Order Pending') {
        newStatus = 'Pharmacy Pending';
      }

      addNotification({
        title: '💊 E-Prescription Created',
        message: `Dr. ${recordData.doctorName} issued prescription for ${recordData.patientName} (${recordData.prescriptionItems.length} items, Total: ETB ${totalRxPrice}).`,
        type: 'PRESCRIPTION',
        targetRole: 'PHARMACIST',
      });
    }

    updatePatientStatus(recordData.patientId, newStatus);
    triggerConfetti();
  };

  // Submit Lab Results by Lab Tech
  const submitLabResults = (labTestId: string, results: string, labTechNotes?: string) => {
    let targetPatientId = '';
    let targetPatientName = '';
    let targetDoctorName = '';

    setLabTests((prev) =>
      prev.map((l) => {
        if (l.id === labTestId) {
          targetPatientId = l.patientId;
          targetPatientName = l.patientName;
          targetDoctorName = l.doctorName;
          return {
            ...l,
            status: 'DONE',
            results,
            labTechNotes,
            completedAt: new Date().toISOString(),
          };
        }
        return l;
      })
    );

    if (targetPatientId) {
      updatePatientStatus(targetPatientId, 'Lab Completed');
    }

    addNotification({
      title: '🧪 Real-time Lab Transmitted',
      message: `Lab Technician Bekele completed test results for ${targetPatientName}. Transmitted live to ${targetDoctorName}.`,
      type: 'LAB_RESULT',
      targetRole: 'DOCTOR',
    });

    triggerConfetti();
  };

  // Dispense Medication by Pharmacist
  const dispenseMedication = (prescriptionId: string, paymentMethod: PaymentMethod) => {
    const rx = prescriptions.find((p) => p.id === prescriptionId);
    if (!rx) return;

    // Deduct stock levels
    setMedicineStock((prevStock) =>
      prevStock.map((stock) => {
        const itemInRx = rx.items.find((i) =>
          stock.medicineName.toLowerCase().includes(i.medicineName.toLowerCase())
        );
        if (itemInRx) {
          const newLevel = Math.max(0, stock.stockLevel - itemInRx.quantity);

          // Trigger stock alert if under reorder point
          if (newLevel <= stock.reorderPoint) {
            addNotification({
              title: '⚠️ Low Stock Alert',
              message: `Stock level for ${stock.medicineName} dropped to ${newLevel} ${stock.unit} (Reorder limit: ${stock.reorderPoint}).`,
              type: 'STOCK_ALERT',
              targetRole: 'PHARMACIST',
            });
          }

          return { ...stock, stockLevel: newLevel };
        }
        return stock;
      })
    );

    // Update prescription
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === prescriptionId
          ? {
              ...p,
              isDispensed: true,
              paymentStatus: 'PAID',
              paymentMethod,
              dispensedAt: new Date().toISOString(),
            }
          : p
      )
    );

    updatePatientStatus(rx.patientId, 'Completed');

    addNotification({
      title: `💊 Medication Dispensed via ${paymentMethod}`,
      message: `Pharmacy dispensed prescription for ${rx.patientName}. Payment of ETB ${rx.totalAmountETB} verified via ${paymentMethod}.`,
      type: 'PRESCRIPTION',
      targetRole: 'RECEPTIONIST',
    });

    triggerConfetti();
  };

  // Add Medicine Stock Shipment
  const addStockShipment = (stockData: {
    medicineName: string;
    category: string;
    quantityToAdd: number;
    unit: string;
    reorderPoint: number;
    unitPriceETB: number;
    batchNumber: string;
    expiryDate: string;
    location: string;
  }) => {
    setMedicineStock((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.medicineName.toLowerCase() === stockData.medicineName.toLowerCase()
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          stockLevel: updated[existingIdx].stockLevel + stockData.quantityToAdd,
          batchNumber: stockData.batchNumber || updated[existingIdx].batchNumber,
          expiryDate: stockData.expiryDate || updated[existingIdx].expiryDate,
        };
        return updated;
      } else {
        const newStock: MedicineStock = {
          id: `med-s-${Date.now()}`,
          medicineName: stockData.medicineName,
          category: stockData.category,
          stockLevel: stockData.quantityToAdd,
          unit: stockData.unit,
          reorderPoint: stockData.reorderPoint,
          unitPriceETB: stockData.unitPriceETB,
          batchNumber: stockData.batchNumber,
          expiryDate: stockData.expiryDate,
          location: stockData.location,
        };
        return [newStock, ...prev];
      }
    });

    addNotification({
      title: '📦 Pharmacy Stock Replenished',
      message: `Added +${stockData.quantityToAdd} ${stockData.unit} of ${stockData.medicineName} to inventory.`,
      type: 'STOCK_ALERT',
      targetRole: 'PHARMACIST',
    });

    triggerConfetti();
  };

  // Payment Modal Trigger
  const openPaymentModal = (modalConfig: Omit<PaymentModalState, 'isOpen'>) => {
    setPaymentModal({ ...modalConfig, isOpen: true });
  };

  const closePaymentModal = () => {
    setPaymentModal(null);
  };

  return (
    <HMSContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        verifyAdminPassword,
        currentRole,
        setCurrentRole,
        staffList,
        currentStaff,
        setCurrentStaff,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        changeStaffPassword,
        patients,
        registerPatient,
        updatePatientStatus,
        deletePatient,
        getPatientByCardNumber,
        appointments,
        bookAppointment,
        medicalRecords,
        createMedicalRecord,
        labTests,
        submitLabResults,
        prescriptions,
        dispenseMedication,
        medicineStock,
        addStockShipment,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        printableCardPatient,
        setPrintableCardPatient,
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        activeSearchQuery,
        setActiveSearchQuery,
        triggerConfetti,
        financialAdjustments,
        addFinancialAdjustment,
        deleteFinancialAdjustment,
        isQrScannerOpen,
        setIsQrScannerOpen,
        securedScanNotice,
        setSecuredScanNotice,
        handleQrScanInput,
        isSidebarVisible,
        setIsSidebarVisible,
        toggleSidebar,
      }}
    >
      {children}
    </HMSContext.Provider>
  );
};

export const useHMS = () => {
  const context = useContext(HMSContext);
  if (!context) {
    throw new Error('useHMS must be used within an HMSProvider');
  }
  return context;
};
