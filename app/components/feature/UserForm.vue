<template>
  <form @submit.prevent="saveUser" class="space-y-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Nome{{ user ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.name"
        :disabled="disabled"
        type="text"
        placeholder="Digite o nome"
        class="input input-bordered validator w-full"
        :required="!user"
        pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
        title="Digite um nome válido (apenas letras, espaços, hífen ou apóstrofo)"
        minlength="3"
        maxlength="60"
      />
      <p class="validator-hint">
        Nome inválido. Use apenas letras e espaços (acentos permitidos).
      </p>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">E-mail{{ user ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        :disabled="disabled"
        placeholder="admin@email.com"
        title="Insira um e-mail válido"
        class="input input-bordered validator w-full"
        :required="!user"
      />
      <div class="validator-hint">Insira um e-mail válido</div>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Tipo{{ user ? "" : "*" }}</span>
      </label>
      <select
        v-model="form.type"
        :disabled="disabled"
        class="select select-bordered validator w-full"
        :required="!user"
      >
        <option value="">Selecione...</option>
        <option value="admin">Administrador</option>
      </select>
      <p class="validator-hint">O tipo de usuário é obrigatório</p>
    </div>

    <!-- só aparece ao criar -->
    <div v-if="!user" class="form-control">
      <label class="label">
        <span class="label-text">Senha*</span>
      </label>
      <input
        v-model="form.password"
        type="password"
        placeholder="Digite a senha"
        :disabled="disabled"
        class="input input-bordered validator w-full"
        :required="!user"
        title="A senha deve ter pelo menos 6 caracteres, inluindo:
        Pelo menos um número, uma letra minúscula e uma maiúscula"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      />
      <p class="validator-hint">
        Senha inválida. A senha deve ter pelo menos 6 caracteres, incluindo:
        <br />Pelo menos um número, uma letra minúscula e uma maiúscula<br />
      </p>
    </div>

    <div class="flex justify-end">
      <button v-if="disabled" type="button" @click="() => {disabled = false}" class="btn btn-primary">
        Editar
      </button>
      <div v-else class="flex gap-2 justify-end">
        <button type="button" @click="cancel" class="btn btn-ghost">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          <span v-if="saving" class="loading loading-spinner"></span>
          {{ user ? "Atualizar" : "Criar" }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { User, UserForm } from "~/types/interfaces/user";

// Props: recebe o usuário se for edição (undefined se for criação)
const props = defineProps<{
  user?: User;
}>();

const disabled = ref(false);
// Se for edição fica desativado até clicar em "Editar"
if (props.user) disabled.value = true

const emit = defineEmits<{
  save: [data: UserForm];
  cancel: [];
}>();

const saving = ref(false);
const form = reactive<UserForm>({
  name: "",
  email: "",
  type: "",
  password: "",
});

// Se estiver editando, preenche o formulário com os dados do usuário
if (props.user) {
  form.name = props.user.name;
  form.email = props.user.email;
  form.type = props.user.type;
}

// Função para salvar
function saveUser() {
  saving.value = true;

  const dados: UserForm = {
    name: form.name,
    email: form.email,
    type: form.type,
  };

  // Se for criação, adiciona a senha
  if (!props.user) {
    dados.password = form.password;
  } else {
    dados.id = props.user.id;
  }

  emit("save", dados);

  saving.value = false;
}

function cancel() {
  disabled.value = true;
  emit("cancel");
}
</script>
