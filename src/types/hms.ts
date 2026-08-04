export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR' | 'LAB_TECH' | 'PHARMACIST' | 'PUBLIC';

export type Gender = 'Male' | 'Female' | 'Other';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'Telebirr' | 'Chapa' | 'Cash' | 'Insurance';

export type PatientStatus = 
  | 'Registered'
  | 'Queued for Doctor'
  | 'In Consultation'
  | 'Lab Order Pending'
  | 'Lab Completed'
  | 'Pharmacy Pending'
  | 'Completed'
  | 'Discharged';

export interface Patient {
  id: string;
  cardNumber: string; // e.g. ETH-CARD-10023
  fullName: string;
  phone: string;
  age: number;
  gender: Gender;
  bloodType?: string;
  emergencyContact: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  cardFeePaid: boolean;
  cardFeeAmount: number; // in ETB
  paymentMethod?: PaymentMethod;
  status: PatientStatus;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  cardNumber?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  paymentPaid: boolean;
  paymentAmount: number;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  createdAt: string;
}

export interface Vitals {
  bp: string; // e.g., 120/80
  temp: number; // in Celsius
  pulse: number; // bpm
  weight: number; // kg
  spo2: number; // %
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientCardNumber: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  vitals?: Vitals;
  symptoms: string;
  diagnosis: string;
  doctorNotes?: string;
  createdAt: string;
}

export type LabTestStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface LabTest {
  id: string;
  medicalRecordId: string;
  patientId: string;
  patientCardNumber: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testCategory: string; // e.g., Hematology, Serology, Parasitology, Biochemistry
  testName: string; // e.g. Widal Test, CBC, Malaria Blood Film
  status: LabTestStatus;
  results?: string;
  referenceRange?: string;
  unit?: string;
  labTechNotes?: string;
  requestedAt: string;
  completedAt?: string;
  priceETB: number;
}

export interface PrescriptionItem {
  medicineId?: string;
  medicineName: string;
  dosage: string; // e.g., 500mg
  frequency: string; // e.g., BID (twice daily)
  duration: string; // e.g., 5 Days
  quantity: number;
  unitPriceETB: number;
  totalPriceETB: number;
}

export interface Prescription {
  id: string;
  medicalRecordId: string;
  patientId: string;
  patientCardNumber: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  items: PrescriptionItem[];
  totalAmountETB: number;
  isDispensed: boolean;
  paymentStatus: 'PENDING' | 'PAID';
  paymentMethod?: PaymentMethod;
  dispensedAt?: string;
  createdAt: string;
}

export interface MedicineStock {
  id: string;
  medicineName: string;
  category: string;
  stockLevel: number;
  unit: string; // e.g. Tabs, Bottles, Vials, Ampoules
  reorderPoint: number;
  unitPriceETB: number;
  batchNumber: string;
  expiryDate: string;
  location: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'SMS' | 'LAB_RESULT' | 'PRESCRIPTION' | 'APPOINTMENT' | 'STOCK_ALERT';
  targetRole?: UserRole;
  patientPhone?: string;
  timestamp: string;
  read: boolean;
}

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  phone: string;
  status: 'Active' | 'On Duty' | 'Off Duty';
  avatar?: string; // Icon or avatar identifier e.g. 'doctor-m', 'doctor-f', 'lab', 'pharm', 'admin', 'user-check'
  lastLogin?: string;
}

export interface FinancialAdjustment {
  id: string;
  title: string;
  amountETB: number;
  type: 'INCOME_ADD' | 'INCOME_DEDUCT';
  category: 'CONSULTATION_TARIFF' | 'CARD_TARIFF' | 'GOVT_SUBSIDY' | 'EXPENSE' | 'RECONCILIATION_CORRECTION' | 'OTHER';
  note: string;
  date: string;
  createdBy: string;
}

