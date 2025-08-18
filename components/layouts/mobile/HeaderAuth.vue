<template>
  <div class="layouts-header-mobile md:hidden">
    <UContainer>
      <div class="flex items-center gap-4">
        <NuxtLink v-if="isMyAccount" to="/" aria-label="Beranda">
          <UIcon name="i-heroicons:home-20-solid" class="w-6 h-6" />
        </NuxtLink>

        <LayoutsSearchBar class="w-full search" />

        <ClientOnly>
          <UChip
            :text="countCart"
            size="lg"
            :show="countCart > 0"
            class="shrink-0"
          >
            <UButton
              to="/cart"
              variant="link"
              class="p-0 flex items-center"
              aria-label="Keranjang"
            >
              <IconCart />
            </UButton>
          </UChip>
        </ClientOnly>

        <NuxtLink :to="userLink" class="flex items-center" aria-label="Akun">
          <UAvatar
            :src="session.profile.photo_url"
            :alt="session.profile.name || 'Akun'"
            icon="i-heroicons:user"
            img-class="object-cover"
          />
        </NuxtLink>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const session = useSession();
const route = useRoute();
// tampilkan tombol Home hanya di halaman akun
const isMyAccount = computed(() => route.path.startsWith("/my-account"));

// cart hanya saat login
const { data, refresh } = useApi("/server/api/cart", {
  server: false,
  immediate: !!session.token,
  watch: [() => session.token],
  key: () =>
    session.token ? `cart-${session.user?.id || "me"}` : "cart-guest",
});

watch(
  () => session.token,
  (t) => {
    if (!t) data.value = null;
    else if (!data.value) refresh();
  },
  { immediate: true }
);

const countCart = computed(
  () => data.value?.data?.items?.reduce((sum, it) => sum + it.qty, 0) ?? 0
);

// avatar → halaman menu akun
const userLink = computed(() => (session.token ? "/my-account" : "/login"));
</script>

<style scoped>
.layouts-header-mobile {
  @apply bg-gradient-to-b from-primary to-[#FF6633] py-3 text-white;
}
.search :deep(input) {
  @apply h-10 rounded-full bg-white text-black placeholder:text-black/60 px-4;
  box-shadow: none !important;
}
</style>
