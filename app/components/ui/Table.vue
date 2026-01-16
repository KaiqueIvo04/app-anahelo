<template>
  <table class="table table-zebra w-full">
    <!-- Cabeçalho -->
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          :class="col.sortable ? 'cursor-pointer' : 'cursor-default'"
          @click="col.sortable && sortColumn(col)"
        >
          <div class="flex items-center gap-1 max-w-60">
            {{ col.label }}

            <!-- Indicador de ordenação -->
            <span v-if="sort.key === col.key && col.sortable">
              <span v-if="sort.direction === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </div>
        </th>

        <!-- Ações -->
        <th v-if="$slots.actions || showDefaultActions" class="text-center">Ações</th>
      </tr>
    </thead>

    <!-- Corpo -->
    <tbody>
      <tr
        v-for="row in rows"
        :key="rowKey(row)"
        :class="[
          'hover:bg-secondary/25',
          isRowDisabled(row) ? 'opacity-60' : '',
        ]"
        @click="showInformations(row)"
      >
        <!-- CONTEÚDO PRINCIPAL -->
        <td v-for="col in columns" :key="col.key">
          <div class="flex items-center gap-2">
            <!-- Renderização dinâmica -->
            <template v-if="isBadge(getFormattedValue(row, col))">
              <span
                class="badge badge-md w-full flex justify-start"
                :class="getFormattedValue(row, col).class"
              >
                <span
                  v-if="getFormattedValue(row, col).icon"
                  class="material-icons text-sm mr-1"
                >
                  {{ getFormattedValue(row, col).icon }}
                </span>
                {{ getFormattedValue(row, col).label }}
              </span>
            </template>

            <template v-else>
              <p class="line-clamp-2 max-w-60">
                {{ getFormattedValue(row, col) }}
              </p>
              <!-- PARA LISTA DE USUÁRIOS -->
              <span
                v-if="isRowDisabled(row) && col.key === columns[0]!.key"
                class="badge badge-sm badge-info"
              >
                Você
              </span>
            </template>
          </div>
        </td>

        <td v-if="$slots.actions || showDefaultActions">
          <slot name="actions" :row="row" :disabled="isRowDisabled(row)">
            <!-- Ações padrão se não houver slot customizado -->
            <div class="flex justify-center gap-2" v-if="showDefaultActions">
              <button
                v-if="!hideEdit"
                @click="$emit('edit', row)"
                :disabled="isRowDisabled(row)"
                class="btn btn-sm btn-ghost"
                :class="{ 'cursor-not-allowed': isRowDisabled(row) }"
                :title="
                  isRowDisabled(row)
                    ? 'Você não pode editar sua própria conta'
                    : 'Editar'
                "
              >
                <span class="material-icons text-blue-600">edit</span>
              </button>

              <button
                v-if="!hideDelete"
                @click="$emit('delete', row)"
                :disabled="isRowDisabled(row)"
                class="btn btn-sm btn-ghost"
                :class="{
                  'btn-disabled cursor-not-allowed': isRowDisabled(row),
                }"
                :title="
                  isRowDisabled(row)
                    ? 'Você não pode excluir sua própria conta'
                    : 'Excluir'
                "
              >
                <span class="material-icons text-red-600">delete</span>
              </button>
            </div>
          </slot>
        </td>
      </tr>

      <tr v-if="loading">
        <td
          :colspan="
            columns.length + ($slots.actions || showDefaultActions ? 1 : 0)
          "
        >
          <div class="text-center p-6">Carregando...</div>
        </td>
      </tr>

      <tr v-if="!loading && rows.length === 0">
        <td
          :colspan="
            columns.length + ($slots.actions || showDefaultActions ? 1 : 0)
          "
        >
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

const emit = defineEmits<{
  edit: [row: any];
  showInfo: [row: any];
  delete: [row: any];
  "update:sort": [sort: any];
}>();

function showInformations(row: any) {
  emit('showInfo', row);
}

// Caso a key do objeto não seja passada
const rowKey = props.rowKey ?? ((row) => row.id ?? JSON.stringify(row));
// Função necessária para permitir chaves aninhadas
function getValue(row: any, key: string) {
  return key.split(".").reduce((obj, prop) => obj?.[prop], row);
}
// Aplica formatador se existir
function getFormattedValue(row: any, col: Column) {
  const value = getValue(row, col.key);
  return col.formatter ? col.formatter(value, row) : value;
}

// Desabilitar linha
function isRowDisabled(row: any): boolean {
  return props.disableRow ? props.disableRow(row) : false;
}
function isBadge(value: any): value is {
  label: string;
  class?: string;
  icon?: string;
} {
  return typeof value === "object" && value?.label;
}

// ORDENAÇÃO
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

  emit('update:sort', sort)
}
</script>
