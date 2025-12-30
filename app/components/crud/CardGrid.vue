<template>
  <div>
    <div class="flex justify-center pb-4">
      <button
        v-if="!hideCreate && canCreate"
        @click="$emit('create')"
        class="btn btn-lg btn-primary"
        :title="'Registrar'"
      >
        <span class="material-icons"> add </span>
        {{ createLabel }}
      </button>
    </div>
    <div class="w-full grid lg:grid-cols-4 md:grid-cols-2 gap-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    hideCreate?: boolean;
    canCreate?: boolean;
    createLabel?: string;
  }>(),
  {
    canCreate: true,
    createLabel: "NOVO",
  }
);

defineEmits<{
  create: [];
}>();
</script>
