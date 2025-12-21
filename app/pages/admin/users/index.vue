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

// ✅ Simples e direto - URL base e token já configurados
const { data: users, pending, refresh, error } = await useAPI<User[]>("/users", {
  lazy: true,
})

const modalValue = ref(false)
const selectedUser = ref<User | undefined>(undefined)

const modalTitle = computed(() => {
  return selectedUser.value ? "Editar Usuário" : "Novo Usuário"
})

async function createUser(userData: UserForm) {
  const { data, error } = await useAPI<User>("/auth/signup", {
    method: "POST",
    body: userData,
  })

  if (!error.value) {
    console.log(error.value)
    await refresh()
    closeModal()
  }
}

async function editUser(userData: UserForm) {
  const { data, error } = await useAPI<User>(`/users/${userData.id}`, {
    method: "PUT",
    body: userData,
  })

  if (!error.value) {
    await refresh()
    closeModal()
  }
}

async function deleteUser(userId: number) {
  if (!confirm("Deseja realmente excluir este usuário?")) return

  const { error } = await useAPI(`/users/${userId}`, {
    method: "DELETE",
  })

  if (!error.value) {
    await refresh()
  }
}

function openModalCreate() {
  selectedUser.value = undefined
  modalValue.value = true
}

function openModalEdit(user: User) {
  selectedUser.value = { ...user }
  modalValue.value = true
}

function closeModal() {
  modalValue.value = false
  selectedUser.value = undefined
}
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="m-15 w-full max-w-4xl flex flex-col items-center">
      <div class="w-full flex items-center gap-3 p-2">
        <div class="h-8 border-l-4 border-primary"></div>
        <span class="material-icons text-3xl"> group </span>
        <h1 class="text-2xl font-semibold">Usuários</h1>
      </div>

      <div v-if="error" class="alert alert-error">
        Erro ao carregar usuários: {{ error.message }}
      </div>

      <div class="w-full mt-6 overflow-x-auto border border-base-300 bg-base-100">
        <CrudTable
          :rows="users || []"
          :columns="columns"
          :loading="pending"
          :can-create="true"
          @create="openModalCreate"
          @edit="openModalEdit"
          @delete="deleteUser"
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