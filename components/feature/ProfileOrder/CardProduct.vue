<template>
  <div class="flex gap-3">
    <img
      src="https://picsum.photos/1920/1080?random=1"
      class="aspect-[1/1] object-cover"
      :class="sizeClasse[size]?.image"
    />
    <div class="flex-1">
      <p class="line-clamp-2" :class="sizeClasse[size]?.title">Product name</p>
      <template v-if="!hideDescription">
        <p class="text-sm text-black/55">Variasi: White, 39</p>
        <p class="text-sm">x1</p>
      </template>
    </div>
    <div v-if="!hidePrice" class="flex items-center">
      Rp{{ formatNumber(1000) }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  hidePrice: {
    type: Boolean,
    default: false,
  },
  hideDescription: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "lg",
    validator: (propsValue) => ["sm", "lg"].includes(propsValue),
  },
});

const sizeClasse = {
  sm: {
    image: "h-14 w-14",
    title: "text-sm",
  },
  lg: {
    image: "h-20 w-20",
    title: "text-base",
  },
};
</script>

<style scoped></style>
