<template>
  <div class="default-layout">
    <LayoutsHeaderAuth />
    <main class="main-layout"><slot /></main>
    <LayoutsFooter />
  </div>
</template>

<script setup></script>

<style scoped>
.default-layout {
  @apply flex flex-col;
  @apply min-h-screen;
}

.main-layout {
  @apply flex-1;
  @apply bg-[#F5F5F5];
}
</style>
