<template>
  <table class="table table-zebra w-full">
    <!-- Cabeçalho -->
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          class="cursor-pointer"
          @click="sortColumn(col)"
        >
          <div class="flex items-center gap-1 max-w-60">
            {{ col.label }}

            <!-- Indicador de ordenação -->
            <span v-if="sort.key === col.key">
              <span v-if="sort.direction === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </div>
        </th>

        <!-- Ações -->
        <th v-if="$slots.actions || showDefaultActions">Ações</th>
      </tr>
    </thead>

    <!-- Corpo -->
    <tbody>
      <tr 
        v-for="row in sortedRows" 
        :key="rowKey(row)"
        :class="[
          'hover:bg-secondary/25',
          isRowDisabled(row) ? 'opacity-60' : ''
        ]"
      >
        <td v-for="col in columns" :key="col.key">
          <div class="flex items-center gap-2">
            <p class="line-clamp-1 max-w-60">{{ row[col.key] }}</p>
            <span 
              v-if="isRowDisabled(row) && col.key === columns[0]!.key" 
              class="badge badge-sm badge-info"
            >
              Você
            </span>
          </div>
        </td>

        <td v-if="$slots.actions || showDefaultActions">
          <slot name="actions" :row="row" :disabled="isRowDisabled(row)">
            <!-- Ações padrão se não houver slot customizado -->
            <div class="flex gap-2" v-if="showDefaultActions">
              <button
                v-if="!hideEdit"
                @click="$emit('edit', row)"
                :disabled="isRowDisabled(row)"
                class="btn btn-sm btn-ghost"
                :class="{ 'cursor-not-allowed': isRowDisabled(row) }"
                :title="isRowDisabled(row) ? 'Você não pode editar sua própria conta' : 'Editar'"
              > 
                <span class="material-icons text-blue-600">edit</span>
              </button>

              <button
                v-if="!hideDelete"
                @click="$emit('delete', row)"
                :disabled="isRowDisabled(row)"
                class="btn btn-sm btn-ghost"
                :class="{ 'btn-disabled cursor-not-allowed': isRowDisabled(row) }"
                :title="isRowDisabled(row) ? 'Você não pode excluir sua própria conta' : 'Excluir'"
              >
                <span class="material-icons text-red-600">delete</span>
              </button>
            </div>
          </slot>
        </td>
      </tr>

      <tr v-if="loading">
        <td :colspan="columns.length + ($slots.actions || showDefaultActions ? 1 : 0)">
          <div class="text-center p-6">Carregando...</div>
        </td>
      </tr>

      <tr v-if="!loading && sortedRows.length === 0">
        <td :colspan="columns.length + ($slots.actions || showDefaultActions ? 1 : 0)">
          <div class="text-center p-6 opacity-70">
            Nenhum registro encontrado
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { Column } from "~/types/interfaces/column";

const props = defineProps<{
  rows: any[];
  columns: Column[];
  loading?: boolean;
  rowKey?: (row: any) => string | number;
  
  // Configuração de ações padrão
  showDefaultActions?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  
  // Labels customizáveis
  editLabel?: string;
  deleteLabel?: string;
  
  // Função para desabilitar linhas específicas
  disableRow?: (row: any) => boolean;
}>();

defineEmits<{
  edit: [row: any];
  delete: [row: any];
}>();

const rowKey = props.rowKey ?? ((row) => row.id ?? JSON.stringify(row));

const sort = reactive({
  key: "",
  direction: "asc" as "asc" | "desc",
});

function sortColumn(col: Column) {
  if (sort.key === col.key) {
    sort.direction = sort.direction === "asc" ? "desc" : "asc";
  } else {
    sort.key = col.key;
    sort.direction = "asc";
  }
}

function isRowDisabled(row: any): boolean {
  return props.disableRow ? props.disableRow(row) : false;
}

const sortedRows = computed(() => {
  if (!sort.key) return props.rows;

  return [...props.rows].sort((a, b) => {
    const x = a[sort.key];
    const y = b[sort.key];

    if (x == null) return 1;
    if (y == null) return -1;

    return sort.direction === "asc" ? (x > y ? 1 : -1) : x < y ? 1 : -1;
  });
});
</script>