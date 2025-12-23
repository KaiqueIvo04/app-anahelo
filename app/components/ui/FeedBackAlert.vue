<template>
  <div
    v-if="message != ''"
    class="alert mb-3"
    :class="{
      'alert-error': type === 'error',
      'alert-success': type === 'success',
      'alert-warning': type === 'warning',
      'alert-info': type === 'info',
    }"
  >
    <span class="material-icons">
      {{ type === "error" ? "error" : "info" }}
    </span>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string;
  type: FeedbackType;
}>();
</script>
