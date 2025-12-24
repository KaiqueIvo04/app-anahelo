<template>
  <div class="w-full flex justify-center">
    <div class="m-15 w-full max-w-4xl flex flex-col items-center">
      <div class="w-full flex items-center gap-3 p-2">
        <div class="h-8 border-l-4 border-primary"></div>
        <span class="material-icons text-3xl"> group </span>
        <h1 class="text-2xl font-semibold">Usuários</h1>
      </div>

      <UiFeedBackAlert
        :message="feedback.message.value"
        :type="feedback.type.value",
      />

      <div
        class="w-full mt-6 overflow-x-auto border border-base-300 bg-base-100"
      >
        <CrudTable
          :rows="users || []"
          :columns="columns"
          :loading="pending"
          :disable-row="isLoggedUser"
          :create-label="'NOVO USUÁRIO'"
          @create="openModalCreate"
          @edit="openModalEdit"
          @delete="deleteUser"
        />

        <CrudModal v-model="modalValue" :title="modalTitle">
          <FeatureUserForm
            :user="selectedUser"
            @save="saveUser"
            @cancel="closeModal"
          />
        </CrudModal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserForm } from "~/types/interfaces/user";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "type", label: "Tipo" },
];

definePageMeta({
  layout: "private",
});

const feedback = useFeedback();
const { data: users, pending, refresh, error } = await useAPI<User[]>("/users");

if (error.value) {
  feedback.show(`Erro ao carregar usuários: ${error.value.message}`, "error");
}

const loggedUserStore = useLoggedUserStore();
loggedUserStore.getCredential();

const loggedUser = computed(() => loggedUserStore.user);
const modalValue = ref(false);
const selectedUser = ref<User | undefined>(undefined);

const modalTitle = computed(() => {
  return selectedUser.value ? "EDITAR USUÁRIO" : "REGISTRAR USUÁRIO";
});

// Função para verificar se é o usuário logado
function isLoggedUser(user: any): boolean {
  return user.id === loggedUser.value?.id;
}

async function saveUser(userData: UserForm) {
  if (selectedUser.value) await editUser(userData);
  else await createUser(userData);
}

async function createUser(userData: UserForm) {
  const { error } = await useAPI<User>("/auth/signup", {
    method: "POST",
    body: userData,
  });

  if (error.value) {
    if (error.value.statusCode === 409) feedback.show("Erro: um usuário com esses dados já existe!", "error");
    if (error.value.statusCode === 400) feedback.show("Erro: dados inválidos!", "error");
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
    if (error.value.statusCode === 409) feedback.show("Erro: um usuário com esses dados já existe!", "error");
    if (error.value.statusCode === 400) feedback.show("Erro: dados inválidos!", "error");
  } else {
    feedback.show(`Usuário atualizado com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}
async function deleteUser(userData: UserForm) {
  if (!confirm("Deseja realmente excluir este usuário?")) return;

  const { error } = await useAPI(`/users/${userData.id}`, {
    method: "DELETE",
  });

  if (error.value) {
    feedback.show(`Erro ao remover usuário: ${error.value.message}`, "error");
  } else {
    feedback.show(`Usuário removido com sucesso!`, "success");
    await refresh();
    closeModal();
  }
}

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
