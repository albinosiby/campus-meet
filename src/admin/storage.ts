import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  getFirebaseDb,
  REGISTRATIONS_COLLECTION,
} from "@/shared/firebase/client";
import {
  amountRemaining,
  cashTransactionId,
  createPaymentRecord,
  derivePaymentStatus,
  isFullyPaid,
  normalizePayments,
  sumPayments,
  upiTransactionIdError,
} from "./payment";
import type {
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  Registration,
  RegistrationInput,
} from "./types";

function assertValidUpiTransactionId(transactionId: string) {
  const error = upiTransactionIdError(transactionId);
  if (error) throw new Error(error);
}

function mapRegistration(
  snapshot: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData }
): Registration {
  const data = snapshot.data();
  const createdAt =
    typeof data.createdAt === "string"
      ? data.createdAt
      : data.createdAt?.toDate?.()?.toISOString?.() ??
        new Date().toISOString();

  const amount = Number(data.amount ?? 0);
  const transactionId = String(data.transactionId ?? "");
  const payments = normalizePayments(data.payments, {
    amount,
    transactionId,
    paidAt: createdAt,
  });
  const totalPaid = payments.length > 0 ? sumPayments(payments) : 0;
  const storedStatus = (data.paymentStatus as PaymentStatus) ?? "unpaid";
  const paymentStatus: PaymentStatus =
    totalPaid <= 0
      ? "unpaid"
      : storedStatus === "paid" && isFullyPaid(totalPaid)
        ? "paid"
        : "pending";

  return {
    id: snapshot.id,
    fullName: String(data.fullName ?? ""),
    email: typeof data.email === "string" && data.email ? data.email : null,
    phone: String(data.phone ?? ""),
    gender: data.gender,
    college: String(data.college ?? ""),
    course: typeof data.course === "string" && data.course ? data.course : null,
    year: data.year ?? null,
    zone: data.zone,
    diocese: typeof data.diocese === "string" && data.diocese ? data.diocese : null,
    dietary: data.dietary ?? null,
    amount: totalPaid,
    transactionId:
      payments[payments.length - 1]?.transactionId || transactionId,
    paymentStatus,
    paymentVerified: data.paymentVerified === true,
    paymentVerifiedAt:
      typeof data.paymentVerifiedAt === "string"
        ? data.paymentVerifiedAt
        : undefined,
    verifiedAmount:
      typeof data.verifiedAmount === "number"
        ? data.verifiedAmount
        : undefined,
    checkedIn: Boolean(data.checkedIn),
    checkedInAt:
      typeof data.checkedInAt === "string" ? data.checkedInAt : undefined,
    payments,
    createdAt,
  };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getRegistrations(): Promise<Registration[]> {
  const registrationsQuery = query(
    collection(getFirebaseDb(), REGISTRATIONS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(registrationsQuery);
  return snapshot.docs.map(mapRegistration);
}

export async function getRegistrationById(
  id: string
): Promise<Registration | null> {
  const snapshot = await getDoc(
    doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id)
  );
  if (!snapshot.exists()) return null;
  return mapRegistration(snapshot);
}

export async function findRegistrationByEmail(
  email: string
): Promise<Registration | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const emailQuery = query(
    collection(getFirebaseDb(), REGISTRATIONS_COLLECTION),
    where("email", "==", normalized),
    limit(5)
  );
  let snapshot = await getDocs(emailQuery);

  if (snapshot.empty) {
    const trimmed = email.trim();
    if (trimmed !== normalized) {
      snapshot = await getDocs(
        query(
          collection(getFirebaseDb(), REGISTRATIONS_COLLECTION),
          where("email", "==", trimmed),
          limit(5)
        )
      );
    }
  }

  if (snapshot.empty) return null;

  const rows = snapshot.docs.map(mapRegistration);
  const preferred =
    rows.find((r) => amountRemaining(r.amount) > 0) ??
    rows.find((r) => r.paymentStatus === "pending") ??
    [...rows].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  return preferred ?? null;
}

export async function addRegistration(
  input: RegistrationInput
): Promise<Registration> {
  const createdAt = new Date().toISOString();
  const email =
    input.email && input.email.trim() ? normalizeEmail(input.email) : null;
  if (email) {
    const existing = await findRegistrationByEmail(email);
    if (existing) {
      throw new Error(
        "This email is already registered. Please use the payment page to pay any remaining amount."
      );
    }
  }
  const payments =
    input.payments?.length > 0
      ? input.payments
      : input.amount > 0
        ? [
            createPaymentRecord({
              amount: input.amount,
              transactionId: input.transactionId,
              source: "register",
              paidAt: createdAt,
            }),
          ]
        : [];
  const latestTxn = payments[payments.length - 1]?.transactionId ?? "";
  if (latestTxn && !latestTxn.startsWith("CASH-")) {
    assertValidUpiTransactionId(latestTxn);
  }
  const amount = sumPayments(payments);
  const payload = {
    ...input,
    email,
    course: input.course?.trim() ? input.course.trim() : null,
    year: input.year || null,
    diocese: input.diocese?.trim() ? input.diocese.trim() : null,
    dietary: input.dietary || null,
    amount,
    transactionId: payments[payments.length - 1]?.transactionId ?? "",
    payments,
    paymentStatus: input.paymentStatus || derivePaymentStatus(amount),
    paymentVerified: Boolean(input.paymentVerified),
    paymentVerifiedAt: input.paymentVerifiedAt ?? "",
    verifiedAmount: input.verifiedAmount ?? 0,
    checkedIn: Boolean(input.checkedIn),
    checkedInAt: input.checkedInAt ?? "",
    createdAt,
    createdAtServer: serverTimestamp(),
  };
  const docRef = await addDoc(
    collection(getFirebaseDb(), REGISTRATIONS_COLLECTION),
    payload
  );

  return {
    ...input,
    email: payload.email,
    amount,
    transactionId: payload.transactionId,
    payments,
    paymentStatus: payload.paymentStatus,
    paymentVerified: payload.paymentVerified,
    paymentVerifiedAt: payload.paymentVerifiedAt,
    verifiedAmount: payload.verifiedAmount,
    checkedIn: payload.checkedIn,
    checkedInAt: payload.checkedInAt,
    id: docRef.id,
    createdAt,
  };
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), {
    paymentStatus,
    paymentVerified: paymentStatus === "paid",
    paymentVerifiedAt:
      paymentStatus === "paid" ? new Date().toISOString() : "",
  });
}

