<template>
  <UCard>
    <h3 class="text-lg font-normal text-black/85">Penilaian Produk</h3>

    <!-- Ringkasan rating + filter -->
    <div
      class="rating-panel mt-3 border border-primary-100/80 bg-primary-50/30 rounded-sm p-4 sm:p-6 md:p-8"
    >
      <!-- Rating summary -->
      <div class="rating-summary">
        <p class="text-primary text-base sm:text-lg">
          <span class="text-2xl sm:text-3xl">{{ detail.rating }}</span> dari 5
        </p>
        <BaseRating
          :model-value="detail.rating"
          disabled
          size="lg"
          class="mt-2"
        />
      </div>

      <!-- Filter chips -->
      <div class="rating-filters">
        <div class="filters-scroller">
          <UButton
            v-for="filter in filterList"
            :key="filter.label"
            :variant="filterParam === filter.value ? 'outline' : 'solid'"
            :color="filterParam === filter.value ? 'primary' : 'white'"
            size="xs"
            class="chip"
            @click="filterParam = filter.value"
          >
            {{ filter.label }}
          </UButton>
        </div>
      </div>
    </div>
    <!-- /Ringkasan rating + filter -->

    <!-- Daftar review -->
    <div class="reviews-wrapper">
      <div
        v-for="review in data?.data"
        :key="`review-${review.user_name}-${review.created_at}`"
        class="review-item"
      >
        <UAvatar
          :src="review.user_photo"
          :alt="review.user_name"
          icon="i-heroicons:user"
          size="lg"
          img-class="object-cover"
        />

        <div class="review-body">
          <p class="review-name">{{ review.user_name }}</p>
          <BaseRating :model-value="review.star_seller" disabled class="mt-1" />

          <div class="review-meta">
            <p>{{ review.created_at }}</p>
            <span class="hidden sm:inline">|</span>
            <p>{{ review.variations }}</p>
          </div>

          <p v-if="review.description" class="review-text">
            {{ review.description }}
          </p>

          <div v-if="review.attachments?.length" class="review-media">
            <NuxtImg
              v-for="attach in review.attachments"
              :key="attach"
              width="96px"
              height="96px"
              fit="cover"
              format="webp"
              :src="attach"
              class="media-thumb"
            />
          </div>
        </div>
      </div>

      <div v-if="status === 'pending'" class="loading-row">
        <IconLoading class="w-6 text-primary" />
        <p>Loading...</p>
      </div>
    </div>
    <!-- /Daftar review -->

    <div v-if="data?.total" class="pagination-row">
      <BasePagination v-model="pagination.page" :total="data.total" />
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();
const pagination = ref({
  page: 1,
});

const filterParam = ref("");

const { data, status } = useApi(
  computed(() => `/server/api/product/${route.params.slug}/review`),
  {
    params: computed(() => {
      const filter = {};
      if (filterParam.value) {
        const [key, value] = filterParam.value.split(":");
        Object.assign(filter, { [key]: value });
      }
      return {
        ...pagination.value,
        ...filter,
      };
    }),
    transform(response) {
      return response?.data;
    },
  }
);

const filterList = computed(() => [
  {
    label: "Semua",
    value: "",
  },
  {
    label: `5 Bintang (${props.detail.review_summary?.[5]})`,
    value: "rating:5",
  },
  {
    label: `4 Bintang (${props.detail.review_summary?.[4]})`,
    value: "rating:4",
  },
  {
    label: `3 Bintang (${props.detail.review_summary?.[3]})`,
    value: "rating:3",
  },
  {
    label: `2 Bintang (${props.detail.review_summary?.[2]})`,
    value: "rating:2",
  },
  {
    label: `1 Bintang (${props.detail.review_summary?.[1]})`,
    value: "rating:1",
  },
  {
    label: `Dengan Komentar (${props.detail.review_summary?.with_description})`,
    value: "with_description:1",
  },
  {
    label: `Dengan Media (${props.detail.review_summary?.with_attachment})`,
    value: "with_attachment:1",
  },
]);
</script>

<style scoped>
.rating-panel {
  @apply flex flex-col md:flex-row gap-4 md:gap-8 items-stretch md:items-center;
}

.rating-summary {
  @apply flex flex-col items-center md:items-start md:min-w-48;
}

/* Area filter: bisa scroll horizontal di mobile */
.rating-filters {
  @apply w-full;
}
.filters-scroller {
  /* MOBILE (default) */
  @apply flex items-center gap-2 flex-nowrap overflow-x-auto py-1 -mx-1 px-1;
  scroll-snap-type: x proximity; /* geser lebih halus */
}

@screen md {
  .filters-scroller {
    /* DESKTOP */
    @apply flex-wrap overflow-visible mx-0 px-0;
    scroll-snap-type: none; /* matikan snap di desktop */
  }
}
.chip {
  @apply min-w-24 text-xs sm:text-sm justify-center whitespace-nowrap;
  @apply shrink-0 md:shrink;
}

/* Daftar review */
.reviews-wrapper {
  @apply flex flex-col mt-1 divide-y;
}
.review-item {
  @apply flex gap-3 py-4;
}
.review-body {
  @apply flex-1;
}
.review-name {
  @apply text-sm sm:text-base;
}
.review-meta {
  @apply flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-black/55 text-[11px] sm:text-xs;
}
.review-text {
  @apply text-sm mt-2;
}

/* Grid media responsif */
.review-media {
  @apply grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2;
}
.media-thumb {
  @apply w-24 h-24 sm:w-[88px] sm:h-[88px] md:w-24 md:h-24 rounded object-cover;
}

/* Loading & pagination */
.loading-row {
  @apply flex gap-2 justify-center py-6;
}
.pagination-row {
  @apply flex justify-center md:justify-end pt-5;
}

/* Responsif item review: stack avatar di atas pada layar kecil? 
   — tetap sejajar, tapi kalau ingin stack:
   Ganti .review-item di mobile jadi column: */
@media (max-width: 480px) {
  .review-item {
    @apply items-start;
  }
}
</style>
