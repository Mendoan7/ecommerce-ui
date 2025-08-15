<template>
  <UContainer id="search-section">
    <div class="search-filter" v-show="isFilterOpen || isDesktop">
      <div class="filter-title">
        <IconFilter />
        <h2>Filter</h2>
      </div>

      <div class="filter-item">
        <h3>Batas Harga</h3>
        <div class="flex gap-2 items-center">
          <UInput
            v-model="temporaryPrice.minimum_price"
            type="number"
            placeholder="Rp MIN"
          />
          <div class="h-[1px] bg-gray-300 w-10" />
          <UInput
            v-model="temporaryPrice.maximum_price"
            type="number"
            placeholder="Rp MAX"
          />
        </div>
        <UButton block class="py-2" @click="applyFilterPrice">TERAPKAN</UButton>
      </div>
      <hr />
      <div class="filter-item">
        <h3>Berdasarkan Kategori</h3>
        <p v-if="activeParent" class="text-primary font-medium mb-1">
          {{ activeParent.name }}
        </p>
        <div class="flex flex-col gap-2 max-h-[18rem] overflow-auto pr-1">
          <UCheckbox
            v-for="cat in sidebarChildren"
            :key="`cat-${cat.slug}`"
            v-model="formFilter.categories"
            :label="cat.name"
            :value="cat.slug"
          />
        </div>
      </div>
      <hr />
      <UButton block class="py-2" @click="resetFilter">HAPUS SEMUA</UButton>
    </div>
    <div class="search-result">
      <!-- Toggle hanya mobile -->
      <div class="filter-toggle-mobile">
        <UButton
          :icon="
            isFilterOpen
              ? 'i-heroicons:chevron-up-20-solid'
              : 'i-heroicons:chevron-down-20-solid'
          "
          :label="isFilterOpen ? 'Sembunyikan Filter' : 'Tampilkan Filter'"
          color="white"
          @click="toggleFilter"
        />
      </div>
      <!-- End toggle mobile -->
      <div v-if="route.query.search" class="search-keyword">
        <IconLamp />
        <p>
          Hasil pencarian untuk '<span class="font-bold">
            {{ route.query?.search }} </span
          >'
        </p>
      </div>
      <div class="search-sort">
        <div class="search-sort-control">
          <p>Urutkan Berdasarkan:</p>
          <UButton
            :color="formFilter.sorting_price === 'asc' ? 'primary' : 'white'"
            class="px-6"
            @click="formFilter.sorting_price = 'asc'"
            >Termurah
          </UButton>
          <UButton
            :color="formFilter.sorting_price === 'desc' ? 'primary' : 'white'"
            class="px-6"
            @click="formFilter.sorting_price = 'desc'"
            >Termahal
          </UButton>
        </div>
        <div v-if="data?.data?.data?.length" class="search-sort-pagination">
          <p>
            <span>{{ pagination.page }}</span
            >/<span>{{ data?.data?.last_page || 0 }}</span>
          </p>
          <div>
            <UButton
              icon="i-heroicons:chevron-left-20-solid"
              color="gray"
              size="xs"
              :disabled="!data?.data?.prev_page_url"
              @click="pagination.page--"
            />
            <UButton
              icon="i-heroicons:chevron-right-20-solid"
              color="gray"
              size="xs"
              class="bg-black/5"
              :disabled="!data?.data?.next_page_url"
              @click="pagination.page++"
            />
          </div>
        </div>
      </div>
      <div v-if="status === 'pending'" class="search-content">
        <div v-for="i in 5" :key="`loading-${i}`" class="bg-white p-2">
          <USkeleton class="aspect-[1/1]" />
          <USkeleton class="w-full h-4 mt-2" />
          <USkeleton class="w-8/12 h-4 mt-2" />
        </div>
      </div>
      <template v-else>
        <template v-if="data?.data?.data?.length">
          <div class="search-content">
            <BaseProductCard
              v-for="prod in data?.data?.data"
              :key="`product-${prod.uuid}`"
              :title="prod.name"
              :price="prod.price_sale || prod.price"
              :image="prod.image_url"
              :sale="prod.sale_count"
              :slug="prod.slug"
              :discount="prod.price_discount_percentage"
            />
          </div>
          <div class="flex justify-center mt-8">
            <BasePagination
              v-model="pagination.page"
              :total="data?.data?.total || 0"
            />
          </div>
        </template>
        <div v-else class="text-center py-4 text-black/65">
          Tidak ada product yang ditemukan
        </div>
      </template>
    </div>
  </UContainer>
