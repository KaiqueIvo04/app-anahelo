<template>
  <table class="table w-full">
    <!-- Cabeçalho -->
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          class="cursor-pointer select-none"
          @click="sortColumn(col)"
        >
          <div class="flex items-center gap-1">
            {{ col.label }}

            <!-- Indicador de ordenação -->
            <span v-if="sort.key === col.key">
              <span v-if="sort.direction === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </div>
        </th>

        <!-- Ações -->
        <th v-if="$slots.actions">Ações</th>
      </tr>
    </thead>

    <!-- Corpo -->
    <tbody>
      <tr class="hover:bg-secondary/25" v-for="row in sortedRows" :key="rowKey(row)">
        <td v-for="col in columns" :key="col.key">
          {{ row[col.key] }}
        </td>

        <td v-if="$slots.actions">
          <slot name="actions" :row="row" />
        </td>
      </tr>

      <tr v-if="loading">
        <td :colspan="columns.length + ($slots.actions ? 1 : 0)">
          <div class="text-center p-6">Carregando...</div>
        </td>
      </tr>

      <tr v-if="!loading && sortedRows.length === 0">
        <td :colspan="columns.length + ($slots.actions ? 1 : 0)">
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
