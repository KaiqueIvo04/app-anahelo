<template>
  <div class="w-full flex items-center gap-3 p-2">
    <div class="h-8 border-l-4 border-primary"></div>
    <span class="material-icons text-3xl"> group </span>
    <h1 class="text-2xl font-semibold">Usuários</h1>
  </div>

  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />

  <div class="w-full mt-6 overflow-x-auto border border-base-300 bg-base-100">
    <CrudTable
      :rows="users"
      :columns="columns"
      :loading="pending"
      :disable-row="isLoggedUser"
      :page="currentPage"
      :limit="itemsPerPage"
      :total="total"
      create-label="REGISTRAR USUÁRIO"
      @create="openModalCreate"
      @edit="openModalEdit"
      @delete="deleteUser"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
    />

    <CrudModal v-model="modalValue" :title="modalTitle">
      <FeatureUserForm
        :user="selectedUser"
        @save="saveUser"
        @cancel="closeModal"
      />
    </CrudModal>
  </div>
</template>

<script setup lang="ts">
import type { Column } from "~/types/interfaces/column";
import type { User, UserForm } from "~/types/interfaces/user";

const columns: Column[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "type", label: "Tipo" },
];

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const loggedUserStore = useLoggedUserStore();

// Estado da paginação
const currentPage = ref(1);
const itemsPerPage = ref(10);

const modalValue = ref(false);
const selectedUser = ref<User | undefined>(undefined);

loggedUserStore.getCredential();
const loggedUser = computed(() => loggedUserStore.user);
const modalTitle = computed(() => {
  return selectedUser.value ? "EDITAR USUÁRIO" : "REGISTRAR USUÁRIO";
});
const users = computed(() => data.value || []);

const { data, pending, refresh, error, feedback, total } = await useAPI<User[]>(
  "/users",
  {
    query: {
      page: currentPage,
      limit: itemsPerPage,
    },
    watch: [currentPage, itemsPerPage], // Refaz a requisição quando mudar,
  }
);

// Handlers de paginação
function handlePageChange(page: number) {
  currentPage.value = page;
}
function handleLimitChange(limit: number) {
  itemsPerPage.value = limit;
  currentPage.value = 1;
}

// Função para verificar se é o usuário logado
function isLoggedUser(user: any): boolean {
  return user.id === loggedUser.value?.id;
}

// Funções de CRUD
async function saveUser(userData: UserForm) {
  feedback.clear();
  if (selectedUser.value) await editUser(userData);
  else await createUser(userData);
}
async function createUser(userData: UserForm) {
  const { error } = await useAPI<User>("/auth/signup", {
    method: "POST",
    body: userData,
  });

  if (error.value) {
    if (error.value.statusCode === 409) {
      feedback.show("Erro: um usuário com esses dados já existe!", "error");
    }
    if (error.value.statusCode === 400) {
      feedback.show("Erro: dados inválidos!", "error");
    }
  } else {
    feedback.show(`Usuário registrado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function editUser(userData: UserForm) {
  const { error } = await useAPI<User>(`/users/${userData.id}`, {
    method: "PATCH",
    body: userData,
  });

  if (error.value) {
    if (error.value.statusCode === 409) {
      feedback.show("Erro: um usuário com esse E-mail já existe!", "error");
    }
    if (error.value.statusCode === 400) {
      feedback.show("Erro: dados inválidos!", "error");
    }
  } else {
    feedback.show(`Usuário atualizado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function deleteUser(userData: UserForm) {
  feedback.clear();
  if (!confirm("Deseja realmente excluir este usuário?")) return;

  const { error } = await useAPI(`/users/${userData.id}`, {
    method: "DELETE",
  });

  if (error.value) {
    if (error.value.statusCode === 404) {
      feedback.show(`Erro: O Usuário não existe ou já foi removido!`, "error");
    }
  } else {
    feedback.show(`Usuário removido com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}

// Funções do Modal
function openModalCreate() {
  selectedUser.value = undefined;
  modalValue.value = true;
}
function openModalEdit(user: User) {
  selectedUser.value = { ...user };
  modalValue.value = true;
}
function closeModal() {
  modalValue.value = false;
  selectedUser.value = undefined;
}
</script>