</template>

<!-- <script setup>
const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();

const pagination = ref({ page: Number(route.query?.page) || 1 });

const formFilter = ref({
  // Child categories selected by user (checkbox)
  categories: Array.isArray(route.query?.categories)
    ? route.query.categories
    : [],
  minimum_price: route.query?.minimum_price ?? undefined,
  maximum_price: route.query?.maximum_price ?? undefined,
  sorting_price: route.query?.sorting_price || "asc",
});

const temporaryPrice = reactive({
  minimum_price: route.query?.minimum_price || undefined,
  maximum_price: route.query?.maximum_price || undefined,
});

// --- Category Tree (SSR-safe) ---
const { data: categoryTree } = useApi("/server/api/category", {
  key: "category-tree",
  server: true,
  lazy: false,
  getCachedData() {
    return (
      nuxtApp.payload.data?.["category-tree"] ||
      nuxtApp.static.data?.["category-tree"]
    );
  },
});
const tree = computed(
  () => categoryTree.value?.data || categoryTree.value || []
);

// --- Active parent from URL (?category=<parent-slug>) ---
const activeParentSlug = computed(() =>
  typeof route.query?.category === "string" ? route.query.category : null
);
const activeParent = computed(() => {
  if (!tree.value.length) return null;
  if (activeParentSlug.value)
    return tree.value.find((p) => p.slug === activeParentSlug.value) || null;
  // Fallback legacy: ?categories=<parent-slug> (string)
  const qCat = route.query?.categories;
  if (typeof qCat === "string")
    return tree.value.find((p) => p.slug === qCat) || null;
  return null;
});

// --- Sidebar children list ---
const sidebarChildren = computed(() =>
  activeParent.value
    ? activeParent.value.childs || []
    : tree.value.flatMap((p) => p.childs || [])
);

// --- Categories sent to API ---
// Rule:
// 1) If user picked children -> use them
// 2) Else if there is active parent (?category=) -> use all its children
// 3) Else if legacy ?categories=<slug> string:
//      - if parent -> all its children
//      - if child  -> [slug]
// 4) Else -> undefined (no category filter)
const requestedCategories = computed(() => {
  const selected = formFilter.value.categories;
  if (selected?.length) return selected;

  if (activeParent.value)
    return (activeParent.value.childs || []).map((c) => c.slug);

  const qCat = route.query?.categories;
  if (typeof qCat === "string" && tree.value.length) {
    const parent = tree.value.find((p) => p.slug === qCat);
    if (parent) return (parent.childs || []).map((c) => c.slug);
    if (tree.value.some((p) => (p.childs || []).some((c) => c.slug === qCat)))
      return [qCat];
  }

  return undefined;
});

// --- Products API ---
const { data, status } = useApi("/server/api/product", {
  params: computed(() => ({
    search: route.query?.search || undefined,
    page: pagination.value.page,
    minimum_price: formFilter.value.minimum_price,
    maximum_price: formFilter.value.maximum_price,
    sorting_price: formFilter.value.sorting_price,
    categories: undefined,
    "categories[]": requestedCategories.value,
  })),
  dedupe: "defer",
});

// --- URL sync (clean, no hydration mismatch) ---
// 1) Filters change -> reset page, push to URL (do not touch ?category)
watch(
  formFilter,
  (nv) => {
    pagination.value.page = 1;
    const q = {
      ...route.query,
      minimum_price: nv.minimum_price,
      maximum_price: nv.maximum_price,
      sorting_price: nv.sorting_price,
    };
    if (nv.categories?.length) q.categories = nv.categories;
    else delete q.categories;
    delete q.page; // reset page in URL when filters change
    router.push({ query: q });
  },
  { deep: true }
);

// 2) Page change -> reflect in URL (replace to avoid history spam)
watch(
  () => pagination.value.page,
  (p) => {
    const q = { ...route.query, page: p };
    router.replace({ query: q });
  }
);

function applyFilterPrice() {
  formFilter.value.minimum_price = temporaryPrice.minimum_price;
  formFilter.value.maximum_price = temporaryPrice.maximum_price;
}

