<template>
  <header class="header-auth">
    <LayoutsHeaderProfile />
    <div class="header-bottom">
      <UContainer class="header-bottom-container">
        <BaseLogo />
        <LayoutsSearchBar v-if="defaultMeta.showSearch" class="search-flex" />
        <UChip
          v-if="defaultMeta.showCart"
          :text="countCart"
          size="2xl"
          :show="countCart > 0"
        >
          <UButton variant="link" to="/cart" class="icon-cart-btn">
            <IconCart />
          </UButton>
        </UChip>
      </UContainer>
    </div>
  </header>
</template>

<script setup>
const route = useRoute();

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

const { data } = useApi(`/server/api/cart`, {
  server: false,
  immediate: computed(() => !!session.token),
  key: "cart",
});

const countCart = computed(() =>
  data.value?.data?.items?.reduce((result, current) => {
    result += current.qty;
    return result;
  }, 0)
);
</script>

<style scoped>
.header-auth {
  @apply text-white;
  @apply flex flex-col;
}

.header-auth .header-bottom {
  @apply bg-gradient-to-b from-primary to-[#FF6633];
  @apply py-4 sm:py-6;
}

.header-bottom-container {
  @apply flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center justify-between;
}

.search-flex {
  @apply flex-1;
}
.icon-cart-btn {
  @apply p-0;
}
</style>
