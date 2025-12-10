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
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex w-full gap-2 p-2 rounded hover:bg-secondary transition ease duration-500"
        >
          <span class="material-icons cursor-pointer select-none opacity-70">
            {{ item.icon }}
          </span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Botão de tema -->
      <div class="mt-auto">
        <button
          @click="loggedUserStore.toggleTheme"
          class="relative w-full p-2 bg-secondary text-white rounded hover:bg-gray-900 cursor-pointer text-center"
        >
          <span
            class="material-icons absolute left-3 top-1/2 -translate-y-1/2 opacity-70 text-xl"
          >
            {{
              loggedUserStore.theme == Theme.LIGHT ? "dark_mode" : "light_mode"
            }}
          </span>

          <span> Tema escuro </span>
        </button>
      </div>

      <!-- Sair -->
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

    <!-- Conteúdo -->
    <main class="flex justify-center items-center w-full">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import { useLoggedUserStore } from "~/stores/userLogged.store";
import { Theme } from "~/types/enums/theme.enum";
import type { User } from "~/types/user";

const router = useRouter();
const loggedUserStore = useLoggedUserStore();

const user = ref<User | undefined>(loggedUserStore.user);
const loggingOut = ref(false);

// Lista de itens do menu
const menuItems = [
  { icon: "home", label: "Início", to: "/admin/home" },
  { icon: "group", label: "Usuários", to: "/admin/users" },
  { icon: "inventory", label: "Produtos", to: "/admin/products" },
  { icon: "person", label: "Minha conta", to: "/admin/myaccount" },
];

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
