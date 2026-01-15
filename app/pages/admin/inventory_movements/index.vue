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

  <div class="w-full mt-6 border border-base-300 bg-base-100">
    <CrudTable
      :rows="movements"
      :columns="columns"
      :page="currentPage"
      :limit="itemsPerPage"
      :total="total"
      :can-edit="false"
      :can-delete="false"
      create-label="AJUSTAR ESTOQUE"
      @create="openModalCreate"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
    />

    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureAdjustMovementForm @save="createMovement" @cancel="closeModal" />
    </CrudModal>
  </div>
</template>

<script setup lang="ts">
import type { MovementType } from "~/types/enums/movement_type";
import type {
  InventoryMovement,
  InventoryMovementForm,
} from "~/types/interfaces/inventory_movements";

import { movementTypeMeta } from "~/utils/metas";

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const columns = [
  {
    key: "type",
    label: "Tipo",
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
    label: "Data",
    formatter: (value: string | Date) => {
      if (!value) return "-";

      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(value));
    },
  },
  { key: "product.name", label: "Produto" },
  { key: "quantity", label: "Quantidade" },
  { key: "observation", label: "Observação" },
];

// Estado da paginação
const currentPage = ref(1);
const itemsPerPage = ref(10);

const modalValue = ref(false);
const selectedMovement = ref<InventoryMovement | undefined>(undefined);

const movements = computed(() => data.value || []);
const modalTitle = computed(() => {
  return "AJUSTAR ESTOQUE";
});

const { data, pending, refresh, error, feedback, total } = await useAPI<
  InventoryMovement[]
>("/inventory-movements", { //IMPLEMENTAR ORDENAÇÃO PELA API
  query: {
    page: currentPage,
    limit: itemsPerPage,
  },
  watch: [currentPage, itemsPerPage],
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
    feedback.show(`Movimentação registrada com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}

// Funções do Modal
function openModalCreate() {
  selectedMovement.value = undefined;
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedMovement.value = undefined;
}
</script>
