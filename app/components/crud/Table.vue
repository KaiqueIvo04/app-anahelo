<template>
  <div>
    <div class="flex justify-end p-2">
      <button
        v-if="!hideCreate && canCreate"
        @click="emitirCriar"
        class="btn btn-primary"
      >
        <span class="material-icons"> add </span>
        {{ createLabel }}
      </button>
    </div>

    <UiTable
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :row-key="rowKey"
    />
  </div>
</template>
<script setup lang="ts">
import type { Column } from "~/types/interfaces/column";

interface Props {
  rows: any[];
  columns: Column[];
  loading?: boolean;
  rowKey?: (row: any) => string | number;

  // Configurações de ações
  hideCreate?: boolean;

  // Permissões dinâmicas
  canCreate?: boolean;

  // Labels customizáveis
  createLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  createLabel: "NOVO USUÁRIO",
});

const emit = defineEmits<{
  create: []; // evento de criar
}>();

function emitirCriar() {
  emit('create');
}
</script>
