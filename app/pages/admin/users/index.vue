<template>
  <div class="w-full flex justify-center">
    <div class="m-15 w-full max-w-4xl flex flex-col items-center">
      <div class="w-full flex items-center gap-3 p-2">
        <div class="h-8 border-l-4 border-primary"></div>

        <span class="material-icons text-3xl"> group </span>

        <h1 class="text-2xl font-semibold">Usuários</h1>
      </div>

      <div
        class="w-full mt-6 overflow-x-auto border border-base-300 bg-base-100"
      >
        <CrudTable
          :rows="users"
          :columns="columns"
          :loading="loading"
          :can-create="true"
          @create="openModalCreate"
        />

        <CrudModal v-model="modalValue" :title="modalTitle">
          <FeatureUserForm
            :user="selectedUser"
            @save="createUser"
            @cancel="closeModal"
          />
        </CrudModal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/interfaces/user";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "type", label: "Tipo" },
];

definePageMeta({
  layout: "private",
});

const loading = ref(true);
const users = ref<User[]>([]);
const modalValue = ref(false);
const selectedUser = ref<User | undefined>(undefined);

// Criando ou editando
const modalTitle = computed(() => {
  return selectedUser.value ? "Editar Usuário" : "Novo Usuário";
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

async function createUser() {
  alert("Salvando usuário!");
}

async function editUser() {
  alert("Editando usuário!");
}

// Abre modal para criar
function openModalCreate() {
  selectedUser.value = undefined;
  modalValue.value = true;
}

function closeModal() {
  modalValue.value = false;
  selectedUser.value = undefined;
}

onMounted(getUsers);
setTimeout(() => (loading.value = false), 800);
</script>
