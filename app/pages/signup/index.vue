<template>
  <div
    class="card card-border w-96 mx-10 p-5 h-fit flex justify-center items-center bg-base-100"
  >
    <div>
      <img class="w-40 rounded-full" src="~/assets/logos/anahelo_logo.png" />
    </div>

    <div class="w-full px-5 mt-5">
      <p class="mb-3 text-xl text-primary text-center">Criar Conta</p>

      <UiFeedBackAlert :message="feedback.message.value" :type="feedback.type.value"/>

      <form
        @submit.prevent="registerUser"
        class="flex flex-col items-center w-full"
      >
        <!-- Input name -->
        <label class="input input-bordered flex items-center gap-2 w-full mb-3">
          <span class="material-icons opacity-70">person</span>
          <input
            v-model="form.name"
            type="text"
            class="grow"
            placeholder="Digite seu nome"
          />
        </label>
        <!-- Input email -->
        <label class="input input-bordered flex items-center gap-2 w-full mb-3">
          <span class="material-icons opacity-70">mail</span>
          <input
            v-model="form.email"
            type="text"
            class="grow"
            placeholder="Digite seu e-mail"
          />
        </label>

        <!-- Input senha -->
        <label class="input input-bordered flex items-center gap-2 w-full mb-3">
          <span class="material-icons opacity-70">password</span>
          <!-- Campo de senha -->
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="grow"
            placeholder="Digite sua senha"
          />

          <!-- Botão de visibilidade -->
          <span
            class="material-icons cursor-pointer select-none opacity-70 hover:opacity-100"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "visibility_off" : "visibility" }}
          </span>
        </label>

        <button class="btn btn-primary w-full mb-2" :disabled="loading">
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
