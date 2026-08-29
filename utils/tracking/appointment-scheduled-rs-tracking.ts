/**
 * AFW-3954 — Appointment Scheduled Rudderstack expectations.
 * Sources: https://purposebrands.atlassian.net/browse/AFW-3954
 *          Testpad 27590 (AFW-3954 blocks under bookable flows)
 *
 * Aug 5/6: remove appointment_start_at; add utc/local timestamps;
 * appointment_day_of_week + appointment_time_of_day from gym local time.
 * form_id = Visit_location_walkthrough (same as Slot Selected).
 */
export type AppointmentScheduledTrackingAssertions = {
  appointmentType: string;
  serviceOffer: string;
  serviceName: string;
  /** Exact or substring match (Testpad allows BAT variant suffix). */
  serviceType: string;
  formId: string;
  paymentRequired: false;
  channel: string;
  /** Forbid appointment_start_at / order_id / service_id on this event. */
  forbidLegacyFields: boolean;
};

/** Shared across all bookable flows (BAT, MI, TUF, AFP, Invite, Events, Local, MCO). */
export function toAppointmentScheduledTracking(): AppointmentScheduledTrackingAssertions {
  return {
    appointmentType: 'Visit',
    serviceOffer: 'location_walkthrough',
    serviceName: 'Book a Visit',
    serviceType: 'Book a Visit',
    formId: 'Visit_location_walkthrough',
    paymentRequired: false,
    channel: 'web',
    forbidLegacyFields: true,
  };
}
