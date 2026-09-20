export type AvailabilityRequest = {
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
};

export type BookingRequest = AvailabilityRequest & {
  name: string;
  email: string;
};

export type AvailableSlot = AvailabilityRequest;

export type AvailabilityResponse = {
  success: boolean;
  available_slots: AvailableSlot[];
  message?: string;
};

export type BookingResponse = {
  success: boolean;
  event_id?: string;
  message?: string;
};