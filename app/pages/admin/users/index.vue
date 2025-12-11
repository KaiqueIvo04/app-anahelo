<template>
  <div class="w-full flex justify-center">
    <div class="m-15 w-full max-w-4xl flex flex-col items-center">
      <div class="w-full">
        <h1 class="text-2xl font-semibold text-center">Usuários</h1>
        <div class="divider my-2"></div>
      </div>

      <div
        class="w-full mt-6 overflow-x-auto rounded-box border border-base-300 bg-base-100"
      >
        <TableComponent :rows="users" :columns="columns" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/interfaces/user";
const loading = ref(true);

const users = ref<User[]>([]);

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "type", label: "Tipo" },
];

definePageMeta({
  layout: "private",
});

async function getUsers() {
  try {
    loading.value = true;

    const { data, error } = await useAPI<User[]>("/users", {
      method: "get",
    });

    if (error.value) {
      console.error("Erro ao carregar usuários:", error.value);
      return;
    }

    if (data.value) {
      users.value = data.value.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        type: u.type,
      }));
    }

  } catch (error) {
    console.error("Erro inesperado:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(getUsers)
setTimeout(() => (loading.value = false), 800);
</script>