function resetFilter() {
  formFilter.value = {
    categories: [],
    minimum_price: undefined,
    maximum_price: undefined,
    sorting_price: "asc",
  };
  temporaryPrice.minimum_price = undefined;
  temporaryPrice.maximum_price = undefined;
}

// --- SEO meta ---
const titleMeta = computed(() => {
  if (route.query?.search) return `Sedang mencari produk ${route.query.search}`;
  if (activeParent.value) return `Produk kategori ${activeParent.value.name}`;
  return "Sedang mencari produk";
});
useSeoMeta({
  title: titleMeta,
  ogTitle: () => `${titleMeta.value} | Syopee`,
  twitterTitle: () => `${titleMeta.value} | Syopee`,
  description: titleMeta,
  ogDescription: titleMeta,
  twitterDescription: titleMeta,
});
</script> -->

<script setup>
const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const isFilterOpen = ref(false);
const isDesktop = ref(false);

// --- Guards to avoid hydration mismatch ---
const isClientReady = ref(false);
onMounted(() => {
  isClientReady.value = true;
});

// --- State ---
const pagination = ref({ page: Number(route.query?.page) || 1 });

const formFilter = ref({
  // Only user-picked children (checkbox). We do NOT auto-fill from parent.
  categories: Array.isArray(route.query?.categories)
    ? route.query.categories
    : [],
  minimum_price: route.query?.minimum_price ?? undefined,
  maximum_price: route.query?.maximum_price ?? undefined,
  sorting_price: route.query?.sorting_price || "asc",
});

const temporaryPrice = reactive({
  minimum_price: route.query?.minimum_price ?? undefined,
  maximum_price: route.query?.maximum_price ?? undefined,
});

// --- Category tree (SSR) ---
const { data: categoryTree } = useApi("/server/api/category", {
  key: "category-tree",
  server: true,
  lazy: false,
  getCachedData() {
    return (
      nuxtApp.payload.data?.["category-tree"] ||
      nuxtApp.static.data?.["category-tree"]
    );
  },
});
const tree = computed(
  () => categoryTree.value?.data || categoryTree.value || []
);

// --- Active parent from URL (?category=<slug>) ---
const activeParentSlug = computed(() =>
  typeof route.query?.category === "string" ? route.query.category : null
);
const activeParent = computed(() => {
  if (!tree.value.length || !activeParentSlug.value) return null;
  return tree.value.find((p) => p.slug === activeParentSlug.value) || null;
});

// --- Sidebar children (list) ---
const sidebarChildren = computed(() =>
  activeParent.value
    ? activeParent.value.childs || []
    : tree.value.flatMap((p) => p.childs || [])
);

// --- Categories sent to API (single source of truth) ---
// 1) If user picked children -> use them
// 2) Else if ?category=<parent> exists -> use all its children
// 3) Else if legacy ?categories=<slug> (string):
//    - if parent -> all its children
//    - if child  -> [slug]
// 4) Else -> undefined (no category filter)
const requestedCategories = computed(() => {
  if (formFilter.value.categories?.length) return formFilter.value.categories;

  if (activeParent.value) {
    return (activeParent.value.childs || []).map((c) => c.slug);
  }

  const qCat = route.query?.categories;
  if (typeof qCat === "string" && tree.value.length) {
    const parent = tree.value.find((p) => p.slug === qCat);
    if (parent) return (parent.childs || []).map((c) => c.slug);
    if (tree.value.some((p) => (p.childs || []).some((c) => c.slug === qCat))) {
      return [qCat];
    }
  }

  return undefined;
});

// --- Products API (SSR) ---
const { data, status } = useApi("/server/api/product", {
  key: "search-products",
  server: true,
  lazy: false,
  params: computed(() => ({
    search: route.query?.search || undefined,
    page: pagination.value.page,
    minimum_price: formFilter.value.minimum_price,
    maximum_price: formFilter.value.maximum_price,
    sorting_price: formFilter.value.sorting_price,
    categories: undefined,
    "categories[]": requestedCategories.value,
  })),
  getCachedData() {
    return (
      nuxtApp.payload.data?.["search-products"] ||
      nuxtApp.static.data?.["search-products"]
    );
  },
});

