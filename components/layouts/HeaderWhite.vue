<template>
  <header class="header-white" :class="route.meta?.header?.class">
    <LayoutsHeaderProfile v-if="route.meta?.header?.showProfile" />
    <div class="header-bottom">
      <UContainer class="header-bottom-container">
        <div class="flex items-center gap-3 md:gap-4 min-w-0">
          <BaseLogo color="orange" />
          <template v-if="route.meta.header?.title">
            <hr class="brand-divider" />
            <p class="brand-title">{{ route.meta.header.title }}</p>
          </template>
        </div>
        <LayoutsSearchBar
          v-if="route.meta?.header?.showSearch"
          class="searchbar"
          :padded="false"
        />
      </UContainer>
    </div>
  </header>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.header-bottom-container {
  /* mobile: stack, desktop: sejajar */
  @apply flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-10;
  @apply py-4 md:py-7;
}
.header-brand {
  @apply flex items-center gap-3 md:gap-4 min-w-0;
}
/* garis pemisah: sembunyikan di mobile */
.brand-divider {
  @apply hidden md:block w-px h-5 bg-primary/80;
}
/* title: responsive size + truncate */
.brand-title {
  @apply text-lg md:text-xl font-normal truncate max-w-[60vw] md:max-w-none;
}
.searchbar {
  @apply w-full md:w-1/2;
}
</style>
