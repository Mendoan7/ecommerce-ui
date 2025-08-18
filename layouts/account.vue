<template>
  <div class="account-layout">
    <!-- Desktop header -->
    <div class="hidden md:block">
      <LayoutsHeaderAuth />
    </div>

    <!-- Mobile header -->
    <div class="block md:hidden">
      <!-- auto-import: components/layouts/mobile/headerauth.vue => <LayoutsMobileHeaderauth /> -->
      <LayoutsMobileHeaderAuth />
    </div>

    <!-- Konten: putih di mobile, abu di desktop -->
    <main class="main-layout bg-white md:bg-[#F5F5F5]">
      <slot />
    </main>

    <!-- Footer di semua device (ubah ke hidden md:block kalau mau desktop-only) -->
    <LayoutsFooter />
  </div>
</template>

<script setup></script>

<style scoped>
.account-layout {
  @apply flex flex-col min-h-screen;
}
.main-layout {
  @apply flex-1;
}
</style>
