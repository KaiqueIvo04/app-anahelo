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
      :loading="pending"
      :page="currentPage"
      :limit="itemsPerPage"
      :total="total"
      :canEdit="false"
      :canDelete="false"
      :showDefaultActions="false"
      @show-info="openModalRead"
      @create="openModalCreate"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
      @update:sort="
        (sort) => {
          sortBy = sort.key;
          sortOrder = sort.direction;
        }
      "
    />
  </div>
  <CrudModal v-model="modalValue" :title="modalTitle">
    <FeatureSellMovementForm
      v-if="!selectedSale"
      @save="saveSale"
      @cancel="closeModal"
    />
    <FeatureSaleDetail v-if="selectedSale" :sale="selectedSale" />
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
    sortable: false,
    formatter: () => ({
      label: "Saída",
      class: "badge badge-error", // vermelho, saída
      icon: "arrow_upward",
    }),
  },
  { key: "id", label: "ID", sortable: false },
  {
    key: "createdAt",
    label: "Registrado em",
    sortable: true,
    formatter: dateFormatter,
  },
  { key: "name_client", label: "Cliente", sortable: true },
  {
    key: "payment_method",
    label: "Pagamento",
    sortable: true,
    formatter: (value: PaymentMethod) => paymentMethodMeta[value],
  },
  {
    key: "total_value",
    label: "Total",
    sortable: true,
    formatter: (value: number) => `R$${value}`,
  },
  {
    key: "discount",
    label: "Desconto",
    sortable: true,
    formatter: (value: number) => `R$${value}`,
  },
  {
    key: "date_sale",
    label: "Data da venda",
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
const selectedSale = ref<Sale | undefined>(undefined);

const sales = computed(() => data.value || []);
const modalTitle = computed(() => {
  return selectedSale.value ? "EDITAR VENDA" : "REGISTRAR VENDA";
});
const query = computed(() => ({
  page: currentPage.value,
  limit: itemsPerPage.value,
  sort: {
    by: sortBy.value,
    order: sortOrder.value,
  },
}));

const { data, pending, refresh, feedback, total } = await useAPI<Sale[]>(
  `/sales`,
  {
    query,
    watch: [query],
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
    if (
      error.value.statusCode === 400 &&
      error.value.data.message.includes("Insufficient stock")
    ) {
      feedback.show(
        "Erro: o produto não possui estoque suficiente para esta venda!",
        "error"
      );
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
function openModalRead(sale: Sale) {
  selectedSale.value = { ...sale };
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedSale.value = undefined;
}
</script>
