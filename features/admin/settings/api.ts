import { adminRequest } from "@/features/admin/shared/api";
import type {
  CheckoutSettings,
  UpdateCheckoutSettingsInput,
} from "@/features/admin/settings/types";

export const settingsAdminApi = {
  getCheckout: () => adminRequest<CheckoutSettings>("settings/checkout"),

  updateCheckout: (input: UpdateCheckoutSettingsInput) =>
    adminRequest<CheckoutSettings>("settings/checkout", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
};
