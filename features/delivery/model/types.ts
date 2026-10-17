export type DeliveryTimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  label: string | null;
};

export type DeliveryScheduleDay = {
  id: string;
  date: string;
  timeSlots: DeliveryTimeSlot[];
};

export type AvailableDeliverySchedule = {
  minimumLeadDays: number;
  earliestDate: string;
  latestDate: string;
  days: DeliveryScheduleDay[];
};

export type DeliveryScheduleSettings = {
  minimumLeadDays: number;
  bookingWindowDays: number;
};

export type DeliveryTimeSlotInput = {
  startTime: string;
  endTime: string;
  label: string | null;
};
