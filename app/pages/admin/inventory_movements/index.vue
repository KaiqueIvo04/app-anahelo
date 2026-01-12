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
      create-label="REGISTRAR MOVIMENTAÇÃO"
      @create="openModalCreate"
      @edit="openModalEdit"
      @delete="deleteMovement"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
    />

    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureInventoryMovementForm
        :movement="selectedMovement"
        @save="saveMovement"
        @cancel="closeModal"
      />
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
  { key: "id", label: "ID" },
  { key: "date_movement", label: "Data" },
  { key: "product.name", label: "Produto" },
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
  return selectedMovement.value
    ? "EDITAR MOVIMENTAÇÃO"
    : "REGISTRAR MOVIMENTAÇÃO";
});

const { data, pending, refresh, error, feedback, total } = await useAPI<
  InventoryMovement[]
>("/inventory-movements", {
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
async function saveMovement(movementData: InventoryMovementForm) {
  feedback.clear();
  if (selectedMovement.value) await editMovement(movementData);
  else await createMovement(movementData);
}
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
async function editMovement(movementData: InventoryMovementForm) {
  const { error } = await useAPI<InventoryMovement>(
    `/inventory-movements/${movementData.id}`,
    {
      method: "PATCH",
      body: movementData,
    }
  );

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
    feedback.show(`Movimentação atualizada com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function deleteMovement(movementData: InventoryMovementForm) {
  feedback.clear();
  if (!confirm("Deseja realmente excluir esta movimentação?")) return;

  const { error } = await useAPI(`/inventory-movements/${movementData.id}`, {
    method: "DELETE",
  });

  if (error.value) {
    if (error.value.statusCode === 404) {
      feedback.show(
        `Erro: A Movimentação não existe ou já foi removida!`,
        "error"
      );
    }
  } else {
    feedback.show(`Movimentação removida com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}

// Funções do Modal
function openModalCreate() {
  selectedMovement.value = undefined;
  modalValue.value = true;
}
function openModalEdit(movement: InventoryMovement) {
  selectedMovement.value = { ...movement };
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedMovement.value = undefined;
}
</script>
