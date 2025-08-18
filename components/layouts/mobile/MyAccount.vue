<template>
  <section class="myacc-mobile md:hidden">
    <!-- Banner -->
    <div class="banner">
      <UContainer>
        <div class="flex items-center gap-3 py-4">
          <UAvatar
            :src="session.profile.photo_url"
            icon="i-heroicons:user"
            :alt="session.profile.name"
            img-class="object-cover"
            class="ring-2 ring-white/50"
          />
          <div class="flex flex-col">
            <span class="font-semibold leading-tight">{{
              session.profile.name || "Akun Saya"
            }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Menu list -->
    <div class="bg-white border-t border-gray-100">
      <UContainer>
        <nav class="divide-y divide-gray-100">
          <!-- item tanpa children -->
          <NuxtLink
            v-for="(item, idx) in flatItems"
            :key="`m-${item.label}-${idx}`"
            :to="item.to"
            class="row"
            :class="{ 'router-link-active': $route.path === item.to }"
          >
            <div class="row-left">
              <UIcon v-if="item.icon" :name="item.icon" class="icon" />
              <span class="label">{{ item.label }}</span>
            </div>
            <UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </NuxtLink>

          <!-- group dengan children -->
          <UAccordion
            v-for="(group, gidx) in groups"
            :key="`g-${group.label}-${gidx}`"
            :items="[
              {
                defaultOpen: $route.path.startsWith(
                  group.children?.[0]?.to || ''
                ),
                ...group,
              },
            ]"
            :ui="{
              item: { padding: 'p-0', base: 'border-y border-gray-100' },
              default: { class: 'p-0' },
            }"
          >
            <template #default="{ open, item }">
              <button class="row w-full" type="button">
                <div class="row-left">
                  <UIcon v-if="item.icon" :name="item.icon" class="icon" />
                  <span class="label">{{ item.label }}</span>
                </div>
                <UIcon
                  name="i-heroicons:chevron-down-20-solid"
                  class="chev transition-transform"
                  :class="{ 'rotate-180': open }"
                />
              </button>
            </template>
            <template #item>
              <div class="children">
                <NuxtLink
                  v-for="(child, cidx) in group.children"
                  :key="`c-${child.label}-${cidx}`"
                  :to="child.to"
                  class="child-row"
                  :class="{ 'router-link-active': $route.path === child.to }"
                >
                  <span class="child-label">{{ child.label }}</span>
                  <UIcon
                    name="i-heroicons:chevron-right-20-solid"
                    class="chev"
                  />
                </NuxtLink>
              </div>
            </template>
          </UAccordion>
        </nav>
      </UContainer>
    </div>
  </section>
</template>

<script setup>
const session = useSession();
const props = defineProps({ items: { type: Array, default: () => [] } });
const groups = computed(() =>
  props.items.filter((i) => Array.isArray(i.children) && i.children.length)
);
const flatItems = computed(() =>
  props.items.filter((i) => !i.children || i.children.length === 0)
);
</script>

<style scoped>
.myacc-mobile {
  @apply text-slate-800;
}
.banner {
  @apply bg-gradient-to-b from-primary to-[#FF6633] text-white;
}
.row {
  @apply flex items-center justify-between gap-3 px-0 py-3 bg-white;
}
.row-left {
  @apply flex items-center gap-3;
}
.icon {
  @apply w-5 h-5 text-primary;
}
.label {
  @apply text-[15px];
}
.chev {
  @apply w-4 h-4 text-slate-400;
}
.children {
  @apply bg-white;
}
.child-row {
  @apply flex items-center justify-between pl-8 pr-0 py-3;
}
.child-label {
  @apply text-[15px];
}
.router-link-active {
  @apply text-primary;
}
</style>
