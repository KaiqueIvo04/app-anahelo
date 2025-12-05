<template>
  <div class="min-h-screen flex bg-base-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-base-200 shadow-lg p-4 flex flex-col">
      <div class="flex justify-center mb-6">
        <img class="w-25 rounded-full" src="~/assets/logos/anahelo_logo.png" />
      </div>

      <h1 class="text-center text-xl font-bold mb-6">Olá {{ user?.name }}</h1>

      <nav class="space-y-2">
        <NuxtLink
          to="/admin/home"
          class="flex w-full gap-2 p-2 rounded hover:bg-white"
        >
          <span
            class="material-icons cursor-pointer select-none opacity-70 hover:opacity-100"
          >
            home
          </span>
          Início
        </NuxtLink>
        <NuxtLink
          to="/admin/users"
          class="flex w-full gap-2 p-2 rounded hover:bg-white"
        >
          <span
            class="material-icons cursor-pointer select-none opacity-70 hover:opacity-100"
          >
            group
          </span>
          Usuários
        </NuxtLink>
        <NuxtLink
          to="/admin/products"
          class="flex w-full gap-2 p-2 rounded hover:bg-white"
        >
          <span
            class="material-icons cursor-pointer select-none opacity-70 hover:opacity-100"
          >
            inventory
          </span>
          Produtos
        </NuxtLink>
        <NuxtLink
          to="/admin/account"
          class="flex w-full gap-2 p-2 rounded hover:bg-white"
        >
          <span
            class="material-icons cursor-pointer select-none opacity-70 hover:opacity-100"
          >
            person
          </span>
          Minha conta
        </NuxtLink>
      </nav>

      <div class="mt-auto">
        <button
          @click="loggedUserStore.toggleTheme"
          class="relative w-full p-2 bg-secondary text-white rounded hover:bg-gray-900 cursor-pointer text-center"
        >
          <!-- Ícone fixo à esquerda -->
          <span
            class="material-icons absolute left-3 top-1/2 -translate-y-1/2 opacity-70 text-xl"
          >
            {{
              loggedUserStore.theme == Theme.LIGHT ? "dark_mode" : "light_mode"
            }}
          </span>

          <!-- Texto centralizado -->
          <span> Tema escuro </span>
        </button>
      </div>

      <div class="mt-2">
        <button
          @click="logout"
          class="relative w-full p-2 bg-error text-white rounded hover:bg-red-600 cursor-pointer"
        >
          <span
            class="material-icons absolute left-3 top-1/2 -translate-y-1/2 opacity-70 text-xl"
          >
            logout
          </span>
          Sair
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useLoggedUserStore } from "~/stores/userLogged.store";
import { Theme } from "~/types/enums/theme.enum";
import type { User } from "~/types/user";

// Caso deseje proteger a rota, pode usar um middleware:
// definePageMeta({ middleware: 'auth' })
const router = useRouter();
const loggedUserStore = useLoggedUserStore();

const user = ref<User | undefined>(undefined);

const loggingOut = ref(false);
user.value = loggedUserStore.user;

async function logout() {
  if (loggedUserStore.token) {
    loggingOut.value = true;

    try {
      loggedUserStore.clearCredential();

      await router.push("/signin");
    } catch (error) {
      alert(error);
    } finally {
      loggingOut.value = false;
    }
  }
}
</script>
