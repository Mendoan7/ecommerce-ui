<template>
  <UContainer class="flex flex-col gap-5 py-4 md:py-5">
    <!-- Alamat -->
    <UCard class="address-section">
      <div class="flex gap-2 text-primary items-center">
        <UIcon name="i-heroicons:map-pin-16-solid" />
        <span>Alamat Pengiriman</span>
      </div>

      <div v-if="status === 'pending'" class="flex gap-4 mt-5 items-center">
        <USkeleton class="h-4 w-3/12" />
        <USkeleton class="h-4 w-6/12" />
        <USkeleton class="h-4 w-3/12" />
      </div>

      <div
        v-else
        class="mt-5 flex flex-col gap-3 md:flex-row md:items-start md:gap-6"
      >
        <div class="min-w-0">
          <p class="font-bold break-words">
            {{ addressSelected?.receiver_name }}
          </p>
          <p class="font-bold break-words">
            {{ addressSelected?.receiver_phone }}
          </p>
        </div>

        <p class="text-black/80 md:flex-1 break-words">
          {{ addressSelected?.detail_address }} {{ addressSelected?.district }},
          {{ addressSelected?.city?.name }},
          {{ addressSelected?.city?.province?.name }},
          {{ addressSelected?.postal_code }} {{ addressSelected?.address_note }}
        </p>

        <div class="flex items-center gap-3 mt-1 md:mt-0">
          <UBadge
            v-if="addressSelected?.is_default"
            variant="outline"
            class="font-normal"
            >Utama</UBadge
          >
          <UButton variant="link" color="blue" @click="openAddress = true"
            >Ubah</UButton
          >
        </div>
      </div>
    </UCard>

    <!-- Produk Dipesan -->
    <div class="bg-white divide-y divide-dashed">
      <div class="p-4 md:p-6">
        <!-- Header (desktop) -->
        <div class="hidden md:flex justify-between items-center">
          <span class="w-[33%] text-lg font-normal text-black/85"
            >Produk Dipesan</span
          >
          <span class="w-[16%]" />
          <span class="w-[16%] text-sm font-normal text-right text-black/55"
            >Harga satuan</span
          >
          <span class="w-[16%] text-sm font-normal text-right text-black/55"
            >Jumlah</span
          >
          <span class="w-[16%] text-sm font-normal text-right text-black/55"
            >Subtotal produk</span
          >
        </div>

        <!-- List item -->
        <div class="mt-3 md:mt-4 space-y-3 md:space-y-2">
          <div
            v-for="item in data?.data?.items"
            :key="item.uuid"
            class="rounded-md border border-gray-100 md:border-0 md:rounded-none md:border-transparent"
          >
            <!-- Desktop row -->
            <div class="hidden md:flex justify-between items-center gap-4 py-2">
              <div
                class="w-[33%] text-lg font-normal text-black/85 flex gap-3 items-center"
              >
                <NuxtImg
                  :src="item.product.image_url"
                  class="aspect-[1/1] w-12 object-cover rounded"
                  format="webp"
                />
                <p class="line-clamp-1 text-sm text-black/80">
                  {{ item.product.name }}
                </p>
              </div>
              <div class="w-[16%]">
                <p class="line-clamp-1 text-sm text-black/40">
                  Variasi: {{ item.variations?.map((v) => v.value).join(", ") }}
                </p>
              </div>
              <div class="w-[16%] text-sm font-normal text-right text-black/80">
                Rp{{
                  formatNumber(item.product.price_sale || item.product.price)
                }}
              </div>
              <div class="w-[16%] text-sm font-normal text-right text-black/80">
                {{ formatNumber(item.qty) }}
              </div>
              <div class="w-[16%] text-sm font-medium text-right text-black/80">
                Rp{{ formatNumber(item.total) }}
              </div>
            </div>

            <!-- Mobile card -->
            <div class="md:hidden p-3">
              <div class="flex gap-3">
                <NuxtImg
                  :src="item.product.image_url"
                  class="w-16 h-16 rounded object-cover flex-shrink-0"
                  format="webp"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-black/85 line-clamp-2">
                    {{ item.product.name }}
                  </p>
                  <p class="text-xs text-black/45 mt-0.5">
                    {{ item.variations?.map((v) => v.value).join(", ") || "—" }}
                  </p>
                  <div class="mt-2 grid grid-cols-2 gap-1 text-xs">
                    <span class="text-black/55">Harga</span>
                    <span class="text-right text-black/80">
                      Rp{{
                        formatNumber(
                          item.product.price_sale || item.product.price
                        )
                      }}
                    </span>

                    <span class="text-black/55">Jumlah</span>
                    <span class="text-right text-black/80">{{
                      formatNumber(item.qty)
                    }}</span>

                    <span class="text-black/55">Subtotal</span>
                    <span class="text-right font-medium text-black/90">
                      Rp{{ formatNumber(item.total) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- /Mobile card -->
          </div>
        </div>
      </div>

      <!-- Pesan + Opsi Pengiriman -->
      <div class="bg-blue-50/20 md:flex md:divide-x md:divide-dashed">
        <!-- Pesan -->
        <div class="py-4 px-4 md:px-6 md:flex md:gap-4 md:w-[480px]">
          <span class="block mb-2 md:mb-0 md:mt-2">Pesan:</span>
          <div class="flex-1 flex gap-2">
            <UInput
              v-model="notes"
              :disabled="statusUpdateQty === 'pending'"
              placeholder="(Opsional) Tinggalkan pesan ke penjual"
              class="flex-1"
            />
            <UButton
              v-if="notes"
              :loading="statusUpdateQty === 'pending'"
              size="xs"
              @click="handleUpdateNotes"
              class="hidden sm:inline-flex"
            >
              Update
            </UButton>
          </div>
        </div>

        <!-- Opsi Pengiriman -->
        <div class="flex-1 divide-y divide-dashed">
          <div
            class="px-4 md:px-6 py-4 md:py-9 font-medium grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0"
          >
            <p class="text-sm text-black/80">Opsi Pengiriman</p>
            <div>
              <div class="flex justify-between gap-2 items-center">
                <p
                  v-if="courierSelected?.courier"
                  class="text-sm text-black/80 uppercase"
                >
                  {{ courierSelected.courier }} - {{ courierSelected.service }}
                </p>
                <p v-else class="text-sm text-black/55">
                  Pilih Kurir Terlebih Dahulu
                </p>
                <UButton
                  variant="link"
                  color="blue"
                  :padded="false"
                  @click="openCourier = true"
                  >Ubah</UButton
                >
              </div>
              <p
                v-if="courierSelected?.courier"
                class="text-xs text-gray-400 font-normal mt-2"
              >
                Garansi tiba:
                {{ getEstimate(data?.data?.cart?.courier_estimation) }}
              </p>
            </div>
            <p class="text-sm text-black/80 md:text-right">
              Rp{{ formatNumber(data?.data?.cart?.courier_price || 0) }}
            </p>
          </div>

          <div class="px-4 md:px-6 py-3">
            <UButton
              v-if="courierSelected?.courier"
              variant="link"
              class="hover:no-underline p-0"
              @click="openCourier = true"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-green-700 w-full"
              >
                <div class="flex items-center gap-1">
                  <IconTruck /> Garansi tiba:
                  {{ getEstimate(data?.data?.cart?.courier_estimation) }}
                </div>
                <div class="flex items-center text-gray-400">
                  <span>
                    dengan
                    <span class="uppercase"
                      >{{ courierSelected.courier }} -
                      {{ courierSelected.service }}</span
                    ></span
                  >
                  <UIcon name="i-heroicons:chevron-right" class="ml-1" />
                </div>
              </div>
            </UButton>
          </div>
        </div>
      </div>

      <!-- Subtotal bar -->
      <div
        class="bg-blue-50/20 px-4 md:px-6 py-3 md:py-4 flex flex-wrap gap-2 md:gap-3 items-center justify-between md:justify-end"
      >
        <span class="text-sm text-black/55">
          Total Pesanan ({{ data?.data?.items?.length }} Produk)
        </span>
        <span class="text-primary text-xl md:text-2xl font-medium">
          Rp{{ formatNumber(data?.data?.cart?.subtotal || 0) }}
        </span>
      </div>
    </div>

    <!-- Voucher + Koin -->
    <UCard>
      <template #header>
        <div class="flex flex-wrap gap-2 justify-between">
          <div class="flex gap-2 items-center font-normal text-lg">
            <IconVoucher /> Voucher Syopee
          </div>
          <UButton
            :padded="false"
            variant="link"
            color="blue"
            @click="openVoucher = true"
          >
            {{
              data?.data?.cart?.voucher?.code
                ? `${data?.data?.cart?.voucher?.code} - Klik untuk mengganti`
                : "Pilih Voucher"
            }}
          </UButton>
        </div>
      </template>
      <template #default>
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex gap-2 items-center font-normal text-lg">
            <IconCoin /> Koin Syopee
          </div>
          <p class="font-medium text-sm text-gray-400">
            {{
              session.profile.balance
                ? coinBalance
                : `Koin tidak dapat ditukarkan`
            }}
          </p>
          <div class="ml-auto flex items-center gap-2">
            <span class="text-gray-300 text-sm">[-Rp{{ payWithCoin }}]</span>
            <UCheckbox
              v-model="useCoin"
              :disabled="!session.profile.balance || statusCoin === 'pending'"
              @change="submitPayWithCoin"
            />
          </div>
        </div>
      </template>
    </UCard>

    <!-- Metode Pembayaran + Ringkasan -->
    <div class="bg-white">
      <div
        class="p-4 md:p-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-14"
      >
        <span class="md:mt-2">Pilih Pembayaran</span>
        <URadioGroup
          v-model="paymentSelected"
          :options="paymentList"
          :ui-radio="{ wrapper: 'items-center py-2' }"
          class="flex-1"
        >
          <template #label="{ option }">
            <div class="flex gap-4 items-center">
              <div
                class="w-12 h-12 border rounded-sm p-2 flex justify-center items-center"
              >
                <img :src="option.image" class="max-w-full max-h-full" />
              </div>
              <p class="font-normal text-sm">{{ option.label }}</p>
            </div>
          </template>
        </URadioGroup>
      </div>

      <!-- Ringkasan harga -->
      <div class="border-t border-gray-100 p-4 md:p-6 bg-yellow-50/30">
        <!-- Desktop: table -->
        <table class="price-summary hidden md:table ml-auto">
          <tbody>
            <tr>
              <td>
                <span class="text-sm text-black/55">Subtotal untuk Produk</span>
              </td>
              <td class="text-right min-w-44">
                Rp{{ formatNumber(cart?.subtotal) }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="text-sm text-black/55">Total Ongkos Kirim</span>
              </td>
              <td class="text-right min-w-44">
                Rp{{ formatNumber(cart?.courier_price) }}
              </td>
            </tr>
            <tr>
              <td><span class="text-sm text-black/55">Biaya Layanan</span></td>
              <td class="text-right min-w-44">
                Rp{{ formatNumber(cart?.service_fee) }}
              </td>
            </tr>
            <tr v-if="voucherDiscount > 0">
              <td>
                <span class="text-sm text-black/55"
                  >Voucher Diskon
                  <UBadge v-if="voucherCode" variant="outline" class="ml-1">{{
                    voucherCode
                  }}</UBadge>
                </span>
                <div v-if="voucherDetail" class="text-xs text-black/40 mt-0.5">
                  {{ voucherDetail }}
                </div>
              </td>
              <td class="text-right min-w-44 text-green-700">
                -Rp{{ formatNumber(voucherDiscount) }}
              </td>
            </tr>
            <tr v-if="voucherCashback > 0">
              <td>
                <span class="text-sm text-black/55"
                  >Voucher Cashback
                  <UBadge v-if="voucherCode" variant="outline" class="ml-1">{{
                    voucherCode
                  }}</UBadge>
                </span>
                <div v-if="voucherDetail" class="text-xs text-black/40 mt-0.5">
                  {{ voucherDetail }}
                </div>
              </td>
              <td class="text-right min-w-44">
                Rp{{ formatNumber(voucherCashback) }}
              </td>
            </tr>
            <tr v-if="payWithCoinNominal > 0">
              <td>
                <span class="text-sm text-black/55">Bayar dengan Koin</span>
              </td>
              <td class="text-right min-w-44 text-green-700">
                -Rp{{ formatNumber(payWithCoinNominal) }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="text-sm text-black/55">Total Pembayaran</span>
              </td>
              <td class="text-right min-w-44 text-3xl text-primary">
                Rp{{ formatNumber(cart?.total_payment) }}
              </td>
            </tr>
            <tr v-if="voucherCashback > 0">
              <td colspan="2" class="pt-1 text-right">
                <span class="text-xs text-black/40"
                  >*Cashback tidak mengurangi total pembayaran; akan dikreditkan
                  ke akun Anda.</span
                >
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile: list -->
        <dl class="md:hidden space-y-2">
          <div class="flex justify-between text-sm">
            <dt class="text-black/55">Subtotal Produk</dt>
            <dd>Rp{{ formatNumber(cart?.subtotal) }}</dd>
          </div>
          <div class="flex justify-between text-sm">
            <dt class="text-black/55">Ongkos Kirim</dt>
            <dd>Rp{{ formatNumber(cart?.courier_price) }}</dd>
          </div>
          <div class="flex justify-between text-sm">
            <dt class="text-black/55">Biaya Layanan</dt>
            <dd>Rp{{ formatNumber(cart?.service_fee) }}</dd>
          </div>
          <div v-if="voucherDiscount > 0" class="flex justify-between text-sm">
            <dt class="text-black/55">Voucher Diskon</dt>
            <dd class="text-green-700">
              -Rp{{ formatNumber(voucherDiscount) }}
            </dd>
          </div>
          <div v-if="voucherCashback > 0" class="flex justify-between text-sm">
            <dt class="text-black/55">Voucher Cashback</dt>
            <dd>Rp{{ formatNumber(voucherCashback) }}</dd>
          </div>
          <div
            v-if="payWithCoinNominal > 0"
            class="flex justify-between text-sm"
          >
            <dt class="text-black/55">Bayar dengan Koin</dt>
            <dd class="text-green-700">
              -Rp{{ formatNumber(payWithCoinNominal) }}
            </dd>
          </div>
          <div class="flex justify-between pt-3 border-t border-gray-100">
            <dt class="text-black/55">Total Pembayaran</dt>
            <dd class="text-2xl text-primary">
              Rp{{ formatNumber(cart?.total_payment) }}
            </dd>
          </div>
          <p
            v-if="voucherCashback > 0"
            class="text-[11px] text-black/40 text-right"
          >
            *Cashback tidak mengurangi total pembayaran; akan dikreditkan ke
            akun Anda.
          </p>
        </dl>
      </div>

      <!-- CTA -->
      <div
        class="border-t border-gray-100 border-dashed p-4 md:p-6 bg-yellow-50/30"
      >
        <!-- Desktop button -->
        <div class="hidden md:flex justify-end">
          <UButton
            class="w-52 justify-center"
            :disabled="status === 'pending' || !courierSelected?.courier"
            :loading="statusCheckout === 'pending'"
            @click="handlePayment"
          >
            Buat Pesanan
          </UButton>
        </div>

        <!-- Mobile sticky button -->
        <div class="md:hidden">
          <div class="h-14"></div>
          <div
            class="fixed left-0 right-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200 px-4 py-2"
            style="padding-bottom: calc(env(safe-area-inset-bottom) + 8px)"
          >
            <div class="flex items-center justify-between">
              <div class="text-sm">
                <p class="text-black/55">Total</p>
                <p class="text-lg font-semibold text-primary">
                  Rp{{ formatNumber(cart?.total_payment || 0) }}
                </p>
              </div>
              <UButton
                class="min-w-40 justify-center"
                :disabled="status === 'pending' || !courierSelected?.courier"
                :loading="statusCheckout === 'pending'"
                @click="handlePayment"
              >
                Buat Pesanan
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <template v-if="data?.data?.items?.length">
      <ModalAddress
        v-model:open="openAddress"
        v-model="addressSelected"
        refresh-key="cart-checkout"
      />
      <ModalCourier
        v-model:open="openCourier"
        v-model="courierSelected"
        refresh-key="cart-checkout"
      />
      <ModalVoucher v-model="openVoucher" refresh-key="cart-checkout" />
    </template>
  </UContainer>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  header: { title: "Checkout", showProfile: true },
  middleware: ["must-auth"],
});

const router = useRouter();
const session = useSession();

const useCoin = ref(false);
const openVoucher = ref(false);
const openCourier = ref(false);
const openAddress = ref(false);
const notes = ref("");

const addressSelected = ref({});
const courierSelected = ref({ courier: "", service: "" });

const paymentSelected = ref("bca_va");
const paymentList = computed(() => [
  { value: "bca_va", label: "Bank BCA", image: "/images/logo-bca.png" },
  { value: "qris", label: "QRIS", image: "/images/qris.png" },
]);

const { data, status } = useApi("/server/api/cart", {
  server: false,
  immediate: computed(() => !!session.token),
  key: "cart-checkout",
  onResponse({ response }) {
    if (response.ok) {
      useCoin.value = !!response._data?.data?.cart?.pay_with_coin;
      addressSelected.value = response._data?.data?.cart?.address || {};
      courierSelected.value = {
        courier: response._data?.data?.cart?.courier,
        service: response._data?.data?.cart?.courier_type,
      };
      notes.value = response._data?.data?.items?.[0]?.note;

      if (response._data?.data?.items.length < 1) {
        router.replace("/cart");
      }
    }
  },
});

const product = computed(() => data.value?.data?.items?.[0]);

const { execute: updateQty, status: statusUpdateQty } = useSubmit(
  computed(() => `/server/api/cart/${product.value?.uuid}`),
  {
    onResponse({ response }) {
      if (response.ok) refreshNuxtData("cart-checkout");
    },
  }
);

const { execute: submitPayWithCoin, status: statusCoin } = useSubmit(
  "/server/api/cart/toggle-coin",
  {
    params: computed(() => ({ use: useCoin.value ? 1 : 0 })),
    onResponse({ response }) {
      if (response.ok) refreshNuxtData("cart-checkout");
    },
  }
);

const { status: statusCheckout, execute: checkout } = useSubmit(
  "/server/api/cart/checkout",
  {
    onResponse({ response }) {
      if (response.ok)
        router.push(`/checkout/payment/${response._data?.data?.uuid}`);
    },
  }
);

const coinBalance = computed(() => formatNumber(session.profile.balance));
const payWithCoin = computed(() =>
  formatNumber(data.value?.data?.cart?.pay_with_coin || 0)
);

function handleUpdateNotes() {
  if (!product.value) return;
  const formData = new FormData();
  product.value?.variations?.forEach((variant, index) => {
    formData.append(`variations[${index}][label]`, variant.label);
    formData.append(`variations[${index}][value]`, variant.value);
  });
  formData.append("qty", product.value.qty);
  formData.append("note", notes.value);
  formData.append("_method", "PATCH");
  updateQty(formData);
}

function handlePayment() {
  checkout({ payment_method: paymentSelected.value });
}

const cart = computed(() => data.value?.data?.cart || {});
const voucher = computed(() => cart.value?.voucher || null);

const voucherCode = computed(() => voucher.value?.code || null);
const voucherDiscount = computed(() => Number(cart.value?.voucher_value || 0));
const voucherCashback = computed(() =>
  Number(cart.value?.voucher_cashback || 0)
);
const payWithCoinNominal = computed(() =>
  Number(cart.value?.pay_with_coin || 0)
);

const voucherDetail = computed(() => {
  const v = voucher.value;
  if (!v) return null;
  const isPct = v.discount_cashback_type === "percentage";
  const val = isPct
    ? `${v.discount_cashback_value}%`
    : `Rp${formatNumber(v.discount_cashback_value)}`;
  const cap =
    isPct && Number(v.discount_cashback_max) > 0
      ? ` (maks Rp${formatNumber(v.discount_cashback_max)})`
      : "";
  const seller = v.seller?.store_name ? ` • ${v.seller.store_name}` : "";
  return `${val}${cap}${seller}`;
});
</script>

<style scoped>
.price-summary tr:not(:first-child) td {
  @apply py-3;
}
.price-summary tr:first-child td {
  @apply pb-3;
}
.price-summary tr:last-child td {
  @apply pb-0 pt-10;
}
</style>
