<template>
  <FeatureInventoryMovementForm
    :movement-type="MovementType.ADJUST"
    @save="saveMovement"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import { MovementType } from '~/types/enums/movement_type';
import type { InventoryMovementForm } from '~/types/interfaces/inventory_movements';

const emit = defineEmits<{
    save: [data: InventoryMovementForm]
    cancel: []
}>()

function saveMovement(data: InventoryMovementForm) {
    emit('save', data);
}
</script>
