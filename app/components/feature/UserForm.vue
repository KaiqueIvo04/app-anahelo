<template>
  <form @submit.prevent="saveUser" class="space-y-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Nome{{ user ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Digite o nome"
        class="input input-bordered w-full"
        :required="!user"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">E-mail{{ user ? "" : "*" }}</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        placeholder="Digite o e-mail"
        class="input input-bordered w-full"
        :required="!user"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Tipo{{ user ? "" : "*" }}</span>
      </label>
      <select
        v-model="form.type"
        class="select select-bordered w-full"
        :required="!user"
      >
        <option value="">Selecione...</option>
        <option value="admin">Administrador</option>
      </select>
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
        class="input input-bordered w-full"
        :required="!user"
      />
    </div>

    <div class="flex gap-2 justify-end pt-4">
      <button type="button" @click="cancel" class="btn btn-ghost">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="saving">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ user ? "Atualizar" : "Criar" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { User, UserForm } from "~/types/interfaces/user";

// Props: recebe o usuário se for edição (undefined se for criação)
const props = defineProps<{
  user?: User;
}>();

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
    emit("cancel");
}


</script>
