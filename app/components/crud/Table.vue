<template>
  <div>
    <div class="p-4 flex justify-between items-center">
      <button
        v-if="!hideCreate && canCreate"
        @click="$emit('create')"
        class="btn btn-primary"
        :title="'Registrar'"
      >
        <span class="material-icons"> add </span>
        {{ createLabel }}
      </button>

      <!-- Seletor de itens por página -->
      <div class="flex items-center gap-2">
        <label class="text-sm">Itens:</label>
        <select 
          v-model="localLimit" 
          class="select select-sm"
          @change="handleLimitChange"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <div class="max-h-auto">
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
        <template v-if="showDefaultActions" #actions="{ row }">
          <slot name="actions" :row="row" />
        </template>
      </UiTable>
    </div>

    <!-- Paginação -->
    <div v-if="totalPages > 1" class="flex justify-between items-center p-4 border-t">
      <!-- Informações da paginação -->
      <div class="text-sm text-gray-600">
        Mostrando {{ startItem }} a {{ endItem }} de {{ total }} itens
      </div>

      <!-- Controles de paginação -->
      <div class="join">
        <!-- Botão primeira página -->
        <button 
          class="join-item btn btn-sm"
          :disabled="page === 1 || loading"
          @click="goToPage(1)"
          title="Primeira página"
        >
          «
        </button>

        <!-- Botão página anterior -->
        <button 
          class="join-item btn btn-sm"
          :disabled="page === 1 || loading"
          @click="goToPage(page - 1)"
          title="Página anterior"
        >
          ‹
        </button>

        <!-- Números das páginas -->
        <template v-for="pageNum in visiblePages" :key="pageNum">
          <button
            v-if="pageNum !== '...'"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': pageNum === page }"
            :disabled="loading"
            @click="goToPage(pageNum as number)"
          >
            {{ pageNum }}
          </button>
          <button
            v-else
            class="join-item btn btn-sm btn-disabled"
            disabled
          >
            ...
          </button>
        </template>

        <!-- Botão próxima página -->
        <button 
          class="join-item btn btn-sm"
          :disabled="page === totalPages || loading"
          @click="goToPage(page + 1)"
          title="Próxima página"
        >
          ›
        </button>

        <!-- Botão última página -->
        <button 
          class="join-item btn btn-sm"
          :disabled="page === totalPages || loading"
          @click="goToPage(totalPages)"
          title="Última página"
        >
          »
        </button>
      </div>
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

  // Paginação server-side
  page: number;        // Página atual
  limit: number;       // Itens por página
  total: number;       // Total de itens no servidor
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  createLabel: "Registrar",
  editLabel: "Editar",
  deleteLabel: "Excluir",
  showDefaultActions: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  maxVisiblePages: 5,
});

const emit = defineEmits<{
  create: [];
  edit: [row: any];
  delete: [row: any];
  'update:page': [page: number];
  'update:limit': [limit: number];
}>();

// Estado local para v-model
const localLimit = ref(props.limit);

// Computados da paginação
const totalPages = computed(() => 
  Math.ceil(props.total / props.limit)
);

const startItem = computed(() => {
  if (props.total === 0) return 0;
  return (props.page - 1) * props.limit + 1;
});

const endItem = computed(() => {
  const end = props.page * props.limit;
  return end > props.total ? props.total : end;
});

// Páginas visíveis na paginação
const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = props.maxVisiblePages;
  const total = totalPages.value;
  const current = props.page;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    const leftSiblingIndex = Math.max(current - 1, 1);
    const rightSiblingIndex = Math.min(current + 1, total);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < total - 1;

    pages.push(1);

    if (shouldShowLeftDots) {
      pages.push('...');
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }

    if (shouldShowRightDots) {
      pages.push('...');
    }

    if (total > 1) {
      pages.push(total);
    }
  }

  return pages;
});

// Funções de navegação
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && !props.loading) {
    emit('update:page', page);
  }
}

function handleLimitChange() {
  emit('update:limit', localLimit.value);
  emit('update:page', 1); // Volta pra primeira página
}

// Sincroniza localLimit com prop
watch(() => props.limit, (newLimit) => {
  localLimit.value = newLimit;
});
</script>