<template>
  <div
    class="card card-border w-auto min-w-96 mx-10 p-5 h-fit flex justify-center items-center bg-base-100"
  >
    <div>
      <img class="w-40 rounded-full" src="~/assets/logos/anahelo_logo.png" />
    </div>

    <div class="w-full px-5 mt-7">
      <p class="mb-7 text-xl text-primary text-center">Criar Conta</p>

      <UiFeedBackAlert
        :message="feedback.message.value"
        :type="feedback.type.value"
      />

      <form
        @submit.prevent="registerUser"
        class="flex flex-col items-center w-full"
      >
        <!-- Input name -->
        <label
          class="input input-bordered validator flex items-center gap-2 w-full"
        >
          <span class="material-icons opacity-70">person</span>
          <input
            v-model="form.name"
            type="text"
            placeholder="Digite seu nome"
            required
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
            title="Digite um nome válido (apenas letras, espaços, hífen ou apóstrofo)"
            minlength="3"
            maxlength="60"
          />
        </label>
        <div class="px-2 text-xs h-10 w-full text-gray-400">
          Nome inválido. Use apenas letras e espaços (acentos permitidos).
        </div>

        <!-- Input email -->
        <label
          class="input input-bordered validator flex items-center gap-2 w-full"
        >
          <span class="material-icons opacity-70">mail</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="Digite seu e-mail"
          />
        </label>
        <div class="px-2 text-xs h-10 w-full text-gray-400">
          Insira um e-mail válido
        </div>

        <!-- Input senha -->
        <label
          class="input input-bordered validator flex items-center gap-2 w-full"
        >
          <span class="material-icons opacity-70">password</span>
          <!-- Campo de senha -->
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Digite sua senha"
            required
            title="A senha deve ter pelo menos 6 caracteres, inluindo:
        Pelo menos um número, uma letra minúscula e uma maiúscula"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />

          <!-- Botão de visibilidade -->
          <span
            class="material-icons cursor-pointer select-none opacity-70 hover:opacity-100"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "visibility_off" : "visibility" }}
          </span>
        </label>
        <div class="px-2 text-xs h-10 w-full text-gray-400">
          A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma
          letra minúscula e um número
        </div>

        <button class="btn btn-primary w-full my-2" :disabled="loading">
          <span v-if="loading" class="loading loading-dots loading-md"></span>
          <span v-else>Cadastrar</span>
        </button>
      </form>
      <button
        @click="() => router.push('/signin')"
        class="btn btn-secondary w-full"
      >
        Voltar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserForm } from "~/types/interfaces/user";

definePageMeta({
  layout: "public",
  middleware: "guest",
});

const form = reactive<UserForm>({
  name: "",
  password: "",
  email: "",
});
const showPassword = ref(false);
const loading = ref(false);
const router = useRouter();
const feedback = useFeedback();

async function registerUser() {
  loading.value = true;
  feedback.clear();

  const { error } = await useAPI<User>("/auth/signup", {
    method: "POST",
    body: { ...form, type: "admin" },
  });

  if (error.value) {
    feedback.show(
      error.value.data?.message || "Erro ao cadastrar usuário",
      "error"
    );
    loading.value = false;
    return;
  }

  feedback.show("Conta criada com sucesso!", "success");
  setTimeout(() => {
    router.push("/signin");
  }, 1500);
  loading.value = false;
}
</script>
