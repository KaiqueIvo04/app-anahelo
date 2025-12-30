<template>
  <form @submit.prevent="saveSupplier" class="space-y-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Nome{{ supplier ? "" : "*"}}</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Digite o nome do fornecedor"
        class="input input-bordered w-full"
        required
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">CNPJ</span>
      </label>
      <input
        v-model="form.cnpj"
        type="text"
        placeholder="Digite o CNPJ do fornecedor"
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Contato</span>
      </label>
      <input
        v-model="form.phone"
        type="text"
        placeholder="Digite o contato do fornecedor"
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">E-mail</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        placeholder="Digite o e-mail do fornecedor"
        class="input input-bordered w-full"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Endereço</span>
      </label>
      <input
        v-model="form.address"
        type="text"
        placeholder="Digite o endereço do fornecedor"
        class="input input-bordered w-full"
      />
    </div>

    <div class="flex gap-2 justify-end pt-4">
      <button type="button" @click="cancel" class="btn btn-ghost">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="saving">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ supplier ? "Atualizar" : "Criar" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Supplier, SupplierForm } from "~/types/interfaces/supplier";

// Props: recebe o usuário se for edição (undefined se for criação)
const props = defineProps<{
  supplier?: Supplier;
}>();

const emit = defineEmits<{
  save: [data: SupplierForm];
  cancel: [];
}>();

const saving = ref(false);
const form = reactive<SupplierForm>({
  name: "",
  cnpj: "",
  phone: "",
  email: "",
  address: "",
});

if (props.supplier) {
  form.name = props.supplier.name;
  form.email = props.supplier.email;
  form.cnpj = props.supplier.cnpj;
  form.phone = props.supplier.phone;
  form.address = props.supplier.address;
}

// Função para salvar
function saveSupplier() {
  saving.value = true;

  const dados: SupplierForm = {
    name: form.name,
    cnpj: form.cnpj,
    phone: form.phone,
    email: form.email,
    address: form.address,
  };

  if(props.supplier) dados.id = props.supplier.id;

  emit("save", dados);

  saving.value = false;
}

function cancel() {
  emit("cancel");
}
</script>
