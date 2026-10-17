import { apiRequest } from "@/lib/api/client";
import type { AvailableDeliverySchedule } from "@/features/delivery/model/types";

export const deliveryApi = {
  getAvailable: () =>
    apiRequest<AvailableDeliverySchedule>("delivery-schedule/available"),
};
