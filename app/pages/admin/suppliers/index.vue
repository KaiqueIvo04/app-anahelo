<template>
  <div class="w-full flex items-center gap-3 p-2">
    <div class="h-8 border-l-4 border-primary"></div>
    <span class="material-icons text-3xl"> warehouse </span>
    <h1 class="text-2xl font-semibold">Fornecedores</h1>
  </div>

  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
    ,
  />

  <div class="w-full mt-6 overflow-x-auto border border-base-300 bg-base-100">
    <CrudTable
      :rows="suppliers || []"
      :columns="columns"
      :loading="pending"
      create-label="NOVO FORNECEDOR"
      @create="openModalCreate"
      @edit="openModalEdit"
      @delete="deleteSupplier"
    />

    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureSupplierForm
        :supplier="selectedSupplier"
        @save="saveSupplier"
        @cancel="closeModal"
      />
    </CrudModal>
  </div>
</template>

<script setup lang="ts">
import type { Supplier, SupplierForm } from "~/types/interfaces/supplier";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "cnpj", label: "CNPJ" },
  { key: "phone", label: "Contato" },
  { key: "email", label: "E-mail" },
  { key: "address", label: "Endereço" },
];

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const feedback = useFeedback();
const {
  data: suppliers,
  pending,
  refresh,
  error,
} = await useAPI<Supplier[]>("/suppliers");

if (error.value) {
  feedback.show(
    `Erro ao carregar fornecedores: ${error.value.message}`,
    "error"
  );
}

const modalValue = ref(false);
const selectedSupplier = ref<Supplier | undefined>(undefined);

const modalTitle = computed(() => {
  return selectedSupplier.value ? "EDITAR FORNECEDOR" : "REGISTRAR FORNECEDOR";
});

async function saveSupplier(supplierData: SupplierForm) {
  if (selectedSupplier.value) await editSupplier(supplierData);
  else await createSupplier(supplierData);
}

async function createSupplier(supplierData: SupplierForm) {
  const { error } = await useAPI<Supplier>("/suppliers", {
    method: "POST",
    body: supplierData,
  });

  if (error.value) {
    if (error.value.statusCode === 409)
      feedback.show("Erro: um fornecedor com esses dados já existe!", "error");
    if (error.value.statusCode === 400)
      feedback.show("Erro: dados inválidos!", "error");
  } else {
    feedback.show(`Fornecedor registrado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function editSupplier(supplierData: SupplierForm) {
  const { error } = await useAPI<Supplier>(`/suppliers/${supplierData.id}`, {
    method: "PATCH",
    body: supplierData,
  });

  if (error.value) {
    if (error.value.statusCode === 409)
      feedback.show("Erro: um fornecedor com esses dados já existe!", "error");
    if (error.value.statusCode === 400)
      feedback.show("Erro: dados inválidos!", "error");
  } else {
    feedback.show(`Fornecedor atualizado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function deleteSupplier(supplierData: SupplierForm) {
  if (!confirm("Deseja realmente excluir este fornecedor?")) return;

  const { error } = await useAPI(`/suppliers/${supplierData.id}`, {
    method: "DELETE",
  });

  if (error.value) {
    feedback.show(
      `Erro ao remover fornecedor: ${error.value.message}`,
      "error"
    );
  } else {
    feedback.show(`Fornecedor removido com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}

function openModalCreate() {
  selectedSupplier.value = undefined;
  modalValue.value = true;
}
function openModalEdit(supplier: Supplier) {
  selectedSupplier.value = { ...supplier };
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedSupplier.value = undefined;
}
</script>
