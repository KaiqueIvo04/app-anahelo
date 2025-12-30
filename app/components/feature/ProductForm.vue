<template>
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
        class="input input-bordered w-full"
        :required="!product"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Descrição{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.description"
        type="text"
        placeholder="Digite a descrição do produto"
        class="input input-bordered w-full"
        :required="!product"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Categoria{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.category"
        type="text"
        placeholder="Digite a categoria do produto"
        class="input input-bordered w-full"
        :required="!product"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Fornecedor do produto</span>
      </label>
      <select v-model="form.supplier_id" class="select select-bordered w-full">
        <option value="">Selecione um Fornecedor...</option>
        <option v-for="supplier in suppliers" :value="supplier.id">
          {{ supplier.name }}
        </option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text"
          >Quantidade em estoque{{ product ? "" : "*" }}</span
        >
      </label>
      <input
        v-model="form.inventory_quantity"
        type="number"
        min="0"
        placeholder="Digite a quantidade em estoque do produto"
        class="input validator input-bordered w-full"
        :required="!product"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Preço de compra{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.cost"
        type="number"
        min="0"
        step="0.01"
        placeholder="Digite o custo do produto"
        class="input validator input-bordered w-full"
        :required="!product"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Preço de venda{{ product ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.price"
        type="number"
        min="0"
        step="0.01"
        placeholder="Digite o preço de venda do produto"
        class="input validator input-bordered w-full"
        :required="!product"
      />
    </div>

    <div class="flex gap-2 justify-end pt-4">
      <button type="button" @click="cancel" class="btn btn-ghost">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="saving">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ product ? "Atualizar" : "Criar" }}
      </button>
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

const emit = defineEmits<{
  save: [data: ProductForm];
  cancel: [];
}>();

const feedback = useFeedback();

const { data: suppliers, error } = await useAPI<Supplier[]>("/suppliers");

if (error.value) {
  feedback.show("Erro ao obter fornecedores!", "error");
}

const saving = ref(false);

// Function to handle file input change
function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const maxSize = 4 * 1024 * 1024; // 4MB

  if (file.size > maxSize) {
    feedback.show("A imagem deve ter no máximo 4MB", "error");
    return;
  }

  if (!file.type.startsWith("image/")) {
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
    cost: form.cost,
    price: Number(form.price),
  };

  if (props.product) dados.id = props.product.id;
  if (dados.supplier_id === "") delete dados.supplier_id;

  emit("save", dados);

  saving.value = false;
}

function cancel() {
  emit("cancel");
}
</script>
