export type Zone =
  | "kannur"
  | "kasargod"
  | "thalassery"
  | "kozhikode"
  | "mananthavady";
export type Gender = "male" | "female";
export type YearOfStudy = "1" | "2" | "3" | "4" | "5" | "pg";
export type Dietary = "none" | "veg" | "nonveg";
export type PaymentStatus = "paid" | "unpaid" | "pending";

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  college: string;
  course: string;
  year: YearOfStudy;
  zone: Zone;
  diocese: string;
  dietary: Dietary;
  amount: number;
  transactionId: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type RegistrationInput = Omit<Registration, "id" | "createdAt">;

export interface ChartSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  total: number;
  today: number;
  thisWeek: number;
  paidCount: number;
  unpaidCount: number;
  pendingCount: number;
  amountReceived: number;
  amountPending: number;
  amountExpected: number;
  zones: ChartSlice[];
  genders: ChartSlice[];
  years: ChartSlice[];
  dietary: ChartSlice[];
  topColleges: ChartSlice[];
  payments: ChartSlice[];
}
