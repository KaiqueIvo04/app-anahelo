<template>
  <form @submit.prevent="saveSupplier" class="space-y-4">
    <!-- Nome -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Nome{{ supplier ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Digite o nome do fornecedor"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!supplier"
        pattern="^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ .,&\-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$"
        minlength="3"
        maxlength="100"
        title="Nome do fornecedor inválido"
      />
      <p class="validator-hint">
        Use letras, números e separadores comuns (espaço, &, hífen ou ponto).
      </p>
    </div>

    <!-- CNPJ -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">CNPJ</span>
      </label>
      <input
        v-model="form.cnpj"
        type="text"
        placeholder="00.000.000/0000-00"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        pattern="^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$"
        title="CNPJ inválido"
      />
      <p class="validator-hint">
        Informe um CNPJ válido no formato 00.000.000/0000-00
      </p>
    </div>

    <!-- Contato -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Contato</span>
      </label>
      <input
        v-model="form.phone"
        type="text"
        placeholder="(11) 91234-5678"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        pattern="^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$"
        title="Telefone inválido"
      />
      <p class="validator-hint">Informe um telefone válido com DDD</p>
    </div>

    <!-- E-mail -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">E-mail</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        placeholder="fornecedor@email.com"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        title="E-mail inválido"
      />
      <p class="validator-hint">Informe um e-mail válido</p>
    </div>

    <!-- Endereço -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Endereço</span>
      </label>
      <input
        v-model="form.address"
        type="text"
        placeholder="Digite o endereço do fornecedor"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        minlength="5"
        maxlength="150"
        title="Endereço inválido"
      />
      <p class="validator-hint">O endereço deve ter ao menos 5 caracteres</p>
    </div>

    <!-- Ações -->
    <div class="flex justify-end">
      <button
        v-if="disabled"
        type="button"
        @click="
          () => {
            disabled = false;
          }
        "
        class="btn btn-primary"
      >
        Editar
      </button>
      <div v-else class="flex gap-2 justify-end">
        <button type="button" @click="cancel" class="btn btn-ghost">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          <span v-if="saving" class="loading loading-spinner"></span>
          {{ supplier ? "Atualizar" : "Criar" }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Supplier, SupplierForm } from "~/types/interfaces/supplier";

// Props: recebe o usuário se for edição (undefined se for criação)
const props = defineProps<{
  supplier?: Supplier;
}>();

const disabled = ref(false);
// Se for edição fica desativado até clicar em "Editar"
if (props.supplier) disabled.value = true

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

  if (props.supplier) dados.id = props.supplier.id;

  emit("save", dados);

  saving.value = false;
}

function cancel() {
  disabled.value = true;
  emit("cancel");
}
</script>
