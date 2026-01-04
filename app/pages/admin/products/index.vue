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

  <div class="w-full">
    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureProductForm
        v-if="modalValue"
        @save="saveProduct"
        @cancel="closeModal"
        :product="selectedProduct"
      />
    </CrudModal>

    <CrudCardGrid
      create-label="NOVO PRODUTO"
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
        v-for="product in sortedProducts"
        :key="product.id"
        :title="product.name"
        :description="product.description"
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
            <span class="material-icons !text-5xl">image_not_supported</span>
          </div>
        </template>

        <p><strong>ID:</strong> {{ product.id }}</p>
        <p><strong>Em estoque:</strong> {{ product.inventory_quantity }}</p>
        <p><strong>Preço de compra:</strong> R${{ product.cost }}</p>
        <p><strong>Preço de venda:</strong> R${{ product.price }}</p>

        <template #footer>
          <button class="btn btn-accent" @click="openModalEdit(product)">
            Editar
          </button>
          <button class="btn btn-error" @click="deleteProduct(product)">
            Remover
          </button>
        </template>
      </UiBaseCard>
    </CrudCardGrid>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductForm } from "~/types/interfaces/product";

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const feedback = useFeedback();

// Estado da paginação
const currentPage = ref(1);
const itemsPerPage = ref(8);

// Estado da ordenação
const sortBy = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Opções de ordenação disponíveis
const sortOptions = [
  { value: 'name', label: 'Nome' },
  { value: 'price', label: 'Preço de venda' },
  { value: 'cost', label: 'Preço de compra' },
  { value: 'inventory_quantity', label: 'Estoque' },
  { value: 'id', label: 'ID' },
];

const modalValue = ref(false);
const selectedProduct = ref<Product | undefined>(undefined);
const modalTitle = computed(() => {
  return selectedProduct.value ? "EDITAR PRODUTO" : "REGISTRAR PRODUTO";
});

const {
  data,
  pending,
  refresh,
  error,
  total,
} = await useAPI<Product[]>("/products", {
  query: {
    page: currentPage,
    limit: itemsPerPage,
  },
  watch: [currentPage, itemsPerPage],
});

if (error.value) {
  feedback.show(`Erro ao carregar produtos: ${error.value.message}`, "error");
}

// 👇 Produtos ordenados (client-side)
const sortedProducts = computed(() => {
  const products = data.value || [];
  
  // Cria uma cópia para não modificar o array original
  const sorted = [...products];
  
  sorted.sort((a, b) => {
    const aValue = a[sortBy.value as keyof Product];
    const bValue = b[sortBy.value as keyof Product];
    
    // Trata valores undefined/null
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Comparação para números
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Comparação para strings
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortOrder.value === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });
  
  return sorted;
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
function handleSortChange(newSortBy: string, newSortOrder: 'asc' | 'desc') {
  sortBy.value = newSortBy;
  sortOrder.value = newSortOrder;
}

async function saveProduct(productData: ProductForm) {
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

function openModalCreate() {
  selectedProduct.value = undefined;
  modalValue.value = true;
}

function openModalEdit(product: Product) {
  selectedProduct.value = { ...product };
  modalValue.value = true;
}

function closeModal() {
  modalValue.value = false;
  selectedProduct.value = undefined;
}
</script>