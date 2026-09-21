export const publicConfig = {
  vapiPublicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? '',
  vapiAssistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? '',
  siteUrl: process.env.NEXT_PUBLIC_BRAINCX_SITE_URL ?? '',
};

export function getCalendarConfig() {
  return {
    availabilityUrl: process.env.N8N_AVAILABILITY_WEBHOOK_URL ?? '',
    bookingUrl: process.env.N8N_BOOKING_WEBHOOK_URL ?? '',
  };
}