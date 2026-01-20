<template>
  <div class="w-full flex items-center gap-3 p-2">
    <div class="h-8 border-l-4 border-primary"></div>
    <span class="material-icons text-3xl"> swap_vertical_circle </span>
    <h1 class="text-2xl font-semibold">Movimentações</h1>
  </div>

  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />

  <div class="w-full mt-6 overflow-x-auto border border-base-300 bg-base-100">
    <CrudTable
      :rows="movements"
      :columns="columns"
      :loading="pending"
      :page="currentPage"
      :limit="itemsPerPage"
      :total="total"
      :show-default-actions="false"
      :can-edit="false"
      :can-delete="false"
      create-label="AJUSTAR ESTOQUE"
      create-icon="settings"
      @create="openModalCreate"
      @show-info="openModalRead"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
      @update:sort="
        (sort) => {
          sortBy = sort.key;
          sortOrder = sort.direction;
        }
      "
    />

    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureAdjustMovementForm
        v-if="!selectedMovement"
        @save="createMovement"
        @cancel="closeModal"
      />
      <FeatureInventoryMovementDetail
        v-if="selectedMovement"
        :movement="selectedMovement"
      />
    </CrudModal>
  </div>
</template>

<script setup lang="ts">
import type { MovementType } from "~/types/enums/movement_type";
import type { Column } from "~/types/interfaces/column";
import type {
  InventoryMovement,
  InventoryMovementForm,
} from "~/types/interfaces/inventory_movements";

import { movementTypeMeta } from "~/utils/metas";

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const columns: Column[] = [
  {
    key: "type",
    label: "Tipo",
    sortable: false,
    formatter: (value: MovementType) => {
      const meta = movementTypeMeta[value];

      return {
        label: meta.label,
        class: meta.badge,
        icon: meta.icon,
      };
    },
  },
  { key: "id", label: "ID" },
  {
    key: "createdAt",
    label: "Registrado em",
    sortable: true,
    formatter: dateFormatter,
  },
  { key: "product.name", label: "Produto", sortable: true },
  { key: "quantity", label: "Quantidade", sortable: true },
  { key: "observation", label: "Observação", sortable: false },
  {
    key: "date_movement",
    label: "Data da movimentação",
    sortable: true,
    formatter: dateFormatter,
  },
];

// Estado da paginação
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref("createdAt");
const sortOrder = ref<"asc" | "desc">("desc");

const modalValue = ref(false);
const selectedMovement = ref<InventoryMovement | undefined>(undefined);

const movements = computed(() => data.value || []);
const modalTitle = computed(() => {
  return selectedMovement.value ? "MOVIMENTAÇÃO" : "AJUSTAR ESTOQUE";
});
const query = computed(() => ({
  page: currentPage.value,
  limit: itemsPerPage.value,
  sort: {
    by: sortBy.value,
    order: sortOrder.value,
  },
}));

const { data, pending, refresh, error, feedback, total } = await useAPI<
  InventoryMovement[]
>("/inventory-movements", {
  query,
  watch: [query],
});

// Handlers de paginação
function handlePageChange(page: number) {
  currentPage.value = page;
}
function handleLimitChange(limit: number) {
  itemsPerPage.value = limit;
  currentPage.value = 1;
}

// Funções de CRUD
async function createMovement(movementData: InventoryMovementForm) {
  feedback.clear();
  const { error } = await useAPI<InventoryMovement>("/inventory-movements", {
    method: "POST",
    body: movementData,
  });

  if (error.value) {
    if (error.value.statusCode === 409) {
      feedback.show(
        "Erro: uma movimentação com esses dados já existe!",
        "error"
      );
    }
    if (error.value.statusCode === 400) {
      feedback.show("Erro: dados inválidos!", "error");
    }
  } else {
    feedback.show(`Ajuste registrado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}

// Funções do Modal
function openModalCreate() {
  selectedMovement.value = undefined;
  modalValue.value = true;
}
function openModalRead(movement: InventoryMovement) {
  selectedMovement.value = { ...movement };
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedMovement.value = undefined;
}
</script>
