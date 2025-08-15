<template>
  <NuxtLink
    class="category-item"
    :to="{
      path: '/search',
      query: {
        category: slug,
      },
    }"
  >
    <NuxtImg :src="image" format="webp" />
    <p>{{ title }}</p>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  slug: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.category-item {
  @apply p-2 sm:p-3;
  @apply border-b border-r border-black/5 rounded-md bg-white;
  @apply hover:shadow hover:border-black/15 transition-all;
  @apply flex flex-col gap-2 items-center justify-start text-center;
}
.category-item img {
  @apply aspect-[1/1];
  @apply w-full;
}
.category-item p {
  @apply text-xs sm:text-sm text-black/80;
}
/* .category-item {
  @apply p-2;
  @apply border-b border-r border-black/5;
  @apply hover:shadow hover:border-black/15;
}
.category-item img {
  @apply aspect-[1/1];
  @apply w-full;
}
.category-item p {
  @apply text-sm text-center text-black/80;
} */
</style>
