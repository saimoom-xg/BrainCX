import type { AvailabilityRequest, AvailabilityResponse, BookingRequest, BookingResponse } from '@/types/calendar';
import { getCalendarConfig } from './config';

async function postWebhook<T>(url: string, payload: unknown): Promise<T> {
  if (!url) throw new Error('Calendar integration is not configured.');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Calendar service returned ${response.status}.`);
  return response.json() as Promise<T>;
}

export async function checkAvailability(payload: AvailabilityRequest): Promise<AvailabilityResponse> {
  const result = await postWebhook<Partial<AvailabilityResponse>>(getCalendarConfig().availabilityUrl, payload);
  return {
    success: result.success === true,
    available_slots: Array.isArray(result.available_slots) ? result.available_slots : [],
    message: result.message,
  };
}

export async function createBooking(payload: BookingRequest): Promise<BookingResponse> {
  const result = await postWebhook<Partial<BookingResponse>>(getCalendarConfig().bookingUrl, payload);
  return { success: result.success === true, event_id: result.event_id, message: result.message };
}