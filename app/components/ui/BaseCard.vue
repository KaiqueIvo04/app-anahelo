<template>
  <div
    class="card card-sm bg-base-200 shadow-sm rounded-3xl
           lg:h-[370px] md:h-[450px]
           hover:bg-gray-200 transition ease duration-300"
  >
    <!-- Header (opcional) -->
    <div v-if="$slots.header">
      <slot name="header" />
    </div>

    <!-- Corpo -->
    <div class="card-body">
      <!-- Título -->
      <h2 v-if="title" class="card-title">
        {{ title }}
      </h2>

      <!-- Descrição -->
      <p
        v-if="description"
        class="text-base-content/80 line-clamp-3"
      >
        {{ description }}
      </p>

      <!-- Conteúdo livre -->
      <div class="">
        <slot />
      </div>

      <!-- Ações -->
      <div
        v-if="$slots.footer"
        class="card-actions mt-auto justify-end"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>
