<template>
  <section class="md:hidden">
    <!-- Banner + Avatar -->
    <div class="banner">
      <div class="mx-auto flex flex-col items-center py-6">
        <div class="relative">
          <UAvatar
            :src="imageProfile"
            size="3xl"
            :alt="temporaryProfile.name"
            icon="i-heroicons:user"
            img-class="object-cover"
          />
          <button
            class="absolute inset-0 flex items-end justify-center rounded-full bg-black/5 text-white text-xs pb-2"
            @click="pickFile"
          >
            Ubah
          </button>
        </div>
        <input
          ref="fileEl"
          type="file"
          accept=".jpeg,.png"
          class="hidden"
          @change="onPicked"
        />
      </div>
    </div>

    <!-- List -->
    <div class="bg-white border-t border-gray-100">
      <nav class="divide-y divide-gray-100">
        <button class="row" type="button" @click="openName = true">
          <span class="label">Nama</span>
          <div class="row-right">
            <span class="value">{{ temporaryProfile.name || "-" }}</span
            ><UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </div>
        </button>

        <button class="row" type="button" disabled>
          <span class="label">Bio</span>
          <div class="row-right">
            <span class="value text-primary/70">Atur Sekarang</span
            ><UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </div>
        </button>

        <button class="row" type="button" @click="openGender = true">
          <span class="label">Jenis Kelamin</span>
          <div class="row-right">
            <span class="value">{{ temporaryProfile.gender || "-" }}</span
            ><UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </div>
        </button>

        <button class="row" type="button" @click="openBirth = true">
          <span class="label">Tanggal Lahir</span>
          <div class="row-right">
            <span class="value">{{
              temporaryProfile.birth_date
                ? formatDate(temporaryProfile.birth_date)
                : "**/**/**"
            }}</span
            ><UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </div>
        </button>

        <NuxtLink to="/my-account/profile/change-phone" class="row">
          <span class="label">No. Handphone</span>
          <div class="row-right">
            <span class="value">{{ maskedPhone }}</span
            ><UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </div>
        </NuxtLink>

        <NuxtLink to="/my-account/profile/change-email" class="row">
          <span class="label">Email</span>
          <div class="row-right">
            <span class="value text-primary">{{
              temporaryProfile.email ? temporaryProfile.email : "Atur Sekarang"
            }}</span
            ><UIcon name="i-heroicons:chevron-right-20-solid" class="chev" />
          </div>
        </NuxtLink>
      </nav>
    </div>

    <!-- Sticky submit -->
    <div class="sticky bottom-0 bg-white border-t border-gray-200 p-3 mt-6">
      <UButton
        type="button"
        :loading="status === 'pending'"
        label="Simpan"
        block
        @click="handleSubmit"
      />
    </div>

    <!-- Modals -->
    <UModal v-model="openName">
      <UCard>
        <template #header>Ubah Nama</template>
        <UInput v-model="temporaryProfile.name" size="lg" />
        <template #footer
          ><div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="openName = false"
              >Batal</UButton
            ><UButton @click="openName = false">Simpan</UButton>
          </div></template
        >
      </UCard>
    </UModal>

    <UModal v-model="openGender">
      <UCard>
        <template #header>Jenis Kelamin</template>
        <URadioGroup
          v-model="temporaryProfile.gender"
          :options="['Laki-Laki', 'Perempuan', 'Lainnya']"
          :ui="{ fieldset: 'flex flex-col gap-3' }"
        />
        <template #footer
          ><div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="openGender = false"
              >Batal</UButton
            ><UButton @click="openGender = false">Pilih</UButton>
          </div></template
        >
      </UCard>
    </UModal>

    <UModal v-model="openBirth">
      <UCard>
        <template #header>Tanggal Lahir</template>
        <BaseDatePicker v-model="temporaryProfile.birth_date" />
        <template #footer
          ><div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="openBirth = false"
              >Batal</UButton
            ><UButton @click="openBirth = false">Selesai</UButton>
          </div></template
        >
      </UCard>
    </UModal>
  </section>
</template>

<script setup>
const {
  temporaryProfile,
  imageProfile,
  fileEl,
  pickFile,
  onPicked,
  handleSubmit,
  status,
  maskedPhone,
  formatDate,
} = useProfileForm();

const openName = ref(false);
const openGender = ref(false);
const openBirth = ref(false);
</script>

<style scoped>
.banner {
  @apply bg-gradient-to-b from-primary to-[#FF6633];
}
.row {
  @apply w-full flex items-center justify-between px-4 py-3 bg-white;
}
.label {
  @apply text-[15px];
}
.row-right {
  @apply flex items-center gap-2;
}
.value {
  @apply text-[15px] text-slate-700;
}
.chev {
  @apply w-4 h-4 text-slate-400;
}
</style>
