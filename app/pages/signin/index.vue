<template>
  <div
    class="card card-border w-96 mx-10 p-5 h-fit flex justify-center items-center bg-base-content"
  >
    <div>
      <img class="w-40 rounded-full" src="~/assets/logos/anahelo_logo.png" />
    </div>

    <div class="w-full px-5 mt-5">
      <p class="mb-3 text-xl text-white text-center">Login</p>
      <form
        @submit.prevent="authenticate"
        class="flex flex-col items-center w-full"
      >
        <!-- Input email -->
        <label class="input input-bordered flex items-center gap-2 w-full mb-3">
          <span class="material-icons opacity-70">mail</span>
          <input
            v-model="email"
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
            v-model="password"
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

        <button class="btn btn-primary w-full mb-2">Entrar</button>
      </form>
      <button
        @click="() => router.push('/signup')"
        class="btn btn-secondary w-full"
      >
        Criar conta de administrador
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "public",
});
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// const { theme, toggleTheme } = useTheme();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const router = useRouter();

async function authenticate() {
  const response = await useFetch(`${apiBaseUrl}/auth/signin`, {
    method: "post",
    body: { email: email.value, password: password.value },
  });
  console.log(response);
}
</script>
