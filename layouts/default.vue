<template>
  <div class="default-layout">
    <div class="hidden md:block">
      <LayoutsHeaderAuth />
    </div>
    <div class="block md:hidden">
      <LayoutsMobileHeaderAuth />
    </div>
    <main class="main-layout bg-[#F5F5F5]">
      <slot />
    </main>
    <LayoutsFooter />
  </div>
</template>

<script setup></script>

<style scoped>
.default-layout {
  @apply flex flex-col min-h-screen;
}
.main-layout {
  @apply flex-1;
}
</style>
