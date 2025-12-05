<template>
    My Account
</template>

<script setup lang="ts">
definePageMeta({
    layout: "private",
    middleware: "auth"
})
</script>