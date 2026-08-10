import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  getFirebaseDb,
  REGISTRATIONS_COLLECTION,
} from "@/shared/firebase/client";
import type { PaymentStatus, Registration, RegistrationInput } from "./types";

function mapRegistration(
  snapshot: QueryDocumentSnapshot<DocumentData>
): Registration {
  const data = snapshot.data();
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
    amount: Number(data.amount ?? 0),
    transactionId: String(data.transactionId ?? ""),
    paymentStatus: (data.paymentStatus as PaymentStatus) ?? "unpaid",
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : data.createdAt?.toDate?.()?.toISOString?.() ??
          new Date().toISOString(),
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

  // Fallback for older records saved with mixed-case email
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
    rows.find((r) => r.paymentStatus === "unpaid") ??
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
  const payload = {
    ...input,
    email: normalizeEmail(input.email),
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

export async function submitRegistrationPayment(
  id: string,
  transactionId: string
): Promise<void> {
  const txn = transactionId.trim();
  if (txn.length < 6) {
    throw new Error("Transaction ID must be at least 6 characters.");
  }

  await updateDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id), {
    transactionId: txn,
    paymentStatus: "pending" as PaymentStatus,
  });
}

export async function deleteRegistration(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), REGISTRATIONS_COLLECTION, id));
}
