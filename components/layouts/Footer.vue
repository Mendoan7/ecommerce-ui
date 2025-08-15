<template>
  <footer class="footer">
    <UContainer class="footer-content">
      <div class="footer-top">
        <div class="footer-col">
          <h3>Layanan Pelanggan</h3>
          <nav>
            <ul class="space-y-1">
              <li v-for="item in layananPengguna" :key="`${item}`">
                <UButton variant="link" class="footer-list text-black/65">
                  {{ item }}
                </UButton>
              </li>
            </ul>
          </nav>
        </div>
        <div class="footer-col">
          <h3>Jelajahi</h3>
          <nav>
            <ul class="space-y-1">
              <li v-for="item in jelajahi" :key="`${item}`">
                <UButton variant="link" class="footer-list text-black/65">
                  {{ item }}
                </UButton>
              </li>
            </ul>
          </nav>
        </div>
        <div class="footer-col">
          <div>
            <h3>Pembayaran</h3>
            <div class="flex flex-wrap gap-2">
              <div class="footer-item">
                <img src="~/assets/images/seabank.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/bca.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/bni.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/bri.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/bsi.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/cimb.png" class="footer-logo" />
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h3>Pengiriman</h3>
            <div class="flex flex-wrap gap-2">
              <div class="footer-item">
                <img src="~/assets/images/spx.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/jnt.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/jne.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/ninja.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/sicepat.png" class="footer-logo" />
              </div>
              <div class="footer-item">
                <img src="~/assets/images/gosend.png" class="footer-logo" />
              </div>
            </div>
          </div>
        </div>
        <!-- Social $ Security -->
        <div class="footer-col">
          <div>
            <h3>Ikuti Kami</h3>
            <nav>
              <ul class="space-y-1">
                <li>
                  <UButton
                    variant="link"
                    :padded="false"
                    size="xs"
                    class="footer-list"
                  >
                    <template #leading>
                      <img
                        src="~/assets/images/facebook.png"
                        class="icon-social"
                      />
                    </template>
                    Facebook
                  </UButton>
                </li>
                <li>
                  <UButton
                    variant="link"
                    :padded="false"
                    size="xs"
                    class="footer-list"
                  >
                    <template #leading>
                      <img
                        src="~/assets/images/instagram.png"
                        class="icon-social"
                      />
                    </template>
                    Instagram
                  </UButton>
                </li>
                <li>
                  <UButton
                    variant="link"
                    :padded="false"
                    size="xs"
                    class="footer-list"
                  >
                    <template #leading>
                      <img
                        src="~/assets/images/twitter.png"
                        class="icon-social"
                      />
                    </template>
                    Twitter
                  </UButton>
                </li>
                <li>
                  <UButton
                    variant="link"
                    :padded="false"
                    size="xs"
                    class="footer-list"
                  >
                    <template #leading>
                      <img
                        src="~/assets/images/linkedin.png"
                        class="icon-social"
                      />
                    </template>
                    Linkedin
                  </UButton>
                </li>
              </ul>
            </nav>
          </div>
          <div class="mt-6">
            <h3>Keamanan</h3>
            <div class="footer-item size-lg">
              <img src="~/assets/images/certified.png" class="footer-logo" />
            </div>
          </div>
        </div>
        <!-- Download App -->
        <div class="footer-col">
          <h3>Download Aplikasi Shopee</h3>
          <div class="flex gap-3 items-start sm:items-center">
            <img src="~/assets/images/qrcode.png" class="qr-img" />
            <div class="flex flex-col gap-2">
              <img src="~/assets/images/appstore.png" class="store-badge" />
              <img src="~/assets/images/playstore.png" class="store-badge" />
              <img src="~/assets/images/appgalery.png" class="store-badge" />
            </div>
          </div>
        </div>
      </div>
      <!-- Buttom -->
      <div class="footer-bottom">
        <p class="footer-text">© Syopee 2025. Hak Cipta Dilindungi</p>
        <div class="flex gap-1 items-center">
          <span class="footer-text">Negara:</span>
          <div class="flex flex-wrap divide-x divide-black/20">
            <UButton
              v-for="item in country"
              :key="item"
              variant="link"
              class="footer-list px-1.5"
              :padded="false"
            >
              {{ item }}
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup>
const layananPengguna = [
  "Bantuan",
  "Metode Pembayaran",
  "ShopeePay",
  "Koin Shopee",
  "Lacak Pesanan",
  "Lacak Pengiriman",
  "Gratis Ongkir",
  "Hubungi Kami",
];
const jelajahi = [
  "Tentang Kami",
  "Karir",
  "Kebijakan Shopee",
  "Kebijakan Privasi",
  "Shopee Mall",
  "Kontak Media",
  "Shopee Affiliate",
];
const country = [
  "Singapura",
  "Indonesia",
  "Thailand",
  "Malaysia",
  "Vietnam",
  "Filipina",
  "Brazil",
  "Mexico",
  "Colombia",
  "Chile",
  "Taiwan",
];
</script>

<style scoped>
.footer {
  @apply border-t-4 border-primary;
  @apply bg-gray-50;
}

.footer-content {
  @apply flex flex-col;
}

.footer-top {
  @apply grid gap-8 sm:gap-10 pt-8 sm:pt-11 pb-8 border-b;
  @apply grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5;
}
.footer-col {
  @apply min-w-0;
}

.footer h3 {
  @apply font-bold text-xs;
  @apply sm:text-sm mb-4 sm:mb-5;
}
.footer-list {
  @apply text-xs sm:text-sm text-black/65;
  @apply font-normal;
}

.footer-item {
  @apply w-[60px] h-[30px] bg-white rounded-sm p-1 shadow flex items-center justify-center;
}
.footer-item.size-lg {
  @apply w-[112px] h-[52px];
}
.footer-logo {
  @apply w-auto h-4 sm:h-6 object-contain;
}
.icon-social {
  @apply w-4 h-4 object-contain;
}
.qr-img {
  @apply w-24 h-24 sm:w-28 sm:h-28 object-contain;
}
.store-badge {
  @apply h-8 sm:h-9 w-auto object-contain;
}

.footer-bottom {
  @apply py-6 sm:py-10 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center;
}
.footer-text {
  @apply text-xs sm:text-sm text-black/70;
}
</style>
