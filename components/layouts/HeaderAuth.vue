<template>
  <header class="header-auth">
    <LayoutsHeaderProfile />
    <div class="header-bottom">
      <UContainer class="header-bottom-container">
        <BaseLogo />
        <LayoutsSearchBar class="flex-1" />
        <UButton variant="link">
          <IconCart />
        </UButton>
      </UContainer>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.header-auth {
  @apply text-white;
  @apply flex flex-col;
}

.header-auth .header-bottom {
  @apply bg-gradient-to-b from-primary to-[#FF6633];
  @apply flex-1;
  @apply py-6;
}

.header-bottom-container {
  @apply flex justify-between items-center gap-12;
  @apply h-full;
}
</style>
