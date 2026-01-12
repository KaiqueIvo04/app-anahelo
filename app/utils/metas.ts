import type { MovementType } from "~/types/enums/movement_type";

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
