<template>
  <!-- Wrapper: kartu di mobile, baris tabel di desktop -->
  <div class="cart-product group md:py-5">
    <!-- KIRI (Produk) -->
    <div class="product-col">
      <div class="flex gap-3 items-start">
        <NuxtImg
          :src="item.product.image_url"
          class="aspect-[1/1] w-20 shrink-0 rounded md:rounded-none"
        />
        <div class="flex-1 min-w-0">
          <!-- Nama produk -->
          <p
            class="text-black/85 text-base md:text-sm font-medium md:font-normal line-clamp-2"
          >
            {{ item.product.name }}
          </p>

          <!-- Variasi (mobile tampil di bawah nama, desktop ada di kolom produk) -->
          <p class="mt-1 text-xs text-black/60">
            <span class="font-medium md:font-normal">Variasi:</span>
            {{ item.variations.map((v) => v.value).join(", ") || "-" }}
          </p>

          <!-- Harga (mobile) -->
          <div class="md:hidden mt-2 text-sm">
            <span class="font-medium">Harga: </span>
            Rp{{ formatNumber(item.product.price_sale || item.product.price) }}
          </div>

          <!-- Kuantitas (mobile) -->
          <div class="md:hidden mt-2 flex items-center gap-2">
            <span class="font-medium">Kuantitas:</span>
            <BaseInputQuantity
              v-model="temporaryQty"
              :max="item.stock"
              :disabled="statusRemoveItem === 'pending'"
            />
            <UButton
              v-if="temporaryQty !== item.qty"
              variant="link"
              size="xs"
              :padded="false"
              :loading="statusUpdateQty == 'pending'"
              :disabled="statusRemoveItem === 'pending'"
              @click="handleUpdateQty"
            >
              Update
            </UButton>
          </div>

          <!-- Total (mobile) -->
          <div class="md:hidden mt-2 text-sm">
            <span class="font-medium">Total: </span>
            <span class="text-primary"> Rp{{ formatNumber(item.total) }} </span>
          </div>

          <!-- Aksi (mobile) -->
          <div class="md:hidden mt-3">
            <UButton
              variant="link"
              color="black"
              :disabled="statusUpdateQty === 'pending'"
              :loading="statusRemoveItem === 'pending'"
              @click="removeItem"
            >
              Hapus
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- HARGA (desktop) -->
    <div class="col cell text-center hidden md:block">
      Rp{{ formatNumber(item.product.price_sale || item.product.price) }}
    </div>

    <!-- KUANTITAS (desktop) -->
    <div class="col cell hidden md:flex flex-col items-center gap-2">
      <BaseInputQuantity
        v-model="temporaryQty"
        :max="item.stock"
        :disabled="statusRemoveItem === 'pending'"
      />
      <UButton
        v-if="temporaryQty !== item.qty"
        variant="link"
        size="xs"
        :padded="false"
        :loading="statusUpdateQty == 'pending'"
        :disabled="statusRemoveItem === 'pending'"
        @click="handleUpdateQty"
      >
        Perbarui Kuantitas
      </UButton>
    </div>

    <!-- TOTAL (desktop) -->
    <div class="col cell text-center text-primary hidden md:block">
      Rp{{ formatNumber(item.total) }}
    </div>

    <!-- AKSI (desktop) -->
    <div class="col cell text-center hidden md:block">
      <UButton
        variant="link"
        color="black"
        :disabled="statusUpdateQty === 'pending'"
        :loading="statusRemoveItem === 'pending'"
        @click="removeItem"
      >
        Hapus
      </UButton>
    </div>
  </div>
</template>

<!-- <template>
  <div class="cart-product">
    <div class="w-[46%]">
      <div class="flex gap-3 text-sm items-center">
        <NuxtImg :src="item.product.image_url" class="aspect-[1/1] w-20" />
        <p class="line-clamp-2 items-center text-black/85">
          {{ item.product.name }}
        </p>
        <div class="w-40">
          <p>Variasi:</p>
          <p>
            {{ item.variations.map((variant) => variant.value).join(", ") }}
          </p>
        </div>
      </div>
    </div>
    <div class="text-center w-[15%]">
      Rp{{ formatNumber(item.product.price_sale || item.product.price) }}
    </div>
    <div class="flex justify-center flex-col items-center w-[15%] gap-2">
      <BaseInputQuantity
        v-model="temporaryQty"
        :max="item.stock"
        :disabled="statusRemoveItem === 'pending'"
      />
      <UButton
        v-if="temporaryQty !== item.qty"
        variant="link"
        size="xs"
        :padded="false"
        :loading="statusUpdateQty == 'pending'"
        :disabled="statusRemoveItem === 'pending'"
        @click="handleUpdateQty"
      >
        Perbarui Kuantitas
      </UButton>
    </div>
    <div class="text-center w-[15%] text-primary">
      Rp{{ formatNumber(item.total) }}
    </div>
    <div class="text-center w-[10%]">
      <UButton
        variant="link"
        color="black"
        :disabled="statusUpdateQty === 'pending'"
        :loading="statusRemoveItem === 'pending'"
        @click="removeItem"
      >
        Hapus
      </UButton>
    </div>
  </div>
</template> -->

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  refreshKey: { type: String, default: "cart" },
});

const temporaryQty = ref(props.item?.qty || 0);

const { execute: updateQty, status: statusUpdateQty } = useSubmit(
  computed(() => `/server/api/cart/${props.item.uuid}`),
  {
    onResponse({ response }) {
      if (response.ok) {
        refreshNuxtData(props.refreshKey);
      }
    },
  }
);
const { execute: removeItem, status: statusRemoveItem } = useSubmit(
  computed(() => `/server/api/cart/${props.item.uuid}`),
  {
    method: "DELETE",
    onResponse({ response }) {
      if (response.ok) {
        refreshNuxtData(props.refreshKey);
      }
    },
  }
);

function handleUpdateQty() {
  const formData = new FormData();

  props.item?.variations?.forEach((variant, index) => {
    formData.append(`variations[${index}][label]`, variant.label);
    formData.append(`variations[${index}][value]`, variant.value);
  });
  formData.append("qty", temporaryQty.value);
  formData.append("_method", "PATCH");

  updateQty(formData);
}
</script>

<style scoped>
/* Kartu di mobile, baris tabel di desktop */
.cart-product {
  /* MOBILE: kartu */
  @apply bg-white rounded-lg border border-gray-100 p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)];
  @apply flex flex-col gap-2;

  /* DESKTOP: kembali ke baris tabel */
  @apply md:bg-transparent md:rounded-none md:border-0 md:shadow-none;
  @apply md:flex md:flex-row md:items-center md:gap-0 md:py-5;
  @apply text-gray-500 text-sm font-normal;
  @apply border-b md:border-b md:border-gray-100;
}

/* Kolom utama (produk) */
.product-col {
  @apply w-full md:w-[46%];
}

/* Kolom lain (desktop only) mengikuti header grid 46/15/15/15/9 */
.col {
  @apply w-[15%];
}
.col:last-child {
  @apply w-[10%];
}

/* Sel umum (desktop) */
.cell {
  @apply py-2;
}

/* Hover halus di desktop */
@screen md {
  .cart-product:hover {
    @apply bg-gray-50/40;
  }
}
</style>
