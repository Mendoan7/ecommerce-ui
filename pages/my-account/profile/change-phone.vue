<template>
  <div>
    <h3 class="text-xl font-medium">Ganti Nomor Telepon</h3>
    <hr class="mt-5 mb-8 border-gray-200/50" />
    <form>
      <UFormGroup
        label="Nomor Telepon Baru"
        :ui="{
          wrapper: 'flex gap-16',
          container: 'w-96',
          label: {
            wrapper: 'pt-2',
            base: 'font-normal text-black/55 text-base',
          },
        }"
      >
        <UInput size="lg" />
        <UButton label="Selanjutnya" class="mt-8" />
      </UFormGroup>
    </form>
  </div>
</template>

<script setup></script>

<style scoped></style>
