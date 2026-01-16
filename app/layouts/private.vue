<template>
  <div class="min-h-screen flex bg-base-100">
    <!-- Sidebar -->
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content">
        <!-- Navbar -->
        <nav class="navbar w-full bg-base-300">
          <label
            for="my-drawer-4"
            aria-label="open sidebar"
            class="btn btn-square btn-ghost"
          >
            <!-- Sidebar toggle icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
              class="my-1.5 inline-block size-4"
            >
              <path
                d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"
              ></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div class="px-4">AnaHelo</div>

          <div class="w-full flex justify-end gap-4 mx-2">
            <label class="swap swap-rotate">
              <!-- this hidden checkbox controls the state of theme -->
              <input
                @click="loggedUserStore.toggleTheme"
                type="checkbox"
                class="theme-controller"
              />

              <!-- sun icon -->
              <svg
                class="swap-off h-8 w-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                />
              </svg>

              <!-- moon icon -->
              <svg
                class="swap-on h-8 w-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
                />
              </svg>
            </label>

            <button
              @click="logout"
              class="w-10 h-10 flex items-center justify-center text-base-content cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-8 w-8 fill-cu"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>
        </nav>

        <!-- Page content here -->
        <div class="p-4">
          <!-- Conteúdo -->
          <main class="w-full">
            <div class="w-full flex justify-center">
              <div class="my-10 w-full max-w-6xl flex flex-col items-center">
                <slot />
              </div>
            </div>
          </main>
        </div>
      </div>

      <div class="drawer-side is-drawer-close:overflow-visible">
        <label
          for="my-drawer-4"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div
          class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64"
        >
          <!-- LOGO -->
          <div
            class="w-full flex flex-col justify-center items-center mb-3 mt-6"
          >
            <img
              class="w-40 rounded-full"
              src="~/assets/logos/anahelo_logo.png"
            />
            <h1
              class="text-center text-xl font-bold mt-6 is-drawer-close:hidden"
            >
              Olá {{ user?.name }}
            </h1>
          </div>

          <ul class="menu w-full grow">
            <!-- List item -->
            <li v-for="item in menuItems" :key="item.to">
              <NuxtLink
                class="flex w-full gap-2 p-2 rounded hover:bg-secondary transition ease duration-500"
                :to="item.to"
              >
                <span
                  class="material-icons cursor-pointer select-none opacity-70"
                >
                  {{ item.icon }}
                </span>
                <span class="is-drawer-close:hidden">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoggedUserStore } from "~/stores/userLogged.store";

const router = useRouter();
const loggedUserStore = useLoggedUserStore();
loggedUserStore.getCredential();

const { user } = storeToRefs(loggedUserStore);
const loggingOut = ref(false);

// Lista de itens do menu
const menuItems = [
  { icon: "home", label: "Início", to: "/admin/home" },
  {
    icon: "add",
    label: "Compras",
    to: "/admin/purchases",
  },
  {
    icon: "sell",
    label: "Vendas",
    to: "/admin/sales",
  },
  {
    icon: "swap_vertical_circle",
    label: "Movimentações",
    to: "/admin/inventory_movements",
  },
  { icon: "inventory", label: "Produtos", to: "/admin/products" },
  { icon: "warehouse", label: "Fornecedores", to: "/admin/suppliers" },
  { icon: "groups_2", label: "Usuários", to: "/admin/users" },
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
