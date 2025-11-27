<template>
  <div
    class="card card-border w-96 mx-10 p-5 h-fit flex justify-center items-center bg-base-content"
  >
    <div>
      <img class="w-40 rounded-full" src="~/assets/logos/anahelo_logo.png" />
    </div>

    <div class="w-full px-5 mt-10">
      <form class="flex flex-col items-center w-full">
        <!-- Input email -->
        <label class="input input-bordered flex items-center gap-2 w-full mb-3">
          <span class="material-icons opacity-70">mail</span>
          <input type="text" class="grow" placeholder="Digite seu e-mail" />
        </label>

        <!-- Input senha -->
        <label class="input input-bordered flex items-center gap-2 w-full mb-3">
          <span class="material-icons opacity-70">password</span>
          <!-- Campo de senha -->
          <input
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
        <button class="btn btn-secondary w-full">
          Criar conta de administrador
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "public",
});

// const { theme, toggleTheme } = useTheme();
const showPassword = ref(false);
</script>
