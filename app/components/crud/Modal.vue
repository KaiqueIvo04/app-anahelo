<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-2xl">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">{{ title }}</h3>
        <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
          ✕
        </button>
      </div>
      
      <!-- Conteúdo (o que você colocar dentro do modal) -->
      <div class="py-4">
        <slot />
      </div>
    </div>
    
    <!-- Fundo escuro (clicável para fechar) -->
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
// Props: dados que o componente recebe de fora
const props = defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

// Referência ao elemento <dialog>
const dialogRef = ref<HTMLDialogElement | null>(null);

// Watch: observa mudanças no modelValue
watch(() => props.modelValue, (novoValor) => {
  if (!dialogRef.value) return;
  
  if (novoValor) {
    // Se mudou para true, abre o modal
    dialogRef.value.showModal();
  } else {
    // Se mudou para false, fecha o modal
    dialogRef.value.close();
  }
});

// Função para fechar o modal
function closeModal() {
  emit("update:modelValue", false);
}

// Garante que o modal está fechado ao montar
onMounted(() => {
  if (dialogRef.value && !props.modelValue) {
    dialogRef.value.close();
  }
});
</script>