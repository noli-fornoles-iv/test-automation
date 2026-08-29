/**
 * AFW-3953 — Appointment Slot Selected Rudderstack expectations.
 * Sources: https://purposebrands.atlassian.net/browse/AFW-3953
 *          Testpad 27590 (AFW-3953 blocks under bookable flows)
 *
 * Date Selected / Time Selected were removed Aug 3 — only Slot Selected remains.
 * form_id = Visit_location_walkthrough (not appointment_visit — that is Lead Captured).
 */
export const APPOINTMENT_SLOT_SELECTED_EVENT = 'Appointment Slot Selected';

export type AppointmentSlotTrackingAssertions = {
  appointmentType: string;
  serviceOffer: string;
  serviceName: string;
  /** Exact or substring match (Testpad allows BAT variant suffix). */
  serviceType: string;
  formId: string;
  /** Forbid legacy date / time / appointment_start_at keys. */
  forbidLegacyDateTimeFields: boolean;
};

/** Shared across all bookable flows (BAT, MI, TUF, AFP, Invite, Events, Local, MCO). */
export function toAppointmentSlotTracking(): AppointmentSlotTrackingAssertions {
  return {
    appointmentType: 'Visit',
    serviceOffer: 'location_walkthrough',
    serviceName: 'Book a Visit',
    serviceType: 'Book a Visit',
    formId: 'Visit_location_walkthrough',
    forbidLegacyDateTimeFields: true,
  };
}
