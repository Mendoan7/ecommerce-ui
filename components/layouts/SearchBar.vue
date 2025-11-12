<template>
  <form
    :class="[
      'searchbar',
      $attrs.class, // hormati class dari parent (mis. flex-1 min-w-0)
      { 'no-padded': !padded },
    ]"
    @submit.prevent="handleSearch"
  >
    <input
      v-model="searchInput"
      type="search"
      inputmode="search"
      placeholder="Cek barang apa yang kamu cari"
      class="search-input"
    />
    <UButton
      type="submit"
      icon="i-heroicons:magnifying-glass"
      class="search-btn px-6"
      v-bind="attribute"
      aria-label="Cari"
    />
  </form>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

const props = defineProps({
  padded: { type: Boolean, default: true },
});

const router = useRouter();
const route = useRoute();
const searchInput = ref(route.query?.search || "");

const attribute = computed(() =>
  props.padded ? {} : { ui: { rounded: "rounded-none" } }
);

watch(
  () => route.query.search,
  (newSearch) => {
    searchInput.value = newSearch ?? "";
  }
);

function handleSearch() {
  router.push({
    path: "/search",
    query: { ...route.query, search: searchInput.value },
  });
}
</script>

<style scoped>
.searchbar {
  @apply flex items-center bg-white rounded-sm text-black w-full min-w-0 box-border;
}
.searchbar:not(.no-padded) {
  @apply p-1;
}
.searchbar.no-padded {
  @apply border-2 border-primary;
}

/* input fleksibel & menyusut */
.search-input {
  @apply flex-1 min-w-0 w-full outline-none pl-3 h-10;
  font-size: 16px; /* cegah auto-zoom iOS */
}

/* tombol jangan berebut ruang fleksibel */
.search-btn {
  @apply flex-none shrink-0;
}
</style>
