<template>
  <FeatureInventoryMovementForm
    :movement="movement"
    :movement-type="MovementType.ADJUST"
    @save="saveMovement"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import { MovementType } from '~/types/enums/movement_type';
import type { InventoryMovement, InventoryMovementForm } from '~/types/interfaces/inventory_movements';

const props = defineProps<{
  movement?: InventoryMovement
}>()
const emit = defineEmits<{
    save: [data: InventoryMovementForm]
    cancel: []
}>()

function saveMovement(data: InventoryMovementForm) {
    emit('save', data);
}
</script>
