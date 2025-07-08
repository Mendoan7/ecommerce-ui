<template>
  <UButton class="logo" variant="link" :color="color" to="/"> Syopee </UButton>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "white",
    validator: (propsValue) => ["white", "orange"].includes(propsValue),
  },
});
</script>

<style scoped>
.logo {
  @apply text-4xl;
  @apply !no-underline;
}
</style>
