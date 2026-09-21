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

export async function checkAvailability(rawPayload: Partial<AvailabilityRequest>): Promise<AvailabilityResponse> {
  const payload: AvailabilityRequest = {
    date: rawPayload.date || new Date().toISOString().split('T')[0],
    start_time: rawPayload.start_time || '09:00',
    end_time: rawPayload.end_time || '17:00',
    timezone: rawPayload.timezone || 'Asia/Dhaka',
  };

  const result = await postWebhook<any>(getCalendarConfig().availabilityUrl, payload);
  return {
    success: result.success === true,
    available_slots: Array.isArray(result.available_slots) ? result.available_slots : [],
    message: result.message,
  };
}

export async function createBooking(rawPayload: any): Promise<BookingResponse> {
  const startTime = rawPayload.start_time || rawPayload.time || '10:00';
  let endTime = rawPayload.end_time;
  if (!endTime) {
    const parts = startTime.split(':').map(Number);
    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
      const endM = parts[1] + 30;
      const endH = parts[0] + Math.floor(endM / 60);
      endTime = `${String(endH % 24).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;
    } else {
      endTime = '10:30';
    }
  }

  const payload: BookingRequest = {
    name: rawPayload.name || 'Caller',
    email: rawPayload.email || 'customer@example.com',
    date: rawPayload.date || new Date().toISOString().split('T')[0],
    start_time: startTime,
    end_time: endTime,
    timezone: rawPayload.timezone || 'Asia/Dhaka',
  };

  const result = await postWebhook<any>(getCalendarConfig().bookingUrl, payload);
  const success = result.success === true || result.status === 'confirmed' || !!result.id;
  const eventId = result.event_id || result.id;
  return {
    success,
    event_id: eventId,
    message: result.message || (success ? 'Booking confirmed successfully.' : 'Booking could not be created.'),
  };
}