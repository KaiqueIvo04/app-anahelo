<template>
  <div class="w-full flex items-center gap-3 p-2">
    <div class="h-8 border-l-4 border-primary"></div>
    <span class="material-icons text-3xl"> sell </span>
    <h1 class="text-2xl font-semibold">Vendas</h1>
  </div>

  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />

  <div class="w-full mt-6 overscroll-x-auto border border-base-300 bg-base-100">
    <CrudTable
      create-label="REGISTRAR VENDA"
      :rows="sales"
      :columns="columns"
      :page="currentPage"
      :limit="itemsPerPage"
      :total="total"
      :canEdit="false"
      :canDelete="false"
      :showDefaultActions="false"
      @create="openModalCreate"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
    />
  </div>
  <CrudModal v-model="modalValue" :title="modalTitle">
    <FeatureSellSaleForm @save="saveSale" @cancel="closeModal" />
  </CrudModal>
</template>

<script setup lang="ts">
import type { PaymentMethod } from "~/types/enums/payment_method";
import type { Column } from "~/types/interfaces/column";
import type { Sale, SaleForm } from "~/types/interfaces/sale";

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const columns: Column[] = [
  {
    key: "uiType",
    label: "Tipo",
    formatter: () => ({
      label: "Saída",
      class: "badge badge-error", // vermelho, saída
      icon: "arrow_upward",
    }),
  },
  { key: "id", label: "ID" },
  {
    key: "date_sale",
    label: "Data",
    formatter: (value: string | Date) => {
      if (!value) return "-";

      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(value));
    },
  },
  { key: "name_client", label: "Cliente" },
  {
    key: "payment_method",
    label: "Pagamento",
    formatter: (value: PaymentMethod) => paymentMethodMeta[value],
  },
  {
    key: "total_value",
    label: "Total",
    formatter: (value: number) => `R$${value}`,
  },
];

// Estado da paginação
const currentPage = ref(1);
const itemsPerPage = ref(10);

const modalValue = ref(false);
const selectedSale = ref<Sale | undefined>(undefined);

const sales = computed(() => data.value || []);
const modalTitle = computed(() => {
  return selectedSale.value ? "EDITAR VENDA" : "REGISTRAR VENDA";
});

const { data, pending, refresh, error, feedback, total } = await useAPI<Sale[]>(
  `/sales`,
  {
    query: {
      page: currentPage,
      limit: itemsPerPage,
    },
    watch: [currentPage, itemsPerPage],
  }
);

// Handlers de paginação
function handlePageChange(page: number) {
  currentPage.value = page;
}
function handleLimitChange(limit: number) {
  itemsPerPage.value = limit;
  currentPage.value = 1;
}

// Funções de CRUD
async function saveSale(saleData: SaleForm) {
  feedback.clear();
  const { error } = await useAPI<Sale>("/sales", {
    method: "POST",
    body: saleData,
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
  selectedSale.value = undefined;
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedSale.value = undefined;
}
</script>
