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

export type PaymentMethod = "upi" | "cash";

export interface PaymentRecord {
  amount: number;
  transactionId: string;
  /** ISO timestamp when this installment was recorded. */
  paidAt: string;
  source?: "register" | "payment" | "admin";
  method?: PaymentMethod;
}

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
  /** Total amount paid so far (sum of payments). */
  amount: number;
  /** Latest transaction ID (convenience / legacy). */
  transactionId: string;
  paymentStatus: PaymentStatus;
  paymentVerified: boolean;
  paymentVerifiedAt?: string;
  verifiedAmount?: number;
  checkedIn: boolean;
  checkedInAt?: string;
  /** Chronological payment installments. */
  payments: PaymentRecord[];
  createdAt: string;
}

export type RegistrationInput = Omit<
  Registration,
  | "id"
  | "createdAt"
  | "paymentVerified"
  | "paymentVerifiedAt"
  | "verifiedAmount"
  | "checkedIn"
  | "checkedInAt"
> &
  Partial<
    Pick<
      Registration,
      | "paymentVerified"
      | "paymentVerifiedAt"
      | "verifiedAmount"
      | "checkedIn"
      | "checkedInAt"
    >
  >;

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
  zones: ChartSlice[];
  genders: ChartSlice[];
  years: ChartSlice[];
  dietary: ChartSlice[];
  topColleges: ChartSlice[];
  payments: ChartSlice[];
}
