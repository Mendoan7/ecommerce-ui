<template>
  <UContainer class="py-5 flex flex-col md:flex-row gap-5 md:gap-7">
    <!-- Mobile top actions -->
    <div class="md:hidden flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <UAvatar
          :src="session.profile.photo_url"
          icon="i-heroicons:user"
          :alt="session.profile.name"
          img-class="object-cover"
        />
        <div class="min-w-0">
          <p class="font-medium leading-tight truncate">
            {{ session.profile.name }}
          </p>
          <p class="text-xs text-black/50 truncate">Akun Saya</p>
        </div>
      </div>

      <UButton
        icon="i-heroicons:bars-3-20-solid"
        color="white"
        @click="isSidebarOpen = true"
        class="shrink-0"
      >
        Menu Akun
      </UButton>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:block w-full md:w-56 md:shrink-0">
      <UCard class="p-4 md:sticky md:top-24">
        <div class="flex gap-3 items-center">
          <UAvatar
            :src="session.profile.photo_url"
            icon="i-heroicons:user"
            :alt="session.profile.name"
            img-class="object-cover"
          />
          <span class="truncate">{{ session.profile.name }}</span>
        </div>
        <hr class="border-gray-200/50 my-4" />
        <div class="overflow-x-auto md:overflow-visible">
          <LayoutsSidebar
            :items="links"
            class="my-account-sidebar min-w-[18rem] md:min-w-0"
          />
        </div>
      </UCard>
    </aside>

    <!-- Content -->
    <main class="flex-1 min-w-0">
      <ClientOnly>
        <component :is="wrapper">
          <NuxtPage />
        </component>
      </ClientOnly>
    </main>

    <!-- Mobile Drawer Sidebar -->
    <USlideover
      v-model="isSidebarOpen"
      side="left"
      :overlay="true"
      :ui="{ width: 'w-[86vw] max-w-xs' }"
    >
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="session.profile.photo_url"
                icon="i-heroicons:user"
                :alt="session.profile.name"
                img-class="object-cover"
              />
              <div class="min-w-0">
                <p class="font-medium leading-tight truncate">
                  {{ session.profile.name }}
                </p>
                <p class="text-xs text-black/50 truncate">Akun Saya</p>
              </div>
            </div>
            <UButton
              icon="i-heroicons:x-mark-20-solid"
              color="white"
              @click="isSidebarOpen = false"
            />
          </div>
        </template>

        <div class="flex-1 overflow-y-auto pr-1">
          <LayoutsSidebar :items="links" class="my-account-sidebar" />
        </div>

        <template #footer>
          <div class="flex items-center justify-end">
            <UButton color="white" @click="isSidebarOpen = false"
              >Tutup</UButton
            >
          </div>
        </template>
      </UCard>
    </USlideover>
  </UContainer>
</template>

<script setup>
import { UCard } from "#components";

definePageMeta({ middleware: ["must-auth"] });

const session = useSession();
const route = useRoute();
const wrapper = computed(() => route.meta.wrapper || UCard);

const isSidebarOpen = ref(false);

// Tutup drawer saat berpindah halaman (klik menu)
watch(
  () => route.fullPath,
  () => {
    isSidebarOpen.value = false;
  }
);

const links = [
  {
    label: "Akun Saya",
    icon: "i-heroicons:user",
    defaultOpen: true,
    children: [
      { label: "Profil", to: "/my-account/profile" },
      { label: "Alamat", to: "/my-account/addresses" },
      { label: "Ubah Password", to: "/my-account/change-password" },
    ],
  },
  {
    label: "Pesanan Saya",
    icon: "i-heroicons:clipboard-document-list",
    to: "/my-account/orders",
  },
];
</script>

<style scoped>
.my-account-sidebar :deep(.sidebar-item-icon) {
  @apply text-blue-700 h-5 w-5;
}
.my-account-sidebar :deep(.sidebar-item) {
  @apply whitespace-nowrap md:whitespace-normal;
}

/* Sentuhan nyaman di mobile: area tap lebih besar */
.my-account-sidebar :deep(.sidebar-item) {
  @apply py-2;
}
/* Sorot link aktif */
.my-account-sidebar :deep(.router-link-active) {
  @apply text-primary;
}
/* Rapikan accordion child spacing */
.my-account-sidebar :deep(.pl-8.flex.flex-col.gap-4.mt-4) {
  @apply gap-3;
}
</style>
