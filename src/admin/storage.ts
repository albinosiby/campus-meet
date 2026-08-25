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
  createPaymentRecord,
  derivePaymentStatus,
  isFullyPaid,
  normalizePayments,
  sumPayments,
} from "./payment";
import type {
  PaymentRecord,
  PaymentStatus,
  Registration,
  RegistrationInput,
} from "./types";

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
  const totalPaid = payments.length > 0 ? sumPayments(payments) : amount;

  return {
    id: snapshot.id,
    fullName: String(data.fullName ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    gender: data.gender,
    college: String(data.college ?? ""),
    course: String(data.course ?? ""),
    year: data.year,
    zone: data.zone,
    diocese: String(data.diocese ?? ""),
    dietary: data.dietary ?? "none",
    amount: totalPaid,
    transactionId:
      payments[payments.length - 1]?.transactionId || transactionId,
    paymentStatus: (data.paymentStatus as PaymentStatus) ?? "unpaid",
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
  const amount = sumPayments(payments);
  const payload = {
    ...input,
    email: normalizeEmail(input.email),
    amount,
    transactionId: payments[payments.length - 1]?.transactionId ?? "",
    payments,
    paymentStatus: input.paymentStatus || derivePaymentStatus(amount),
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
  });
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
  transactionId: string
): Promise<Registration> {
  const txn = transactionId.trim();
  if (txn.length < 8) {
    throw new Error("Transaction ID must be at least 8 characters.");
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

/** Admin: record a cash / manual installment. */
export async function appendAdminPayment(
  id: string,
  amount: number,
  transactionId?: string
): Promise<void> {
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
  const txn = (transactionId ?? "").trim();
  const nextPayment = createPaymentRecord({
    amount: payAmount,
    transactionId: txn.length >= 8 ? txn : `CASH-${Date.now()}`,
    source: "admin",
  });
  // Firestore create rule requires txn >= 8; admin cash uses CASH- prefix.
  if (nextPayment.transactionId.length < 8) {
    nextPayment.transactionId = `CASH-${Date.now()}`;
  }

  const payments = [...current.payments, nextPayment];
  const totalPaid = sumPayments(payments);
  const fully = isFullyPaid(totalPaid);

  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), {
    payments,
    amount: totalPaid,
    transactionId: nextPayment.transactionId,
    paymentStatus: (fully ? "paid" : "pending") as PaymentStatus,
  });
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
