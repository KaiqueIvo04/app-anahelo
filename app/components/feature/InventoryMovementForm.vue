<template>
  <form @submit.prevent="saveMovement" class="space-y-4">
    <!-- Produto -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Produto{{ movement ? "" : "*" }}</span>
      </label>

      <select
        v-model="form.product_id"
        :disabled="disabled"
        class="select select-bordered validator w-full"
        :required="!movement"
      >
        <option value="">Selecione...</option>
        <option
          v-for="product in products"
          :key="product.id"
          :value="product.id"
        >
          {{ product.name }}
        </option>
      </select>

      <p class="validator-hint">O produto é obrigatório</p>
    </div>

    <!-- Tipo -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Tipo{{ movement ? "" : "*" }}</span>
      </label>

      <select
        v-model="form.type"
        disabled
        class="select select-bordered validator w-full"
        required
      >
        <option :value="MovementType.BUY">Entrada (Compra)</option>
        <option :value="MovementType.SELL">Saída (Venda)</option>
        <option :value="MovementType.ADJUST">Ajuste</option>
      </select>

      <p class="validator-hint">O tipo da movimentação é obrigatório</p>
    </div>

    <!-- Quantidade -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Quantidade{{ movement ? "" : "*" }}</span>
      </label>

      <input
        v-model.number="form.quantity"
        type="number"
        min="1"
        step="1"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!movement"
      />

      <p class="validator-hint">Quantidade inválida</p>
    </div>

    <!-- Data -->
    <div v-if="movementType !== MovementType.ADJUST" class="form-control">
      <label class="label">
        <span class="label-text">Data{{ movement ? "" : "*" }}</span>
      </label>

      <input
        v-model="form.date_movement"
        type="datetime-local"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!movement"
      />
    </div>

    <!-- Observação -->
    <div class="form-control">
      <label class="label">
        <span class="label-text"
          >Observação
          {{ movementType === MovementType.ADJUST ? "*" : undefined }}</span
        >
      </label>

      <textarea
        v-model="form.observation"
        :disabled="disabled"
        class="textarea textarea-bordered validator w-full"
        maxlength="255"
        :required="movementType === MovementType.ADJUST"
      />

      <p class="validator-hint">Observação é obrigatória para ajustes</p>
    </div>

    <!-- Dados da Venda -->
    <div v-if="props.isSale" class="divider">Dados da Venda</div>

    <!-- Cliente -->
    <div v-if="props.isSale" class="form-control">
      <label class="label">
        <span class="label-text">Cliente *</span>
      </label>

      <input
        v-model="form.name_client"
        type="text"
        class="input input-bordered validator w-full"
        :disabled="disabled"
        required
      />

      <p class="validator-hint">O nome do cliente é obrigatório</p>
    </div>

    <!-- Forma de pagamento -->
    <div v-if="props.isSale" class="form-control">
      <label class="label">
        <span class="label-text">Forma de pagamento *</span>
      </label>

      <select
        v-model="form.payment_method"
        class="select select-bordered validator w-full"
        :disabled="disabled"
        required
      >
        <option value="">Selecione...</option>
        <option value="CASH">Dinheiro</option>
        <option value="PIX">PIX</option>
        <option value="CREDIT_CARD">Cartão de Crédito</option>
        <option value="DEBIT_CARD">Cartão de Débito</option>
      </select>

      <p class="validator-hint">Forma de pagamento obrigatória</p>
    </div>

    <!-- Desconto -->
    <div v-if="props.isSale" class="form-control">
      <label class="label">
        <span class="label-text">Desconto</span>
      </label>

      <input
        v-model.number="form.discount"
        type="number"
        min="0"
        step="0.01"
        class="input input-bordered w-full"
        :disabled="disabled"
      />
    </div>

    <!-- Ações -->
    <div class="flex justify-end">
      <button
        v-if="disabled"
        type="button"
        class="btn btn-primary"
        @click="enableEdit"
      >
        Editar
      </button>

      <div v-else class="flex gap-2">
        <button type="button" class="btn btn-ghost" @click="cancel">
          Cancelar
        </button>

        <button type="submit" class="btn btn-primary" :disabled="saving">
          <span v-if="saving" class="loading loading-spinner"></span>
          {{ movement ? "Atualizar" : "Salvar" }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  InventoryMovement,
  InventoryMovementForm,
} from "~/types/interfaces/inventory_movements";
import { MovementType } from "~/types/enums/movement_type";

const props = defineProps<{
  movement?: InventoryMovement;
  movementType?: MovementType;
  isSale?: boolean;
}>();

const emit = defineEmits<{
  save: [data: InventoryMovementForm];
  cancel: [];
}>();

const disabled = ref(false);
if (props.movement) disabled.value = true;

const saving = ref(false);
const feedback = useFeedback();

const { data: products, error } = await useAPI<any[]>("/products");
if (error.value) {
  feedback.show("Erro ao obter produtos!", "error");
}

const form = reactive<
  InventoryMovementForm & {
    name_client?: string;
    payment_method?: string;
    discount?: number;
  }
>({
  product_id: undefined,
  type: props.movementType ?? props.movement?.type,
  quantity: undefined,
  date_movement: props.movementType === MovementType.ADJUST ? undefined : "",

  observation: "",

  // Campos de venda
  name_client: "",
  payment_method: "",
  discount: 0,
});

// Preenche formulário em modo edição
if (props.movement) {
  form.product_id = props.movement.product_id;
  form.type = props.movement.type;
  form.quantity = props.movement.quantity;
  form.date_movement = props.movement.date_movement;
  form.observation = props.movement.observation;
}

function saveMovement() {
  saving.value = true;

  const data: any = {
    product_id: form.product_id,
    type: form.type as MovementType,
    quantity: form.quantity,
    date_movement: form.date_movement
      ? new Date(form.date_movement).toISOString()
      : new Date().toISOString(),
    observation: form.observation || undefined,
  };

  if (props.isSale) {
    data.sale = {
      name_client: form.name_client,
      payment_method: form.payment_method,
      discount: form.discount ?? 0,
    };
  }

  if (props.movement) {
    data.id = props.movement.id;
  }

  emit("save", data);
  saving.value = false;
}

function cancel() {
  disabled.value = true;
  emit("cancel");
}

function enableEdit() {
  disabled.value = false;
}
</script>
