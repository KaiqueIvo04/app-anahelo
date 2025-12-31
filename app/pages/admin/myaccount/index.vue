<template>
  <div class="w-full flex items-center gap-3 p-2">
    <div class="h-8 border-l-4 border-primary"></div>
    <span class="material-icons text-3xl"> person </span>
    <h1 class="text-2xl font-semibold">Meus Dados</h1>
  </div>

  <div class="mockup-window border shadow-md border-base-300 w-full mt-5">
    <div class="place-content-center border-t border-base-300 h-auto p-10">
      <div>
        <FeatureUserForm :user="user" @save="editUser" />
      </div>
    </div>
  </div>

  <UiFeedBackAlert
    :message="feedback.message.value"
    :type="feedback.type.value"
  />
</template>

<script setup lang="ts">
import type { User, UserForm } from "~/types/interfaces/user";

definePageMeta({
  layout: "private",
  middleware: "auth",
});

const loggedUserStore = useLoggedUserStore();
loggedUserStore.getCredential();
const user = loggedUserStore.user;

const feedback = useFeedback();

async function editUser(userData: UserForm) {
  const { data, error } = await useAPI<User>(`/users/${userData.id}`, {
    method: "PATCH",
    body: userData,
  });

  if (error.value) {
    if (error.value.statusCode === 409)
      feedback.show("Erro: um usuário com esses dados já existe!", "error");
    if (error.value.statusCode === 400)
      feedback.show("Erro: dados inválidos!", "error");
  } else {
    // Atualiza store + cookies
    loggedUserStore.setUser(data.value!);
    feedback.show(`Usuário atualizado com sucesso!`, "success");
  }
}
</script>
