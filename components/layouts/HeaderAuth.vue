<template>
  <header class="header-auth">
    <LayoutsHeaderProfile />
    <div class="header-bottom">
      <UContainer
        class="grid items-center gap-3 sm:gap-6 grid-cols-[auto_1fr_auto]"
      >
        <BaseLogo class="col-start-1 row-start-1" />
        <LayoutsSearchBar
          v-if="defaultMeta.showSearch"
          class="search-flex col-span-3 sm:col-span-1 col-start-1 sm:col-start-2 row-start-2 sm:row-start-1 w-full"
        />
        <ClientOnly>
          <UChip
            v-if="defaultMeta.showCart"
            :text="countCart"
            size="2xl"
            :show="countCart > 0"
            class="col-start-3 row-start-1 justify-self-end"
          >
            <UButton variant="link" to="/cart" class="icon-cart-btn">
              <IconCart />
            </UButton>
          </UChip>
        </ClientOnly>
      </UContainer>
    </div>
  </header>
</template>

<script setup>
const route = useRoute();
const session = useSession();

const defaultMeta = computed(() => {
  return {
    showProfile:
      route.meta?.header && "showProfile" in route.meta.header
        ? route.meta.header.showProfile
        : true,
    showSearch:
      route.meta?.header && "showSearch" in route.meta.header
        ? route.meta.header.showSearch
        : true,
    showCart:
      route.meta?.header && "showCart" in route.meta.header
        ? route.meta.header.showCart
        : true,
  };
});

const { data, refresh } = useApi(`/server/api/cart`, {
  server: false,
  immediate: !!session.token, // fetch langsung jika token sudah ada
  watch: [() => session.token], // fetch saat token berubah (mis. login)
  key: () =>
    session.token ? `cart-${session.user?.id || "me"}` : "cart-guest",
});

watch(
  () => session.token,
  (t) => {
    if (!t) data.value = null;
    // (opsional) kalau butuh force refresh setelah login:
    if (t && !data.value) refresh();
  },
  { immediate: true }
);

const countCart = computed(() =>
  data.value?.data?.items?.reduce((result, current) => {
    result += current.qty;
    return result;
  }, 0)
);
</script>

<style scoped>
.header-auth {
  @apply text-white flex flex-col;
}

.header-auth .header-bottom {
  @apply bg-gradient-to-b from-primary to-[#FF6633] py-4 sm:py-6;
}

/* Search di desktop biar fleksibel */
.search-flex {
  @apply sm:flex-1;
}

/* Perbesar area sentuh ikon cart */
.icon-cart-btn {
  @apply p-0;
}
.icon-cart-btn :deep(svg) {
  width: 1.75rem;
  height: 1.75rem;
} /* ~28px */

/* (Opsional) kecilkan jarak vertikal antar section di mobile */
@media (max-width: 639px) {
  .header-auth .header-bottom {
    @apply py-3;
  }
}
</style>
