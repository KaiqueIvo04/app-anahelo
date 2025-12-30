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

  <div class="h-full flex justify-center items-center">
    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureProductForm
        v-if="modalValue"
        @save="saveProduct"
        @cancel="closeModal"
        :product="selectedProduct"
      />
    </CrudModal>

    <CrudCardGrid create-label="NOVO PRODUTO" @create="openModalCreate">
      <UiBaseCard
        v-for="product in products"
        :key="product.name"
        :title="product.name"
        :description="product.description"
      >
        <template #header>
          <figure v-if="product.image_base64" class="h-40 rounded-3xl" :class="{ skeleton: pending }">
            <img v-if="product.image_base64" :src="product.image_base64" />
          </figure>
          <div
            v-else
            class="flex items-center justify-center h-40 rounded-3xl text-gray-400 bg-base-300"
          >
            <span class="material-icons !text-5xl">image_not_supported</span>
          </div>
        </template>

        <p><strong>Em estoque:</strong> {{ product.inventory_quantity }}</p>
        <p><strong>Preço de compra:</strong> {{ product.cost }}</p>
        <p><strong>Preço de venda:</strong> {{ product.price }}</p>

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
});

const feedback = useFeedback();
const modalValue = ref(false);
const selectedProduct = ref<Product | undefined>(undefined);
const modalTitle = computed(() => {
  return selectedProduct.value ? "EDITAR PRODUTO" : "REGISTRAR PRODUTO";
});

const {
  data: products,
  pending,
  refresh,
  error,
} = await useAPI<Product[]>("/products");

if (error.value) {
  feedback.show(`Erro ao carregar produtos: ${error.value.message}`, "error");
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
  if (!confirm("Deseja realmente excluir este fornecedor?")) return;

  const { error } = await useAPI(`/products/${productData.id}`, {
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
