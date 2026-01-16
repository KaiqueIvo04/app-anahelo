<template>
  <div class="card bg-base-100 shadow-md p-6 space-y-4">
    <h2 class="text-lg font-semibold border-b pb-2">
      Detalhes da Movimentação
    </h2>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-sm text-gray-500">Produto</span>
        <p class="font-medium">{{ movement.product?.name }}</p>
      </div>

      <div>
        <span class="text-sm text-gray-500">Tipo</span>
        <p class="font-medium">{{ typeLabel }}</p>
      </div>

      <div>
        <span class="text-sm text-gray-500">{{
          movement.type === MovementType.ADJUST
            ? "Ajuste"
            : `Quantidade ${
                movement.type === MovementType.BUY ? "comprada" : "vendida"
              }`
        }}</span>
        <p
          class="font-medium"
          :class="
            movement.type === MovementType.ADJUST
              ? movement.quantity < 0
                ? 'text-error'
                : 'text-success'
              : ''
          "
        >
          {{ movement.type === MovementType.ADJUST ? quantityLabel : movement.quantity }}
        </p>
      </div>

      <div>
        <span class="text-sm text-gray-500">Data</span>
        <p class="font-medium">{{ formattedDate }}</p>
      </div>
    </div>

    <div v-if="movement.observation">
      <span class="text-sm text-gray-500">Observação</span>
      <p class="mt-1 whitespace-pre-line">
        {{ movement.observation }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MovementType } from "~/types/enums/movement_type";
import type { InventoryMovement } from "~/types/interfaces/inventory_movements";

const props = defineProps<{
  movement: InventoryMovement;
}>();

const typeLabel = computed(() => {
  switch (props.movement.type) {
    case MovementType.BUY:
      return "Entrada";
    case MovementType.SELL:
      return "Saída";
    case MovementType.ADJUST:
      return "Ajuste";
    default:
      return props.movement.type;
  }
});

const quantityLabel = computed(() => {
  const q = props.movement.quantity;
  return q > 0 ? `+${q}` : q;
});

const formattedDate = computed(() =>
  new Date(props.movement.date_movement).toLocaleString("pt-BR")
);
</script>
