<template>
  <div class="w-full">
    <div class="p-4 flex flex-wrap justify-between items-center gap-4">
      <button
        v-if="!hideCreate && canCreate"
        @click="$emit('create')"
        class="btn btn-primary"
        :title="'Registrar'"
      >
        <span class="material-icons"> add </span>
        {{ createLabel }}
      </button>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Ordenação -->
        <div v-if="sortOptions && sortOptions.length > 0" class="flex items-center gap-2">
          <label class="text-sm">Ordenar por:</label>
          <select
            v-model="localSortBy"
            class="select select-sm select-bordered"
            @change="handleSortByChange"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Botão de ordem (ASC/DESC) -->
          <button
            class="btn btn-sm btn-square"
            @click="toggleSortOrder"
            :title="localSortOrder === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'"
          >
            <span class="material-icons">
              {{ localSortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
            </span>
          </button>
        </div>

        <!-- Seletor de itens por página -->
        <div class="flex items-center gap-2">
          <label class="text-sm">Itens:</label>
          <select
            v-model="localLimit"
            class="select select-sm select-bordered"
            @change="handleLimitChange"
          >
            <option :value="8">8</option>
            <option :value="12">12</option>
            <option :value="16">16</option>
            <option :value="20">20</option>
            <option :value="40">40</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-10 p-4 lg:min-w-full">
        <slot />
      </div>
    </div>

    <!-- Paginação -->
    <div
      v-if="totalPages > 1"
      class="flex justify-between items-center p-4 border-t"
    >
      <!-- Informações da paginação -->
      <div class="text-sm text-gray-600">
        Mostrando {{ startItem }} a {{ endItem }} de {{ total }} itens
      </div>

      <!-- Controles de paginação -->
      <div class="join">
        <button
          class="join-item btn btn-sm"
          :disabled="page === 1"
          @click="goToPage(1)"
          title="Primeira página"
        >
          «
        </button>

        <button
          class="join-item btn btn-sm"
          :disabled="page === 1"
          @click="goToPage(page - 1)"
          title="Página anterior"
        >
          ‹
        </button>

        <template v-for="pageNum in visiblePages" :key="pageNum">
          <button
            v-if="pageNum !== '...'"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': pageNum === page }"
            @click="goToPage(pageNum as number)"
          >
            {{ pageNum }}
          </button>
          <button v-else class="join-item btn btn-sm btn-disabled" disabled>
            ...
          </button>
        </template>

        <button
          class="join-item btn btn-sm"
          :disabled="page === totalPages"
          @click="goToPage(page + 1)"
          title="Próxima página"
        >
          ›
        </button>

        <button
          class="join-item btn btn-sm"
          :disabled="page === totalPages"
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
interface SortOption {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    hideCreate?: boolean;
    canCreate?: boolean;
    createLabel?: string;

    // Paginação server-side
    page: number;
    limit: number;
    total: number;
    maxVisiblePages?: number;

    // Ordenação
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    sortOptions?: SortOption[];
  }>(),
  {
    canCreate: true,
    createLabel: "NOVO",
    maxVisiblePages: 5,
    sortBy: 'name',
    sortOrder: 'asc',
  }
);

const emit = defineEmits<{
  create: [];
  "update:page": [page: number];
  "update:limit": [limit: number];
  "update:sort": [sortBy: string, sortOrder: 'asc' | 'desc'];
}>();

// Estado local
const localLimit = ref(props.limit);
const localSortBy = ref(props.sortBy);
const localSortOrder = ref(props.sortOrder);

// Computados da paginação
const totalPages = computed(() => Math.ceil(props.total / props.limit));

const startItem = computed(() => {
  if (props.total === 0) return 0;
  return (props.page - 1) * props.limit + 1;
});

const endItem = computed(() => {
  const end = props.page * props.limit;
  return end > props.total ? props.total : end;
});

// Páginas visíveis
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
      pages.push("...");
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }

    if (shouldShowRightDots) {
      pages.push("...");
    }

    if (total > 1) {
      pages.push(total);
    }
  }

  return pages;
});

// Funções
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit("update:page", page);
  }
}

function handleLimitChange() {
  emit("update:limit", localLimit.value);
  emit("update:page", 1);
}
function handleSortByChange() {
  emit("update:sort", localSortBy.value, localSortOrder.value);
}
function toggleSortOrder() {
  localSortOrder.value = localSortOrder.value === 'asc' ? 'desc' : 'asc';
  emit("update:sort", localSortBy.value, localSortOrder.value);
}

// Sincroniza props com estado local
watch(() => props.limit, (newLimit) => {
  localLimit.value = newLimit;
});
watch(() => props.sortBy, (newSortBy) => {
  localSortBy.value = newSortBy || 'name';
});
watch(() => props.sortOrder, (newSortOrder) => {
  localSortOrder.value = newSortOrder || 'asc';
});
</script>