// --- URL sync (only after mounted) ---
watch(
  formFilter,
  (nv) => {
    if (!isClientReady.value) return;
    pagination.value.page = 1;

    const q = {
      ...route.query,
      minimum_price: nv.minimum_price,
      maximum_price: nv.maximum_price,
      sorting_price: nv.sorting_price,
    };

    if (nv.categories?.length) q.categories = nv.categories;
    else delete q.categories;

    delete q.page; // reset page on filter change
    router.push({ query: q });
  },
  { deep: true }
);

watch(
  () => pagination.value.page,
  (p) => {
    if (!isClientReady.value) return;
    router.replace({ query: { ...route.query, page: p } });
  }
);

// --- Actions ---
function applyFilterPrice() {
  formFilter.value.minimum_price = temporaryPrice.minimum_price;
  formFilter.value.maximum_price = temporaryPrice.maximum_price;
}
function resetFilter() {
  formFilter.value = {
    categories: [],
    minimum_price: undefined,
    maximum_price: undefined,
    sorting_price: "asc",
  };
  temporaryPrice.minimum_price = undefined;
  temporaryPrice.maximum_price = undefined;
}

onMounted(() => {
  const mq = window.matchMedia("(min-width: 768px)"); // md breakpoint Tailwind
  const apply = () => {
    isDesktop.value = mq.matches;
    // Desktop: selalu terbuka; Mobile: default tertutup
    isFilterOpen.value = mq.matches ? true : false;
  };
  apply();
  mq.addEventListener("change", apply);
  onUnmounted(() => mq.removeEventListener("change", apply));
});

function toggleFilter() {
  // di desktop tetap open; di mobile bisa toggle
  if (!isDesktop.value) isFilterOpen.value = !isFilterOpen.value;
}

// --- SEO ---
const titleMeta = computed(() => {
  if (route.query?.search) return `Sedang mencari produk ${route.query.search}`;
  if (activeParent.value) return `Produk kategori ${activeParent.value.name}`;
  return "Sedang mencari produk";
});
useSeoMeta({
  title: titleMeta,
  ogTitle: () => `${titleMeta.value} | Syopo`,
  twitterTitle: () => `${titleMeta.value} | Syopo`,
  description: titleMeta,
  ogDescription: titleMeta,
  twitterDescription: titleMeta,
});
</script>

<style scoped>
#search-section {
  @apply py-6 flex gap-4;
}

/* Mobile: stack filter & hasil */
@media (max-width: 767px) {
  #search-section {
    @apply flex-col;
  }
}

/* Sidebar */
.search-filter {
  @apply flex flex-col gap-5 w-60;
}
/* Desktop: sticky & fixed width */
@media (min-width: 768px) {
  .search-filter {
    @apply sticky top-24 shrink-0;
  }
}
/* Mobile: full width */
@media (max-width: 767px) {
  .search-filter {
    @apply w-full;
  }
}

/* Toggle bar (mobile only) */
.filter-toggle-mobile {
  display: none;
}
@media (max-width: 767px) {
  .filter-toggle-mobile {
    display: block;
    margin-bottom: 0.5rem; /* gap kecil */
  }
}

.filter-title {
  @apply flex gap-2 items-center;
}
.filter-title h2 {
  @apply text-base font-bold text-black/80 uppercase;
}

.filter-item {
  @apply flex flex-col gap-5;
}
.filter-item h3 {
  @apply text-sm text-black/80 font-medium;
}

.search-result {
  @apply flex-1 min-w-0;
}

.search-keyword {
  @apply flex items-center gap-2 text-gray-600;
}
.search-keyword span {
  @apply text-primary;
}

.search-sort {
  @apply flex items-center gap-2 justify-between px-5 py-3 bg-black/5 mt-4;
  @apply flex-wrap;
}
.search-sort-control {
  @apply flex gap-3 items-center flex-wrap;
}
.search-sort-control p {
  @apply text-gray-600 text-sm font-normal;
}

.search-sort-pagination {
  @apply flex gap-5 items-center;
}
.search-sort-pagination p {
  @apply text-sm font-normal text-black/80;
}
.search-sort-pagination span {
  @apply text-primary;
}

/* Mobile: sort section stack */
@media (max-width: 639px) {
  .search-sort {
    @apply flex-col items-start gap-3;
  }
  .search-sort-pagination {
    @apply w-full justify-between;
  }
}

.search-content {
  @apply grid gap-3 mt-3;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

/* Tablet: 3 kolom, Mobile: 2 kolom */
@media (max-width: 1023px) {
  .search-content {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .search-content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
