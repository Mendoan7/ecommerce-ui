<template>
  <UCard
    :ui="{
      base: 'text-sm text-black/85',
      divide: 'divide-dashed',
      footer: {
        background: 'bg-yellow-50/30',
      },
    }"
  >
    <template #default>
      <div
        class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="font-semibold truncate">{{
            order?.seller?.store_name
          }}</span>
          <UButton
            color="white"
            size="xs"
            :to="`/shop/${order?.seller?.username}`"
            class="shrink-0"
          >
            <IconShop /> Kunjungi Toko
          </UButton>
        </div>
        <!-- Status -->
        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4 sm:divide-x"
        >
          <div
            class="flex items-center gap-1 pr-0 sm:pr-3 text-teal-500 text-xs sm:text-sm"
          >
            <UIcon
              v-if="order?.last_status?.status === 'on_delivery'"
              name="i-heroicons:truck"
              class="w-4 h-4"
            />
            <span class="truncate max-w-[12rem] sm:max-w-none">
              {{ order?.last_status?.description }}
            </span>
          </div>
          <span
            class="text-primary pl-0 sm:pl-3 text-xs sm:text-sm font-medium"
          >
            {{ STATUS_ORDER?.[order?.last_status?.status] }}
          </span>
        </div>
      </div>

      <hr class="my-3" />
      <!-- Product List -->
      <NuxtLink
        class="block space-y-3"
        :to="`/my-account/orders/${order.uuid}`"
      >
        <FeatureProfileOrderCardProduct
          v-for="product in order?.items || []"
          :key="`order-${order.uuid}-product-${product.uuid}`"
          :item="product"
        />
      </NuxtLink>
    </template>

    <template #footer>
      <div class="space-y-4 sm:space-y-6">
        <div
          class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-end"
        >
          <div class="flex gap-2 items-center">
            <img src="~/assets/images/garansi.png" class="h-4 w-4" />
            <span class="text-black/80 text-sm sm:text-base"
              >Total Pesanan:</span
            >
            <span class="text-primary text-xl sm:text-2xl"
              >Rp{{ totalPrice }}</span
            >
          </div>
        </div>
        <!-- Review CTA -->
        <div
          v-if="
            order?.last_status?.status === 'done' &&
            canReview &&
            !order?.items?.[0]?.is_reviewed
          "
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="text-xs sm:text-sm">
            <p class="text-black/55">
              Nilai produk sebelum
              <span class="underline">{{ lastReviewDate }}</span>
            </p>
            <p class="text-primary">Nilai sekarang & dapatkan 25 Koin Syopo!</p>
          </div>
          <UButton
            label="Nilai"
            class="w-full sm:w-auto min-w-40 justify-center"
            @click="emit('review', order)"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup>
import { addDays, differenceInDays, format } from "date-fns";
import { STATUS_ORDER } from "~/constant/status";

const props = defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["review"]);

const totalPrice = computed(() => formatNumber(props.order?.total || 0));

const lastReviewDate = computed(() => {
  if (props.order?.last_status?.status !== "done") return "";
  const doneDate = new Date(props.order?.last_status?.created_at);
  const targetDate = addDays(doneDate, 1);

  return format(targetDate, "dd-MM-yyyy");
});

const canReview = computed(() => {
  if (props.order?.last_status?.status !== "done") return "";
  const endDate = new Date(lastReviewDate.value);
  const today = new Date();
  const diffDays = differenceInDays(endDate, today);
  return diffDays === 0;
});
</script>

<style scoped></style>
