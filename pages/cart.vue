<template>
  <UContainer class="py-5 flex flex-col gap-6">
    <!-- Loading Status -->
    <div
      v-if="status === 'pending'"
      class="flex gap-4 items-center justify-center min-h-96"
    >
      <IconLoading class="w-12 text-primary" />
      <p>Loading...</p>
    </div>
    <!-- End Loading Status -->
    <template v-else>
      <div
        v-if="!data?.data?.items?.length"
        class="flex gap-4 items-center justify-center min-h-96 flex-col"
      >
        <UIcon
          name="heroicons:archive-box-x-mark"
          class="w-36 h-36 text-black/30"
        />
        <p class="text-2xl text-black/30 text-center">
          Tidak ada Produk di Keranjang
        </p>
      </div>
      <template v-else>
        <UCard class="hidden md:block">
          <div class="cart-header">
            <div class="w-[46%]">Produk</div>
            <div class="text-center w-[15%]">Harga Satuan</div>
            <div class="text-center w-[15%]">Kuantitas</div>
            <div class="text-center w-[15%]">Total Harga</div>
            <div class="text-center w-[10%]">Aksi</div>
          </div>
        </UCard>

        <UCard>
          <div class="grid grid-cols-1 divide-y">
            <FeatureCartProductItem
              v-for="item in data?.data?.items"
              :key="`product-${item.uuid}`"
              :item="item"
              refresh-key="cart-page"
            />
          </div>
        </UCard>

        <UCard
          :ui="{
            header: {
              padding: paddingCheckoutFooter,
            },
            body: {
              padding: paddingCheckoutFooter,
            },
            footer: {
              padding: paddingCheckoutFooter,
            },
            divide: 'divide-dashed',
          }"
        >
          <template #header>
            <div class="voucher-header">
              <div class="flex gap-1 items-center font-medium">
                <IconVoucher />
                Voucher Syopee
              </div>
              <UButton
                variant="link"
                color="blue"
                :disabled="statusCoin === 'pending'"
                @click="openVoucher = true"
              >
                {{
                  data?.data?.cart?.voucher?.code
                    ? `${data?.data?.cart?.voucher?.code} - Klik untuk mengganti`
                    : "Gunakan/ masukkan kode"
                }}
              </UButton>
            </div>
          </template>

          <template #default>
            <div class="coin-row">
              <div class="coin-left">
                <UCheckbox
                  v-model="useCoin"
                  :disabled="
                    !session.profile.balance || statusCoin === 'pending'
                  "
                  @change="handlePayWithCoin"
                >
                  <template #label>
                    <div class="flex gap-2 items-center">
                      <IconCoin />
                      <span class="font-medium">Koin Syopee</span>
                    </div>
                  </template>
                </UCheckbox>
                <span class="font-medium text-sm text-gray-500">
                  Saldo Koin
                  {{ session.profile.balance ? coinBalance : "Tidak Cukup" }}
                </span>
                <div class="coin-right">
                  <span class="text-gray-300">-Rp{{ payWithCoin }}</span>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="cart-footer">
              <div class="cart-total">
                <div>
                  <!-- Rincian promosi -->
                  <div class="flex items-center gap-1">
                    <span>Total ({{ data?.data?.items?.length }} produk):</span>
                    <span class="text-primary font-normal text-2xl">
                      Rp{{ totalPrice }}
                    </span>
                  </div>
                  <!-- Cashback → tampilkan “Koin yang diterima” -->
                  <div
                    v-if="voucherCashback > 0"
                    class="flex gap-6 text-sm font-normal justify-end"
                  >
                    <span>Koin yang diterima</span>
                    <span class="text-primary"
                      >Rp{{ formatRb(voucherCashback) }}</span
                    >
                  </div>

                  <!-- Diskon → tampilkan “Hemat” -->
                  <div
                    v-else-if="voucherDiscount > 0"
                    class="flex gap-6 text-sm font-normal justify-end"
                  >
                    <span>Hemat</span>
                    <span class="text-primary"
                      >Rp. {{ formatRb(totalSavingText) }}</span
                    >
                  </div>
                </div>

                <UButton
                  class="cart-button"
                  :disabled="statusCoin === 'pending'"
                  @click="handleCheckout"
                  >Checkout</UButton
                >
              </div>
            </div>
          </template>
        </UCard>

        <ModalVoucher v-model="openVoucher" refresh-key="cart-page" />
      </template>
    </template>
  </UContainer>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  header: {
    showProfile: true,
    showSearch: true,
    title: "Keranjang Belanja",
  },
  middleware: ["must-auth"],
});