export interface EventDayUpdateInput {
  paymentStatus?: PaymentStatus;
  paymentVerified?: boolean;
  paymentVerifiedAt?: string;
  verifiedAmount?: number;
  checkedIn?: boolean;
  checkedInAt?: string;
}

/** Admin: update event-day verification/check-in fields on a registration. */
export async function updateEventDayStatus(
  id: string,
  input: EventDayUpdateInput
): Promise<void> {
  const payload: Record<string, unknown> = {};

  if (input.paymentStatus) {
    payload.paymentStatus = input.paymentStatus;
  }
  if (typeof input.paymentVerified === "boolean") {
    payload.paymentVerified = input.paymentVerified;
  }
  if (typeof input.paymentVerifiedAt === "string") {
    payload.paymentVerifiedAt = input.paymentVerifiedAt;
  }
  if (typeof input.verifiedAmount === "number") {
    if (!Number.isFinite(input.verifiedAmount) || input.verifiedAmount < 0) {
      throw new Error("Enter a valid verified amount.");
    }
    payload.verifiedAmount = input.verifiedAmount;
  }
  if (typeof input.checkedIn === "boolean") {
    payload.checkedIn = input.checkedIn;
  }
  if (typeof input.checkedInAt === "string") {
    payload.checkedInAt = input.checkedInAt;
  }

  if (Object.keys(payload).length === 0) return;

  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), payload);
}

export interface PaymentUpdateInput {
  paymentStatus: PaymentStatus;
  amount?: number;
  transactionId?: string;
  payments?: PaymentRecord[];
}

/** Admin: set status and optionally rewrite payment totals / history. */
export async function updatePayment(
  id: string,
  input: PaymentUpdateInput
): Promise<void> {
  const payload: Record<string, unknown> = {
    paymentStatus: input.paymentStatus,
  };

  if (typeof input.amount === "number") {
    if (!Number.isFinite(input.amount) || input.amount < 0) {
      throw new Error("Enter a valid amount.");
    }
    payload.amount = input.amount;
  }

  if (typeof input.transactionId === "string") {
    payload.transactionId = input.transactionId.trim();
  }

  if (input.payments) {
    payload.payments = input.payments;
    payload.amount = sumPayments(input.payments);
    payload.transactionId =
      input.payments[input.payments.length - 1]?.transactionId ?? "";
  }

  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), payload);
}

