# n8n calendar setup

Create two separate workflows. Both should use a production-safe webhook URL and the Google Calendar credential should exist only in n8n.

## Availability workflow

1. Add a **Webhook** node with `POST` and the path used for `N8N_AVAILABILITY_WEBHOOK_URL`.
2. Read `date`, `start_time`, `end_time`, and `timezone` from the JSON body.
3. Query the target Google Calendar for events covering the requested date and time range, converting the request into the supplied IANA timezone.
4. Calculate free meeting slots in the requested range. Return only slots that are actually free.
5. Add a **Respond to Webhook** node returning JSON in this shape:

```json
{
  "success": true,
  "available_slots": [
    { "date": "2026-09-24", "start_time": "15:00", "end_time": "15:30", "timezone": "Asia/Dhaka" }
  ]
}
```

For an upstream failure, return `success: false`, an empty `available_slots` array, and a human-readable `message`. Never return guessed slots.

## Booking workflow

1. Add a **Webhook** node with `POST` and the path used for `N8N_BOOKING_WEBHOOK_URL`.
2. Validate `name`, `email`, `date`, `start_time`, `end_time`, and `timezone`.
3. Optionally re-check the requested slot immediately before creating the event to prevent a race with another booking.
4. Use a Google Calendar **Create Event** node with the supplied timezone and meeting details.
5. Return this JSON only after Google Calendar confirms creation:

```json
{
  "success": true,
  "event_id": "calendar-event-id",
  "message": "Booking created successfully"
}
```

On validation, calendar, or credential failure return `success: false` and do not include an event ID. The voice assistant must not confirm a meeting for any response other than an explicit successful response.

## Application routes

The browser never calls n8n directly. The Next.js routes validate and normalize responses:

- `POST /api/calendar/availability` forwards the availability request to `N8N_AVAILABILITY_WEBHOOK_URL`.
- `POST /api/calendar/booking` forwards the booking request to `N8N_BOOKING_WEBHOOK_URL`.

The centralized parsing and forwarding code is in `lib/calendar.ts`, so a different n8n response shape can be adapted in one place.