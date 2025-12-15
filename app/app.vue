<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
<script setup lang="ts">
const { initTheme } = useTheme();

onMounted(initTheme);

// Reaplica após cada navegação
const route = useRoute();
watch(() => route.path, () => {
  nextTick(() => {
    initTheme();
  });
});
</script>