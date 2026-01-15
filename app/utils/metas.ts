import type { MovementType } from "~/types/enums/movement_type";
import type { PaymentMethod } from "~/types/enums/payment_method";

export const movementTypeMeta: Record<
  MovementType,
  {
    label: string;
    badge: string;
    icon: string;
  }
> = {
  buy: {
    label: "Entrada",
    badge: "badge-success",
    icon: "arrow_downward",
  },
  sell: {
    label: "Saída",
    badge: "badge-error",
    icon: "arrow_upward",
  },
  adjust: {
    label: "Ajuste",
    badge: "badge-warning",
    icon: "tune",
  },
};

export const paymentMethodMeta: Record<PaymentMethod, string> = {
  money: "Dinheiro",
  card: "Cartão",
  pix: "PIX"
}
