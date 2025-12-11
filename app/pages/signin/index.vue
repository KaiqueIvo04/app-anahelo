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
import { jwtDecode } from "jwt-decode";
import { useAPI } from "~/composables/useAPI";
import { useLoggedUserStore } from "~/stores/userLogged.store";
import type { LoginForm, LoginResponse } from "~/types/interfaces/auth";
import { Theme } from "~/types/enums/theme.enum";
import type { User } from "~/types/interfaces/user";

definePageMeta({
  layout: "public",
  middleware: "guest",
});

// const { theme, toggleTheme } = useTheme();
const userStore = useLoggedUserStore();
const form = reactive<LoginForm>({
  email: "",
  password: "",
});

const showPassword = ref(false);
const router = useRouter();

async function authenticate() {
  try {
    // Obter token
    const loginResponse = await useAPI<LoginResponse>(`/auth/signin`, {
      method: "post",
      body: { email: form.email, password: form.password },
    });

    // Decodificar token
    const token = loginResponse.data.value!.access_token;
    const decodedToken = jwtDecode<{
      username: string;
      sub: string;
    }>(token);

    // Obter informações do usuário
    const userResponse = await useFetch<User>(
      `${import.meta.env.VITE_API_BASE_URL}/users/${decodedToken.sub}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Guardar informações e redirecioanr para página
    if (userResponse && userResponse.data) {
      const user: User = userResponse.data.value!;
      userStore.setUser(
        user,
        token,
        localStorage.getItem(THEME_KEY) || Theme.LIGHT
      );
      router.push("/admin/home");
    }
  } catch (error) {
    console.error("Erro inesperado:", error);
    form.password = "";
  }
}
</script>
