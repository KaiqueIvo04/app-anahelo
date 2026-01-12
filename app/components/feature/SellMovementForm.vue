<template>
  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />
  <form @submit.prevent="submit" class="space-y-6">
    <!-- Cliente -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Cliente*</span>
      </label>
      <input
        v-model="form.name_client"
        class="input input-bordered validator w-full"
        placeholder="Nome do comprador"
        required
        pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
        title="Digite um nome válido (apenas letras, espaços, hífen ou apóstrofo)"
        minlength="3"
        maxlength="60"
      />
      <p class="validator-hint">
        Nome inválido. Use apenas letras e espaços (acentos permitidos).
      </p>
    </div>

    <!-- Forma de pagamento -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Forma de pagamento*</span>
      </label>

      <select
        v-model="form.payment_method"
        class="select select-bordered validator w-full"
        required
      >
        <option value="">Selecione...</option>
        <option :value="PaymentMethod.MONEY">Dinheiro</option>
        <option :value="PaymentMethod.CARD">Cartão</option>
        <option :value="PaymentMethod.PIX">PIX</option>
      </select>

      <p class="validator-hint">Selecione uma forma de pagamento válida.</p>
    </div>

    <!-- Itens da venda -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h3 class="font-semibold">Itens da venda</h3>

        <button type="button" class="btn btn-sm btn-outline" @click="addItem">
          + Adicionar item
        </button>
      </div>

      <div
        v-for="(item, index) in form.items"
        :key="index"
        class="grid grid-cols-12 gap-2 items-end"
      >
        <!-- Produto -->
        <div class="col-span-6">
          <label class="label">
            <span class="label-text">Produto*</span>
          </label>
          <select
            v-model="item.product_id"
            class="select select-bordered validator w-full"
            @change="onProductChange(item)"
            required
          >
            <option value="">Selecione...</option>
            <option
              v-for="product in getAvailableProducts(item)"
              :key="product.id"
              :value="product.id"
              :disabled="product.inventory_quantity < 1"
            >
              {{ product.name }} <span v-if="product.inventory_quantity === 0">(Sem estoque)</span>
            </option>
          </select>
        </div>

        <!-- Quantidade -->
        <div class="col-span-3">
          <label class="label">
            <span class="label-text">Qtd*</span>
          </label>
          <input
            v-model.number="item.quantity"
            type="number"
            min="1"
            step="1"
            class="input input-bordered validator w-full"
            required
          />
        </div>

        <!-- Preço unitário -->
        <div class="col-span-2">
          <label class="label">
            <span class="label-text">Preço</span>
          </label>
          <input
            v-model.number="item.unit_price"
            type="number"
            min="0"
            step="0.01"
            class="input input-bordered w-full"
            readonly
            tabindex="-1"
            disabled
          />
        </div>

        <!-- Remover -->
        <div class="col-span-1">
          <button
            type="button"
            class="btn btn-error btn-sm"
            @click="removeItem(index)"
          >
            ✕
          </button>
        </div>
      </div>

      <p v-if="!form.items.length" class="text-sm opacity-60">
        Nenhum item adicionado.
      </p>
    </div>

    <!-- Desconto -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Desconto</span>
      </label>
      <input
        v-model.number="form.discount"
        type="number"
        min="0"
        step="0.01"
        class="input input-bordered validator w-full"
      />

      <p class="validator-hint">O desconto não pode ser negativo.</p>
    </div>

    <!-- Total -->
    <div class="flex justify-end">
      <div class="text-right">
        <p class="text-sm opacity-60">Total</p>
        <p class="text-xl font-bold">R$ {{ totalFormatted }}</p>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex justify-end gap-2">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        Cancelar
      </button>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="saving || !form.items.length"
      >
        <span v-if="saving" class="loading loading-spinner"></span>
        Finalizar venda
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { PaymentMethod } from "~/types/enums/payment_method";
import type { Product } from "~/types/interfaces/product";
import type { SaleForm, SaleItemForm } from "~/types/interfaces/sale";

const emit = defineEmits<{
  save: [data: SaleForm];
  cancel: [];
}>();

const saving = ref(false);

// Calcular total da venda e formatar para R$
const total = computed(() => {
  const subtotal = form.items.reduce((acc, item) => {
    return acc + item.quantity * item.unit_price;
  }, 0);

  return Math.max(subtotal - (form.discount || 0), 0);
});
const totalFormatted = computed(() => total.value.toFixed(2).replace(".", ","));

// Filtrar apenas produtos que não foram inseridos
function getAvailableProducts(currentItem?: SaleItemForm) {
  if (!products.value) return [];

  const selectedIds = new Set(
    form.items
      .filter((i) => i !== currentItem)
      .map((i) => i.product_id)
      .filter(Boolean)
  );

  return products.value.filter((p) => !selectedIds.has(p.id));
}

const {
  data: products,
  feedback,
  error,
} = await useAPI<Product[]>("/products");
if (error.value) {
  feedback.clear();
  feedback.show("Erro ao carregar produtos", "error");
}

const form = reactive<SaleForm>({
  name_client: "",
  payment_method: undefined,
  discount: 0,
  items: [],
});

function addItem() {
  form.items.push({
    product_id: "",
    quantity: 1,
    unit_price: 0,
  });
}

function removeItem(index: number) {
  form.items.splice(index, 1);
}

function onProductChange(item: SaleItemForm) {
  const duplicated = form.items.filter((i) => i.product_id === item.product_id);

  if (duplicated.length > 1) {
    feedback.clear();
    feedback.show("Este produto já foi adicionado.", "warning");
    item.product_id = "";
    item.unit_price = 0;
    return;
  }

  const product = products.value?.find((p) => p.id === item.product_id);
  if (!product) return;

  item.unit_price = Number(product.price);
}

function submit() {
  saving.value = true;

  emit("save", {
    name_client: form.name_client || undefined,
    payment_method: form.payment_method!,
    discount: form.discount || 0,
    items: form.items,
  });

  saving.value = false;
}
</script>
