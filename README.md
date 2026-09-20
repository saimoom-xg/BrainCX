# BrainCX Voice Agent

A small Next.js demo for a natural BrainCX voice conversation. Vapi provides the browser voice session; two same-origin API routes proxy calendar requests to n8n, keeping Google Calendar credentials out of the browser. There is no database or authentication layer.

## Requirements

- Node.js 18.17 or newer
- A Vapi public key and configured assistant
- Two n8n webhook URLs connected to Google Calendar

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The page intentionally remains usable before credentials are added and shows a setup message when voice configuration is missing.

## Environment variables

| Variable | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Browser-safe Vapi public key |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Browser-safe Vapi assistant ID |
| `N8N_AVAILABILITY_WEBHOOK_URL` | Server-only availability webhook |
| `N8N_BOOKING_WEBHOOK_URL` | Server-only booking webhook |
| `NEXT_PUBLIC_BRAINCX_SITE_URL` | Canonical site URL for deployment/integrations |

Never put Google credentials, n8n credentials, or a private Vapi key in a `NEXT_PUBLIC_` variable.

## Vapi setup

Create an assistant in Vapi and use the system prompt in [`docs/braincx-system-prompt.txt`](docs/braincx-system-prompt.txt). Configure the two function tools with the schemas in [`lib/vapi-tools.ts`](lib/vapi-tools.ts). The tool implementation should POST to the deployed routes `/api/calendar/availability` and `/api/calendar/booking`. The assistant must wait for a successful tool response before offering a slot or confirming a booking.

The browser call surface is isolated in [`components/VoiceAgent.tsx`](components/VoiceAgent.tsx). It handles connecting, listening, speaking, ending, missing configuration, microphone errors, and connection errors without exposing raw exceptions.

## n8n and Google Calendar

Follow [`docs/n8n-calendar-setup.md`](docs/n8n-calendar-setup.md). n8n is the only layer that should hold Google OAuth credentials. The application does not invent availability and treats a booking as successful only when the webhook returns `success: true`.

## Local testing

With Vapi configured, test the button with microphone permission enabled. Test the calendar routes with real n8n test webhooks using the request examples in the documentation. Verify both a rejected booking and a successful event in Google Calendar. Do not use mocked success responses for an assessment recording.

```bash
npm run build
npm start
```

## Vercel deployment

Import the repository into Vercel, add the five variables from `.env.example`, and redeploy after changing any value. Use production n8n webhook URLs and configure the Vapi assistant to call the deployed route origin.

## Known limitations

The assistant configuration and n8n workflows are external services and are not provisioned by this repository. The UI can demonstrate setup and voice error states without them, but live conversation and calendar actions require real credentials and webhook responses.