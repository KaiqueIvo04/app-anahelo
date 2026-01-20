<template>
  <div class="w-full flex items-center gap-3 p-2">
    <div class="h-8 border-l-4 border-primary"></div>
    <span class="material-icons text-3xl"> inventory </span>
    <h1 class="text-2xl font-semibold">Produtos</h1>
  </div>

  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />

  <div class="w-full mt-6 border border-base-300 bg-base-100">
    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureProductForm
        v-if="modalValue"
        @save="saveProduct"
        @remove="deleteProduct"
        @cancel="closeModal"
        :product="selectedProduct"
      />
    </CrudModal>

    <CrudCardGrid
      create-label="REGISTRAR PRODUTO"
      :page="currentPage"
      :limit="itemsPerPage"
      :total="total"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :sort-options="sortOptions"
      @create="openModalCreate"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
      @update:sort="handleSortChange"
    >
      <UiBaseCard
        v-for="product in data"
        :key="product.id"
        :id="product.id"
        :title="product.name"
        :description="product.description"
        @click="openModalRead(product)"
        class="cursor-pointer"
      >
        <template #header>
          <figure
            v-if="product.image_base64"
            class="h-40 rounded-3xl"
            :class="{ skeleton: pending }"
          >
            <img v-if="product.image_base64" :src="product.image_base64" />
          </figure>
          <div
            v-else
            class="flex items-center justify-center h-40 rounded-3xl text-gray-400 bg-base-300"
          >
            <span class="material-icons text-5xl!">image_not_supported</span>
          </div>
        </template>

        <div class="w-full badge badge-outline mb-2">
          <strong>Em estoque:</strong> {{ product.inventory_quantity }}
        </div>
        <div class="w-full flex gap-2">
          <div class="w-1/2 h-12 text-xs badge badge-warning">
            <strong> ▼ Preço de compra:</strong> R${{ product.cost }}
          </div>
          <div class="w-1/2 h-12 text-xs badge badge-success">
            <strong> ▲ Preço de venda:</strong> R${{ product.price }}
          </div>
        </div>
      </UiBaseCard>
    </CrudCardGrid>
    <div
      v-if="!data || data.length === 0"
      class="text-center p-6 my-20 opacity-70"
    >
      Nenhum registro encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductForm } from "~/types/interfaces/product";

definePageMeta({
  layout: "private",
  middleware: "auth",
});

// Estado da paginação
const currentPage = ref(1);
const itemsPerPage = ref(6);

// Estado da ordenação
const sortBy = ref("createdAt");
const sortOrder = ref<"asc" | "desc">("asc");

// Opções de ordenação disponíveis
const sortOptions = [
  { value: "name", label: "Nome" },
  { value: "price", label: "Preço de venda" },
  { value: "cost", label: "Preço de compra" },
  { value: "inventory_quantity", label: "Estoque" },
  { value: "id", label: "ID" },
];

const query = computed(() => ({
  page: currentPage.value,
  limit: itemsPerPage.value,
  sort: {
    by: sortBy.value,
    order: sortOrder.value,
  },
}));

const modalValue = ref(false);
const selectedProduct = ref<Product | undefined>(undefined);
const modalTitle = computed(() => {
  return selectedProduct.value ? "EDITAR PRODUTO" : "REGISTRAR PRODUTO";
});

const { data, pending, refresh, error, feedback, total } = await useAPI<
  Product[]
>("/products", {
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

// Handler de ordenação
function handleSortChange(newSortBy: string, newSortOrder: "asc" | "desc") {
  sortBy.value = newSortBy;
  sortOrder.value = newSortOrder;
}

// FUNÇÕES DE CRUD
async function saveProduct(productData: ProductForm) {
  feedback.clear();
  if (selectedProduct.value) await editProduct(productData);
  else await createProduct(productData);
}
async function createProduct(productData: ProductForm) {
  const { error } = await useAPI<Product>("/products", {
    method: "POST",
    body: productData,
  });

  if (error.value) {
    if (error.value.statusCode === 409)
      feedback.show("Erro: um produto com esses dados já existe!", "error");
    if (error.value.statusCode === 400)
      feedback.show("Erro: dados inválidos!", "error");
  } else {
    feedback.show(`Produto registrado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function editProduct(productData: ProductForm) {
  const { error } = await useAPI<Product>(`/products/${productData.id}`, {
    method: "PATCH",
    body: productData,
  });

  if (error.value) {
    if (error.value.statusCode === 409)
      feedback.show("Erro: um produto com esses dados já existe!", "error");
    if (error.value.statusCode === 400)
      feedback.show("Erro: dados inválidos!", "error");
  } else {
    feedback.show(`Produto atualizado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function deleteProduct(productData: ProductForm) {
  feedback.clear();
  if (!confirm("Deseja realmente excluir este produto?")) return;

  const { error } = await useAPI(`/products/${productData.id}`, {
    method: "DELETE",
  });

  if (error.value) {
    feedback.show(`Erro ao remover produto: ${error.value.message}`, "error");
  } else {
    feedback.show(`Produto removido com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}


// FUNÇÕES DO MODAL
function openModalCreate() {
  selectedProduct.value = undefined;
  modalValue.value = true;
}
function openModalRead(product: Product) {
  selectedProduct.value = { ...product };
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedProduct.value = undefined;
}
</script>
