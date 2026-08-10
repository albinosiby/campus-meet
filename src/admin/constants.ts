import type { Dietary, Gender, PaymentStatus, YearOfStudy, Zone } from "./types";

export const ZONE_LABELS: Record<Zone, string> = {
  kannur: "Kannur",
  kasargod: "Kasargod",
  thalassery: "Thalassery",
  kozhikode: "Kozhikode",
  mananthavady: "Mananthavady",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
};

export const YEAR_LABELS: Record<YearOfStudy, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
  "5": "5th Year",
  pg: "PG",
};

export const DIETARY_LABELS: Record<Dietary, string> = {
  none: "No preference",
  veg: "Vegetarian",
  nonveg: "Non-Vegetarian",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  pending: "Pending",
};

export const ZONE_COLORS: Record<Zone, string> = {
  kannur: "#c8a44e",
  kasargod: "#3b82c4",
  thalassery: "#e0ba5a",
  kozhikode: "#7c9eb2",
  mananthavady: "#8b6f47",
};

export const GENDER_COLORS: Record<Gender, string> = {
  male: "#3b82c4",
  female: "#c8a44e",
};

export const YEAR_COLORS: Record<YearOfStudy, string> = {
  "1": "#c8a44e",
  "2": "#3b82c4",
  "3": "#e0ba5a",
  "4": "#7c9eb2",
  "5": "#9a7b3a",
  pg: "#b8b0a2",
};

export const DIETARY_COLORS: Record<Dietary, string> = {
  none: "#b8b0a2",
  veg: "#6b9b6e",
  nonveg: "#c8a44e",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: "#6b9b6e",
  unpaid: "#c45c5c",
  pending: "#c8a44e",
};

export const COLLEGE_COLORS = [
  "#c8a44e",
  "#3b82c4",
  "#e0ba5a",
  "#7c9eb2",
  "#9a7b3a",
  "#b8b0a2",
  "#6b9b6e",
  "#a67c52",
];
