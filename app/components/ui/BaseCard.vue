<template>
  <div
    class="card card-sm w-full bg-base-200 shadow-sm rounded-3xl max-w-80 hover:bg-base-300 transition ease duration-300"
  >
    <!-- Header (opcional) -->
    <div v-if="$slots.header">
      <slot name="header" />
    </div>

    <!-- Corpo -->
    <div class="card-body">
      <!-- Título -->
      <div class="w-full">
        <h2 v-if="title" class="card-title">
          {{ title }}
        </h2>
        <p v-if="id" class="text-gray-500">
          ID: {{ id }}
        </p>
      </div>

      <!-- Descrição -->
      <p v-if="description" class="text-base-content/80 line-clamp-2">
        {{ description }}
      </p>

      <!-- Conteúdo livre -->
      <div class="">
        <slot />
      </div>

      <!-- Ações -->
      <div v-if="$slots.footer" class="card-actions mt-auto justify-end">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  title?: string;
  description?: string;
}>();
</script>
