<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="visible && message !== ''"
        class="alert overflow-hidden fixed top-4 left-1/2 -translate-x-1/2 z-9999 w-[90%] max-w-xl"
        :class="{
          'alert-error': type === 'error',
          'alert-success': type === 'success',
          'alert-warning': type === 'warning',
          'alert-info': type === 'info',
        }"
      >
        <span class="material-icons">{{ icon }}</span>

        <span class="flex-1">{{ message }}</span>

        <!-- Botão fechar -->
        <button
          @click="close"
          class="btn btn-sm btn-ghost btn-circle ml-2"
          aria-label="Fechar"
        >
          <span class="material-icons text-sm">close</span>
        </button>

        <!-- Barra de progresso -->
        <div
          v-if="showProgress && duration > 0"
          class="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all ease-linear"
          :style="{
            width: `${progress}%`,
            transitionDuration: `${duration}ms`,
          }"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { FeedbackType } from "~/composables/useFeedback";

interface Props {
  message: string;
  type: FeedbackType;
  duration?: number;
  showProgress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000,
  showProgress: true,
});

const visible = ref(false);
const progress = ref(100);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const icon = computed(() => {
  switch (props.type) {
    case "success":
      return "check_circle";
    case "error":
      return "block";
    case "warning":
      return "warning";
    default:
      return "info";
  }
});

function close() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  visible.value = false;
}

function startTimer() {
  // Limpa timeout anterior
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  visible.value = true;
  progress.value = 100;

  // Inicia animação da barra
  if (props.showProgress && props.duration > 0) {
    setTimeout(() => {
      progress.value = 0;
    }, 50);
  }

  // Auto-dismiss
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
}

// Observa mudanças na mensagem para mostrar o alerta
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage && newMessage !== "") {
      startTimer();
    } else {
      close();
    }
  },
  { immediate: true }
);

// Limpa o timeout ao desmontar
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>