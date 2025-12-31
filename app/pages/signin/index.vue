<template>
  <div
    class="card card-border w-96 mx-10 p-5 h-fit flex justify-center items-center bg-base-100"
  >
    <div>
      <img class="w-40 rounded-full" src="~/assets/logos/anahelo_logo.png" />
    </div>

    <div class="w-full px-5 mt-7">
      <p class="mb-7 text-xl text-secondary text-center">Login</p>

      <UiFeedBackAlert
        :message="feedback.message.value"
        :type="feedback.type.value"
      />

      <form
        @submit.prevent="authenticate"
        class="flex flex-col items-center w-full"
      >
        <!-- Input email -->
        <label
          class="input input-bordered validator flex items-center gap-2 w-full"
        >
          <span class="material-icons opacity-70">mail</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="Digite seu e-mail"
            required
            :disabled="loading"
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
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Digite sua senha"
            required
            :disabled="loading"
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

        <button
          type="submit"
          class="btn btn-primary w-full mb-2"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>
      </form>

      <button
        @click="router.push('/signup')"
        class="btn btn-secondary w-full"
        :disabled="loading"
      >
        Criar conta de administrador
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jwtDecode } from "jwt-decode";
import { useLoggedUserStore } from "~/stores/userLogged.store";
import type { LoginForm, LoginResponse } from "~/types/interfaces/auth";
import { Theme } from "~/types/enums/theme.enum";
import type { User } from "~/types/interfaces/user";

definePageMeta({
  layout: "public",
  middleware: "guest",
});

const userStore = useLoggedUserStore();
const router = useRouter();
const config = useRuntimeConfig();
const feedback = useFeedback();

const form = reactive<LoginForm>({
  email: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

async function authenticate() {
  loading.value = true;
  errorMessage.value = "";

  const baseURL = config.public.apiBase;
  const { data: loginResponse, error: loginError } =
    await useFetch<LoginResponse>(`${baseURL}/auth/signin`, {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
      },
    });

  if (loginError.value) {
    const status = loginError.value.statusCode;
    switch (status) {
      case 401:
        feedback.show("Email ou senha inválidos!", "error");
        loading.value = false;
        break;
      case 400:
        feedback.show("Um ou mais campos estão inválidos!", "error");
        break;
      case 500:
        feedback.show("Erro interno no servidor!", "error");
        break;
      default:
        feedback.show(
          "Ocorreu um erro inesperado, verifique sua conexão com a internet!",
          "error"
        );
        break;
    }
    loading.value = false;
    form.password = "";
  } else if (loginResponse.value) {
    const token = loginResponse.value.access_token;

    const decodedToken = jwtDecode<{
      username: string;
      sub: string;
    }>(token);

    // Buscar dados do usuário manualmente com fetch, pois o token ainda não foi colocado no store
    const { data: userData, error: userError } = await useFetch<User>(
      `${config.public.apiBase}/users/${decodedToken.sub}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
        // Desabilita o cache
        key: `login-${Date.now()}`, // Força uma chave única
      }
    );

    if (userError.value || !userData.value) {
      feedback.show("Erro ao carregar dados do usuário!", "error");
      return;
    }

    // Salvar na store
    const themeCookie = useCookie<Theme>("theme");
    const currentTheme = themeCookie.value || Theme.LIGHT;
    userStore.setUser(userData.value, token, currentTheme);

    // Redirecionar usuário
    await router.push("/admin/home");

    form.password = "";
    loading.value = false;
  }
}
</script>
