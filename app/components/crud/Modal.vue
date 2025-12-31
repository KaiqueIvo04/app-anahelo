<template>
  <!-- Modal customizado sem <dialog> -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="modal modal-open"
        @click.self="closeModal"
      >
        <div class="modal-box max-w-2xl relative z-50">
          <!-- Cabeçalho -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">{{ title }}</h3>
            <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
              ✕
            </button>
          </div>
          
          <!-- Conteúdo -->
          <div class="py-4">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

function closeModal() {
  emit("update:modelValue", false);
}

// Previne scroll quando modal está aberto
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>