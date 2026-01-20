<template>
  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />
  <form @submit.prevent="saveProduct" class="space-y-4">
    <div class="form-control">
      <fieldset class="fieldset">
        <div class="flex justify-center">
          <img
            v-if="form.image_base64"
            :src="form.image_base64"
            class="w-60 h-60 object-cover rounded border mt-2"
          />
        </div>

        <label class="label">
          <span class="label-text">Imagem do produto</span>
        </label>
        <legend class="fieldset-legend">Escolha uma foto</legend>
        <input
          :disabled="disabled"
          @change="handleFileChange"
          type="file"
          class="file-input file-input-primary w-full"
        />
        <label class="label">Tamanho máximo 4MB</label>
      </fieldset>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Nome{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Digite o nome do produto"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!product"
        pattern="^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ .,/()\-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$"
        title="Nome do produto inválido"
        minlength="3"
        maxlength="100"
      />

      <p class="validator-hint">
        Use letras, números e separadores comuns (espaço, hífen, ponto,
        parênteses).
      </p>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Descrição{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.description"
        type="text"
        placeholder="Digite a descrição do produto"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!product"
        title="Descrição do produto. (Max: 500 caracteres)"
        minlength="3"
        maxlength="500"
      />
      <p class="validator-hint">A Descrição deve ter de 3 a 500 caracteres</p>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Categoria{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.category"
        type="text"
        placeholder="Digite a categoria do produto"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!product"
        title="Categoria do produto. (Max: 30 caracteres)"
        minlength="3"
        maxlength="30"
      />
      <p class="validator-hint">A Categoria deve ter de 3 a 30 caracteres</p>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Fornecedor do produto</span>
      </label>
      <select
        v-model="form.supplier_id"
        :disabled="disabled"
        class="select select-bordered w-full"
        title="Fornecedor do produto. (Não obrigatório)"
      >
        <option value="">Selecione um Fornecedor...</option>
        <option v-for="supplier in suppliers" :value="supplier.id">
          {{ supplier.name }}
        </option>
      </select>
    </div>

    <div class="form-control">
      <span class="label-text">Preço de custo{{ product ? "" : "*" }}:</span>
      <label class="input input-bordered validator label md:mx-2">
        <span class="label-text">R$</span>
        <input
          v-model="form.cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="Digite o custo de compra do produto"
          :disabled="disabled"
          class="w-full"
          title="Custo de compra do produto. Min: (R$0,00)"
          :required="!product"
        />
      </label>
      <p class="validator-hint">O preço de custo mínimo é: R$0</p>
    </div>

    <div class="form-control">
      <span class="label-text">Preço de venda{{ product ? "" : "*" }}:</span>

      <label class="input input-bordered validator label md:mx-2">
        <span class="label-text">R$</span>
        <input
          v-model="form.price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Digite o preço de venda do produto"
          :disabled="disabled"
          class="w-full"
          title="Preço de venda do produto. Min: (R$0,00)"
          :required="!product"
        />
      </label>
      <p class="validator-hint">O preço de venda mínimo é: R$0</p>
    </div>

    <div class="flex justify-end gap-2">
      <button
        v-if="disabled"
        type="button"
        @click="() => disabled = false"
        class="btn btn-accent"
      >
        Editar
      </button>
      <button
        v-if="disabled"
        type="button"
        @click="$emit('remove', props.product!)"
        class="btn btn-error"
      >
        Remover
      </button>
      <div v-else class="flex gap-2 justify-end">
        <button type="button" @click="cancel" class="btn btn-ghost">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          <span v-if="saving" class="loading loading-spinner"></span>
          {{ product ? "Atualizar" : "Criar" }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Product, ProductForm } from "~/types/interfaces/product";
import type { Supplier } from "~/types/interfaces/supplier";

// Props: recebe o usuário se for edição (undefined se for criação)
const props = defineProps<{
  product?: Product;
}>();

const disabled = ref(false);
// Se for edição fica desativado até clicar em "Editar"
if (props.product) disabled.value = true;

const emit = defineEmits<{
  save: [data: ProductForm];
  remove: [data: ProductForm];
  cancel: [];
}>();

const feedback = useFeedback();

const { data: suppliers, error } = await useAPI<Supplier[]>("/suppliers");

if (error.value) {
  feedback.clear();
  feedback.show("Erro ao obter fornecedores!", "error");
}

const saving = ref(false);

// Function to handle file input change
function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const maxSize = 4 * 1024 * 1024; // 4MB

  if (file.size > maxSize) {
    feedback.clear();
    feedback.show("A imagem deve ter no máximo 4MB", "error");
    return;
  }

  if (!file.type.startsWith("image/")) {
    feedback.clear();
    feedback.show("Arquivo inválido. Envie uma imagem.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    form.image_base64 = reader.result as string;
  };
  reader.readAsDataURL(file);
}

const form = reactive<ProductForm>({
  image_base64: "",
  name: "",
  description: "",
  category: "",
  supplier_id: "",
  inventory_quantity: 0,
  cost: 0,
  price: 0,
});

if (props.product) {
  form.image_base64 = props.product.image_base64;
  form.name = props.product.name;
  form.description = props.product.description;
  form.category = props.product.category;
  form.supplier_id = props.product.supplier_id;
  form.inventory_quantity = props.product.inventory_quantity;
  form.cost = props.product.cost;
  form.price = props.product.price;
}

// Função para salvar
function saveProduct() {
  saving.value = true;

  const dados: ProductForm = {
    image_base64: form.image_base64 || undefined,
    name: form.name,
    description: form.description,
    category: form.category,
    supplier_id: form.supplier_id,
    inventory_quantity: Number(form.inventory_quantity),
    cost: Number(form.cost),
    price: Number(form.price),
  };

  if (props.product) dados.id = props.product.id;
  if (dados.supplier_id === "") delete dados.supplier_id;

  emit("save", dados);

  saving.value = false;
}

function deleteProduct() {
  const dados: ProductForm = {};
}

function cancel() {
  disabled.value = true;
  emit("cancel");
}
</script>
