export interface RegistrationDraft {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  college: string;
  course: string;
  year: string;
  zone: string;
  diocese: string;
  dietary: string;
  amountPaid: string;
  transactionId: string;
}

export const EMPTY_REGISTRATION_DRAFT: RegistrationDraft = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  college: "",
  course: "",
  year: "",
  zone: "",
  diocese: "",
  dietary: "none",
  amountPaid: "",
  transactionId: "",
};

const DRAFT_STORAGE_KEY = "malabar-campus-meet-registration-draft-v3";

export function loadRegistrationDraft(): RegistrationDraft {
  if (typeof window === "undefined") return EMPTY_REGISTRATION_DRAFT;
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return EMPTY_REGISTRATION_DRAFT;
    const parsed = JSON.parse(raw) as Partial<RegistrationDraft>;
    return {
      ...EMPTY_REGISTRATION_DRAFT,
      ...parsed,
      // Never restore a prefilled fee — amount must be entered each time.
      amountPaid: "",
    };
  } catch {
    return EMPTY_REGISTRATION_DRAFT;
  }
}

export function saveRegistrationDraft(draft: RegistrationDraft): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearRegistrationDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}
