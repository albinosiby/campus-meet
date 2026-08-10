import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
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

export async function getRegistrations(): Promise<Registration[]> {
  const registrationsQuery = query(
    collection(getFirebaseDb(), REGISTRATIONS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(registrationsQuery);
  return snapshot.docs.map(mapRegistration);
}

export async function addRegistration(
  input: RegistrationInput
): Promise<Registration> {
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(
    collection(getFirebaseDb(), REGISTRATIONS_COLLECTION),
    {
      ...input,
      createdAt,
      createdAtServer: serverTimestamp(),
    }
  );

  return {
    ...input,
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
