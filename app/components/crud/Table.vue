<template>
  <div>
    <div class="p-4">
      <button
        v-if="!hideCreate && canCreate"
        @click="$emit('create')"
        class="btn btn-primary"
        :title="'Registrar'"
      >
        <span class="material-icons"> add </span>
        {{ createLabel }}
      </button>
    </div>

    <div class="max-h-100">
      <UiTable
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :row-key="rowKey"
        :disable-row="disableRow"
        :show-default-actions="showDefaultActions"
        :hide-edit="hideEdit || !canEdit"
        :hide-delete="hideDelete || !canDelete"
        :edit-label="editLabel"
        :delete-label="deleteLabel"
        @edit="row => $emit('edit', row)"
        @delete="row => $emit('delete', row)"
      >
        <!-- Passa o slot de ações customizadas se existir -->
        <template #actions="{ row }">
          <slot name="actions" :row="row" />
        </template>
      </UiTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Column } from "~/types/interfaces/column";

interface Props {
  rows: any[];
  columns: Column[];
  loading?: boolean;
  rowKey?: (row: any) => string | number;
  disableRow?: (row: any) => boolean;

  // Configurações de ações
  hideCreate?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  showDefaultActions?: boolean;

  // Permissões dinâmicas
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;

  // Labels customizáveis
  createLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  createLabel: "Registrar",
  editLabel: "Editar",
  deleteLabel: "Excluir",
  showDefaultActions: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
});

const emit = defineEmits<{
  create: []; // evento de criar
  edit: [row: any];
  delete: [row: any];
}>();

function emitirEditar(row: any) {
  emit("edit", row);
}

function emitirExcluir(row: any) {
  emit("delete", row);
}
</script>
