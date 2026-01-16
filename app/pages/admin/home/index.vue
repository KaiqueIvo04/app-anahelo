<template>
  <div class="flex justify-center items-center h-full">
    <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
      <div
        v-for="card in cards"
        :key="card.to"
        class="card w-75 h-75 bg-base-300 shadow-sm rounded-3xl hover:bg-secondary transition ease duration-500"
      >
        <NuxtLink :to="card.to" class="card-body items-center justify-center">
          <span
            class="material-icons cursor-pointer select-none opacity-70"
            style="font-size: 64px"
          >
            {{ card.icon }}
          </span>
          {{ card.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
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

definePageMeta({
  layout: "private",
  middleware: "auth",
});
</script>
