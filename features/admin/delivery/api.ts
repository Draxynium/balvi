import { adminRequest } from "@/features/admin/shared/api";
import type {
  DeliveryScheduleDay,
  DeliveryScheduleSettings,
  DeliveryTimeSlotInput,
} from "@/features/delivery/model/types";

function withSeconds(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

export const adminDeliveryApi = {
  getSettings: () =>
    adminRequest<DeliveryScheduleSettings>("delivery-schedule/settings"),

  updateSettings: (settings: DeliveryScheduleSettings) =>
    adminRequest<DeliveryScheduleSettings>("delivery-schedule/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  listDays: (from: string, to: string) =>
    adminRequest<DeliveryScheduleDay[]>(
      `delivery-schedule/days?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),

  upsertDay: (date: string, timeSlots: DeliveryTimeSlotInput[]) =>
    adminRequest<DeliveryScheduleDay>(`delivery-schedule/days/${date}`, {
      method: "PUT",
      body: JSON.stringify({
        timeSlots: timeSlots.map((slot) => ({
          ...slot,
          startTime: withSeconds(slot.startTime),
          endTime: withSeconds(slot.endTime),
          label: slot.label?.trim() || null,
        })),
      }),
    }),

  deleteDay: (date: string) =>
    adminRequest<void>(`delivery-schedule/days/${date}`, {
      method: "DELETE",
    }),
};