const session = useSession();

const openVoucher = ref(false);
const useCoin = ref(false);

const paddingCheckoutFooter = "sm:py-3 sm:px-7";

const router = useRouter();

const { data, status } = useApi(`/server/api/cart`, {
  server: false, // token ada di client
  immediate: computed(() => !!session.token), // ⬅️ fetch hanya saat login
  key: "cart-page",
  default: () => ({
    // ⬅️ fallback aman saat guest
    data: {
      items: [],
      cart: {
        subtotal: 0,
        voucher_value: 0,
        voucher_cashback: 0,
        pay_with_coin: 0,
      },
    },
  }),
  onResponseError({ response }) {
    if (response.status === 401) return; // abaikan guest
  },
  onResponse({ response }) {
    if (response.ok) {
      useCoin.value = !!response._data?.data?.cart?.pay_with_coin;
    }
  },
});

const cart = computed(() => data.value?.data?.cart || {});

const subtotal = computed(() => Number(data.value?.data?.cart?.subtotal || 0));
const voucherDiscount = computed(() => Number(cart.value?.voucher_value || 0)); // memotong total
const voucherCashback = computed(() =>
  Number(cart.value?.voucher_cashback || 0)
);
// jadi koin
// const hasPromo = computed(
//   () => voucherDiscount.value > 0 || voucherCashback.value > 0
// );
const totalSavingText = computed(() =>
  formatRb(voucherDiscount.value + voucherCashback.value)
);

const coinBalance = computed(() => formatNumber(session.profile.balance));
const payWithCoin = computed(() =>
  Number(data.value?.data?.cart?.pay_with_coin)
);
const totalPrice = computed(() =>
  formatNumber(subtotal.value - voucherDiscount.value - payWithCoin.value)
);

const { execute: submitPayWithCoin, status: statusCoin } = useSubmit(
  "/server/api/cart/toggle-coin",
  {
    params: computed(() => {
      return {
        use: useCoin.value ? 1 : 0,
      };
    }),
    onResponse({ response }) {
      if (response.ok) {
        refreshNuxtData("cart-page");
      }
    },
  }
);

function handlePayWithCoin() {
  submitPayWithCoin();
}

function handleCheckout() {
  // Hit API
  router.push("/checkout");
}
</script>

<style scoped>
/* ===== Header kolom (desktop only) ===== */
.cart-header {
  /* Grid 5 kolom: 46% / 15% / 15% / 15% / 9%  */
  display: grid;
  grid-template-columns: 46% 15% 15% 15% 9%;
  @apply items-center text-gray-500 text-sm font-normal py-3 px-2;
}

/* ===== Voucher header ===== */
.voucher-header {
  /* mobile: stack; desktop: kanan-kiri */
  @apply flex flex-col gap-2 md:flex-row md:items-center md:justify-end md:gap-40;
}

/* ===== Baris koin ===== */
.coin-row {
  /* mobile: dua baris; desktop: sejajar kanan */
  @apply flex flex-col gap-3 md:flex-row md:items-center md:justify-end;
}
.coin-row .coin-left {
  @apply flex items-center gap-4 flex-wrap;
}
.coin-row .coin-right {
  @apply flex justify-end flex-1 min-w-48;
}

/* ===== Footer total + checkout ===== */
.cart-footer {
  /* mobile: stack; desktop: sejajar kanan */
  @apply flex flex-col gap-3 md:flex-row md:items-center md:justify-end;
}
.cart-total {
  @apply flex flex-col gap-2;
}
.cart-button {
  @apply px-9 min-w-52 justify-center w-full md:w-auto;
}
</style>
