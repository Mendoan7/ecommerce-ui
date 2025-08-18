<template>
  <UContainer class="py-5">
    <!-- DESKTOP -->
    <div class="hidden md:flex gap-7">
      <div class="w-44 py-4">
        <div class="flex gap-3 items-center">
          <UAvatar
            :src="session.profile.photo_url"
            icon="i-heroicons:user"
            :alt="session.profile.name"
            img-class="object-cover"
          />
          <span>{{ session.profile.name }}</span>
        </div>
        <hr class="border-gray-200/50 my-4" />
        <LayoutsSidebar :items="links" class="my-account-sidebar" />
      </div>

      <div class="flex-1">
        <ClientOnly>
          <component :is="wrapper"><NuxtPage /></component>
        </ClientOnly>
      </div>
    </div>

    <!-- MOBILE -->
    <div class="md:hidden">
      <!-- Root: halaman menu -->
      <LayoutsMobileMyAccount v-if="isRoot" :items="links" />

      <!-- Subpage: header back + konten -->
      <div v-else>
        <div class="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div class="flex items-center gap-2 p-3">
            <button
              class="p-1 -ml-1"
              @click="navigateTo('/my-account')"
              aria-label="Kembali"
            >
              <UIcon
                name="i-heroicons:chevron-left-20-solid"
                class="w-5 h-5 text-slate-700"
              />
            </button>
            <h3 class="text-base font-medium">{{ currentLabel }}</h3>
          </div>
        </div>
        <ClientOnly>
          <component :is="wrapper" class="mt-3"><NuxtPage /></component>
        </ClientOnly>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { UCard } from "#components";
definePageMeta({ layout: "account", middleware: ["must-auth"] });

const session = useSession();
const route = useRoute();
const links = useMyAccountLinks();

const wrapper = computed(() => route.meta.wrapper || UCard);
const isRoot = computed(() => route.path === "/my-account");

const currentLabel = computed(() => {
  for (const i of links) {
    if (i.to && i.to === route.path) return i.label;
    if (i.children) {
      const c = i.children.find((ch) => ch.to === route.path);
      if (c) return c.label;
    }
  }
  return "Akun Saya";
});
</script>

<style scoped>
.my-account-sidebar :deep(.sidebar-item-icon) {
  @apply text-blue-700 h-5 w-5;
}
</style>
