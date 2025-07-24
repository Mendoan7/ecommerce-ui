<template>
  <div>
    <h3 class="font-medium text-lg">Profil Saya</h3>
    <p class="text-sm text-black">Kelola informasi pribadi Anda</p>
    <hr class="mt-5 mb-8 border-gray-200/50" />
    <div class="flex divide-x items-start">
      <!-- Left Item -->
      <div class="flex-1 pr-6 flex flex-col gap-7">
        <div class="profile-item">
          <p class="profile-item-title">Username</p>
          <span>ardiansyahbr7</span>
        </div>

        <div class="profile-item">
          <p class="profile-item-title">Nama</p>
          <UInput class="flex-1" size="lg" />
        </div>

        <div class="profile-item">
          <p class="profile-item-title">Email</p>
          <div class="flex gap-2 items-center">
            <span>ardiansyahbr7@mail.com</span>
            <UButton
              variant="link"
              label="Ubah"
              color="blue"
              class="underline"
              :padded="false"
              to="/my-account/profile/change-email"
            />
          </div>
        </div>

        <div class="profile-item">
          <p class="profile-item-title">Nomer Telepon</p>
          <div class="flex gap-2 items-center">
            <span>08123456789</span>
            <UButton
              variant="link"
              label="Ubah"
              color="blue"
              class="underline"
              :padded="false"
              to="/my-account/profile/change-phone"
            />
          </div>
        </div>

        <div class="profile-item">
          <p class="profile-item-title">Nama Toko</p>
          <UInput class="flex-1" size="lg" />
        </div>

        <div class="profile-item">
          <p class="profile-item-title">Jenis Kelamin</p>
          <URadioGroup
            :options="['Laki-laki', 'Perempuan', 'Lainnya']"
            class="flex-1"
            size="lg"
            :ui="{
              fieldset: 'flex gap-3',
            }"
          />
        </div>

        <div class="profile-item">
          <p class="profile-item-title">Tanggal Lahir</p>
          <BaseDatePicker />
        </div>

        <div class="mt-4">
          <UButton label="Simpan" />
        </div>
      </div>

      <!-- Right Item -->
      <div class="w-72 pl-6 flex flex-col items-center gap-5">
        <UAvatar size="3xl" alt="Ardiansyah Bisma" />
        <UButton label="Pilih Gambar" color="white" @click="handleChooseFile" />
        <input
          ref="fileInput"
          type="file"
          accept=".jpg,.png"
          @change="handleUploadFile"
          class="hidden"
        />
        <ul class="text-sm font-normal text-black/55">
          <li>Ukuran gambar : maks. 1MB</li>
          <li>Format gambar : .JPG, .PNG</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { URadioGroup } from "#components";

const fileInput = ref();

function handleChooseFile() {
  fileInput.value.value = null;
  fileInput.value.click();
}

function handleUploadFile() {}
</script>

<style scoped>
.profile-item {
  @apply flex gap-11 items-center;
}

.profile-item-title {
  @apply text-black/55;
  @apply text-sm;
  @apply w-24;
  @apply text-right;
}
</style>
