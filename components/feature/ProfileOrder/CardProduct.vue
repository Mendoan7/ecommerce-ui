<template>
  <div class="card-product">
    <NuxtImg
      :src="item?.product?.image_url"
      class="aspect-[1/1] object-cover rounded-md flex-none h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
      :class="sizeClasse[size]?.image"
      format="webp"
    />
    <div class="min-w-0">
      <p class="line-clamp-2" :class="sizeClasse[size]?.title">
        {{ item.product?.name }}
      </p>
      <template v-if="!hideDescription">
        <p class="text-sm text-black/55 mt-0.5">Variasi: {{ variantName }}</p>
        <p class="text-sm mt-0.5">x{{ item?.qty }}</p>
      </template>
    </div>
    <div v-if="!hidePrice" class="total-price">Rp{{ totalPrice }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
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
  item: {
    type: Object,
    default: () => ({}),
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

const variantName = computed(() =>
  (props.item?.variations || [])?.map((variant) => variant.value).join(", ")
);

const totalPrice = computed(() => formatNumber(props.item?.total || 0));
</script>

<style scoped>
.card-product {
  @apply flex gap-3 items-center;
  @apply grid items-start sm:items-center gap-3 sm:gap-4;
  @apply grid-cols-[auto,1fr] sm:grid-cols-[auto,1fr,auto];
}
.total-price {
  @apply sm:col-auto col-span-2 justify-self-end sm:justify-self-auto;
  @apply text-sm sm:text-base font-medium mt-1;
}
</style>
