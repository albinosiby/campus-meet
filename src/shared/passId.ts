/** Short pass code shown on event passes and in admin. */
export function formatPassId(registrationId: string): string {
  return registrationId.slice(0, 8).toUpperCase();
}

export function passQrPayload(registrationId: string): string {
  return `MALABAR-CAMPUS-MEET-2026:${registrationId}`;
}
