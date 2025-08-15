<template>
  <div class="flex flex-col gap-6 pb-6 sm:gap-8 sm:pb-10">
    <section class="banner-section">
      <UContainer>
        <div
          class="mx-auto w-full max-w-[796px] aspect-[3.39/1] overflow-hidden rounded-lg"
        >
          <BaseCarousel aspect-ratio="3.39/1" :items="items" class="mx-auto" />
        </div>
      </UContainer>
    </section>
    <section class="category-section">
      <UContainer>
        <div class="category-section-card">
          <div class="category-section-header">
            <h2>Kategori</h2>
          </div>
          <div class="category-section-content">
            <FeatureHomepageCategoryItem
              v-for="cat in categories"
              :key="`cat-${cat.slug}`"
              :title="cat.name"
              :image="cat.icon"
              :slug="cat.slug"
              class="snap-start"
            />
          </div>
        </div>
      </UContainer>
    </section>
    <section class="product-section">
      <UContainer>
        <div class="product-section-header">
          <h2>Rekomendasi</h2>
        </div>
        <div class="product-section-content">
          <BaseProductCard
            v-for="product in productList?.data"
            :key="`product-${product.uuid}`"
            :title="product.name"
            :price="product?.price_sale || product?.price"
            :image="product.image_url"
            :slug="product.slug"
            :discount="product?.price_discount_percentage"
          />
        </div>
      </UContainer>
    </section>

    <UContainer>
      <UButton
        v-if="!session.token"
        color="white"
        class="font-normal w-full sm:w-auto sm:px-10"
        to="/login"
      >
        Login untuk Lihat Lainnya
      </UButton>
      <UButton
        v-else-if="productList?.next_page_url"
        color="white"
        class="font-normal w-full sm:w-auto sm:px-10"
        @click="loadMore"
      >
        Lihat Lainnya
      </UButton>
    </UContainer>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const session = useSession();

const pagination = ref({
  page: 1,
});

const { data: oldProductData } = useNuxtData("product-homepage");

const { data: respSlider } = useApi("/server/api/slider", {
  key: "slider-banner",
  getCachedData() {
    return (
      nuxtApp.payload.data?.["slider-banner"] ||
      nuxtApp.static.data?.["slider-banner"]
    );
  },
});

const { data: categories } = useApi("/server/api/category", {
  key: "category-list",
  transform(response) {
    return (response?.data || []).map((parent) => ({
      slug: parent.slug,
      name: parent.name,
      icon: parent.icon,
    }));
  },
  getCachedData() {
    return (
      nuxtApp.payload.data?.["category-list"] ||
      nuxtApp.static.data?.["category-list"]
    );
  },
});

const { data: productList, execute } = useApi("/server/api/product", {
  params: pagination,
  key: "product-homepage",
  onResponse({ response }) {
    if (response.ok) {
      pagination.value.page = response._data.data?.current_page;
    }
  },
  transform(response) {
    // return response?.data?.data || []
    if (pagination.value.page === 1) return response?.data;
    const newData = response?.data?.data || [];
    return {
      ...response.data,
      data: [...(oldProductData.value?.data || []), ...newData],
    };
  },
  watch: false,
});

// 10 product + 10 product

const items = computed(() =>
  (respSlider.value?.data || [])?.map((slider) => slider.image)
);

function loadMore() {
  pagination.value.page++;
  execute();
}

useSeoMeta({
  ogImage: () => items.value?.[0],
  twitterImage: () => items.value?.[0],
});
</script>

<style scoped>
.banner-section {
  @apply bg-white py-4 sm:py-7;
}
.category-section-card {
  @apply bg-white;
}
.category-section-header {
  @apply p-4 sm:p-5 border-b border-black/5;
}
.category-section-header h2 {
  @apply text-sm sm:text-base text-black/55 font-medium uppercase;
}
.product-section-header {
  @apply bg-white border-b-4 border-primary p-4 sm:p-5;
}
.product-section-header h2 {
  @apply text-sm sm:text-base text-primary font-medium text-center uppercase;
}
.product-section-content {
  @apply grid gap-3 sm:gap-4 mt-3
  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6;
}

/* Mobile: 2 baris + swipe ke kanan */
.category-section-content {
  --w: 9rem; /* lebar kolom saat swipe */
  @apply grid gap-3 mt-3 grid-rows-2 grid-flow-col
         overflow-x-auto snap-x snap-mandatory
         overscroll-x-contain -mx-2 px-2;
  grid-auto-columns: var(--w);
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.category-section-content::-webkit-scrollbar {
  display: none;
}
.category-section-content > * {
  @apply snap-start;
}

/* ≥sm: balik ke grid biasa multi-kolom */
@screen sm {
  .category-section-content {
    @apply grid-rows-none grid-flow-row overflow-visible snap-none
           mx-0 px-0 gap-4 grid-cols-3;
    grid-auto-columns: unset;
  }
}
@screen md {
  .category-section-content {
    @apply grid-cols-4;
  }
}
@screen lg {
  .category-section-content {
    @apply grid-cols-6;
  }
}
@screen xl {
  .category-section-content {
    @apply grid-cols-7;
  }
}
</style>
