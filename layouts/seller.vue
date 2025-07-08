<template>
  <div class="seller-layout">
    <LayoutsHeaderSeller />
    <aside class="seller-sidebar">
      <LayoutsSidebar :items="sidebarItems" />
    </aside>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
const sidebarItems = [
  {
    label: "Pesanan",
    icon: "i-heroicons:clipboard-document-list",
    to: "/seller/order",
  },
  {
    label: "Produk",
    icon: "i-heroicons:shopping-bag",
    children: [
      {
        label: "Daftar Produk",
        to: "/seller/product",
      },
      {
        label: "Tambah Produk",
        to: "/seller/product/create",
      },
    ],
  },
  {
    label: "Voucher",
    icon: "i-heroicons:ticket",
    to: "/seller/voucher",
  },
  {
    label: "Keuangan",
    icon: "i-heroicons:banknotes",
    children: [
      {
        label: "Saldo Saya",
        to: "/seller/balance",
      },
    ],
  },
];
</script>

<style scoped>
.seller-layout {
  @apply flex flex-col;
  @apply min-h-screen;
  @apply relative;
  @apply text-slate-800;
}

.main-content {
  @apply flex-1;
  @apply bg-black/10;
}

.seller-sidebar {
  @apply bg-white;
  @apply p-4;
  @apply fixed left-0 bottom-0;
  top: 56px;
  width: 240px;
}
</style>