/** Student: append an installment toward the fee. */
export async function appendRegistrationPayment(
  id: string,
  amount: number,
  transactionId: string,
  method: PaymentMethod = "upi"
): Promise<Registration> {
  const isCash = method === "cash";
  const txn = isCash ? cashTransactionId() : transactionId.trim();
  if (!isCash) {
    assertValidUpiTransactionId(txn);
  }
  if (!Number.isFinite(amount) || amount < 1) {
    throw new Error("Enter a valid payment amount.");
  }

  const current = await getRegistrationById(id);
  if (!current) {
    throw new Error("Registration not found.");
  }
  if (current.paymentStatus === "paid" && isFullyPaid(current.amount)) {
    throw new Error("This registration is already fully paid.");
  }

  const remaining = amountRemaining(current.amount);
  if (remaining <= 0) {
    throw new Error(
      "Fee is already fully paid. Waiting for admin verification."
    );
  }
  if (amount > remaining) {
    throw new Error(`You can pay at most ₹${remaining} remaining.`);
  }

  const nextPayment = createPaymentRecord({
    amount,
    transactionId: txn,
    source: "payment",
    method: isCash ? "cash" : "upi",
  });
  const payments = [...current.payments, nextPayment];
  const totalPaid = sumPayments(payments);

  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), {
    payments,
    amount: totalPaid,
    transactionId: txn,
    paymentStatus: "pending" as PaymentStatus,
  });

  return {
    ...current,
    payments,
    amount: totalPaid,
    transactionId: txn,
    paymentStatus: "pending",
  };
}

/** @deprecated Prefer appendRegistrationPayment for installments. */
export async function submitRegistrationPayment(
  id: string,
  transactionId: string
): Promise<void> {
  const current = await getRegistrationById(id);
  if (!current) throw new Error("Registration not found.");
  const remaining = amountRemaining(current.amount);
  const payAmount = remaining > 0 ? remaining : current.amount || 0;
  if (payAmount < 1) {
    await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), {
      transactionId: transactionId.trim(),
      paymentStatus: "pending" as PaymentStatus,
    });
    return;
  }
  await appendRegistrationPayment(id, payAmount, transactionId);
}

/** Admin: record a cash / UPI installment without changing online verify status. */
export async function appendAdminPayment(
  id: string,
  amount: number,
  transactionId?: string,
  method: PaymentMethod = "cash"
): Promise<Registration> {
  const current = await getRegistrationById(id);
  if (!current) throw new Error("Registration not found.");

  const remaining = amountRemaining(current.amount);
  if (remaining <= 0) {
    throw new Error("Fee is already fully paid for this registration.");
  }
  if (!Number.isFinite(amount) || amount < 1) {
    throw new Error("Enter a valid amount.");
  }
  const payAmount = Math.min(amount, remaining);
  const isCash = method === "cash";
  const txn = (transactionId ?? "").trim();
  if (!isCash) {
    assertValidUpiTransactionId(txn);
  }

  const nextPayment = createPaymentRecord({
    amount: payAmount,
    transactionId: isCash ? cashTransactionId() : txn,
    source: "admin",
    method: isCash ? "cash" : "upi",
  });

  const payments = [...current.payments, nextPayment];
  const totalPaid = sumPayments(payments);

  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), {
    payments,
    amount: totalPaid,
    transactionId: nextPayment.transactionId,
    paymentStatus: "pending" as PaymentStatus,
  });

  return {
    ...current,
    payments,
    amount: totalPaid,
    transactionId: nextPayment.transactionId,
    paymentStatus: "pending",
  };
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    await deleteDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id));
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "permission-denied") {
      throw new Error(
        "Delete blocked by Firestore rules. Publish firestore.rules (allow delete) in Firebase Console or run: npm run deploy:rules"
      );
    }
    throw error instanceof Error
      ? error
      : new Error("Could not delete registration.");
  }
}
