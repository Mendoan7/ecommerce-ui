<template>
  <div class="flex flex-col gap-6 pb-6">
    <section class="banner-section">
      <UContainer>
        <FeatureHomepageCarousel :items="items" />
      </UContainer>
    </section>
    <section class="content-section">
      <UContainer>
        <div class="category-section-card">
          <div class="category-section-header">
            <h2>Kategori</h2>
          </div>
          <div class="category-section-content">
            <FeatureHomepageCategoryItem
              v-for="i in 20"
              :key="`cat-${i}`"
              title="Handphone"
              image="~/assets/images/handphone.png"
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
            v-for="i in 36"
            :key="`product-${i}`"
            title="ASICS Sepatu Lari Unisex NOVABLAST 5 1011B974101 ORI"
            price="1750000"
            image="~/assets/images/sepatu.png"
            :slug="`product-${i}`"
          />
        </div>
      </UContainer>
    </section>

    <UContainer>
      <UButton color="white" class="font-normal px-28">
        Login untuk Lihat Lainnya
      </UButton>
    </UContainer>
  </div>
</template>

<script setup>
const items = [
  "https://picsum.photos/1920/1080?random=1",
  "https://picsum.photos/1920/1080?random=2",
  "https://picsum.photos/1920/1080?random=3",
  "https://picsum.photos/1920/1080?random=4",
  "https://picsum.photos/1920/1080?random=5",
  "https://picsum.photos/1920/1080?random=6",
];
</script>

<style scoped>
.banner-section {
  @apply bg-white py-8;
}
.category-section-card {
  @apply bg-white;
}
.category-section-header {
  @apply p-5;
  @apply border-b border-black/5;
}

.category-section-header h2 {
  @apply text-base text-black/55 font-medium uppercase;
}

.category-section-content {
  @apply p-5 grid grid-cols-10;
}

.category-item {
  @apply p-2 border;
}

.product-section-header {
  @apply bg-white;
  @apply border-b-2 border-primary;
  @apply p-5;
}

.product-section-header h2 {
  @apply text-base text-primary;
  @apply font-medium uppercase text-center;
}

.product-section-content {
  @apply grid grid-cols-6 gap-3;
  @apply mt-3;
}
</style>
