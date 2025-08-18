<template>
  <!-- DESKTOP -->
  <div class="hidden md:block">
    <div>
      <h3 class="font-medium text-lg">Profil Saya</h3>
      <p class="text-sm text-black/65">
        Kelola informasi profil Anda untuk mengontrol, melindungi dan
        mengamankan akun
      </p>
      <hr class="mt-5 mb-8 border-gray-200/60" />

      <div class="flex divide-x items-start">
        <form
          class="flex-1 pr-6 flex flex-col gap-8"
          @submit.prevent="handleSubmit"
        >
          <MyAccountFormGroup
            label="Username"
            :error="v$.username.$errors?.[0]?.$message"
          >
            <span v-if="profile.username" class="profile-item-text">{{
              profile.username || "-"
            }}</span>
            <UInput
              v-else
              v-model="temporaryProfile.username"
              class="flex-1"
              size="lg"
            />
          </MyAccountFormGroup>

          <MyAccountFormGroup
            label="Nama"
            :error="v$.name.$errors?.[0]?.$message"
          >
            <UInput v-model="temporaryProfile.name" class="flex-1" size="lg" />
          </MyAccountFormGroup>

          <div class="profile-item">
            <p class="profile-item-title">Email</p>
            <div class="flex gap-2 items-center">
              <span class="profile-item-text">{{
                temporaryProfile.email || "-"
              }}</span>
              <UButton
                variant="link"
                color="blue"
                class="underline"
                label="Ubah"
                :padded="false"
                to="/my-account/profile/change-email"
              />
            </div>
          </div>

          <div class="profile-item">
            <p class="profile-item-title">Nomor Telepon</p>
            <div class="flex gap-2 items-center">
              <span class="profile-item-text">{{
                temporaryProfile.phone || "-"
              }}</span>
              <UButton
                variant="link"
                color="blue"
                class="underline"
                label="Ubah"
                :padded="false"
                to="/my-account/profile/change-phone"
              />
            </div>
          </div>

          <MyAccountFormGroup
            label="Nama Toko"
            :error="v$.store_name.$errors?.[0]?.$message"
          >
            <UInput
              v-model="temporaryProfile.store_name"
              class="flex-1"
              size="lg"
            />
          </MyAccountFormGroup>

          <MyAccountFormGroup
            label="Jenis Kelamin"
            :error="v$.gender.$errors?.[0]?.$message"
            :ui="{ label: { wrapper: 'items-center' } }"
          >
            <URadioGroup
              v-model="temporaryProfile.gender"
              :options="['Laki-Laki', 'Perempuan', 'Lainnya']"
              class="flex-1"
              size="lg"
              :ui="{ fieldset: 'flex gap-3' }"
            />
          </MyAccountFormGroup>

          <MyAccountFormGroup
            label="Tanggal Lahir"
            :error="v$.birth_date.$errors?.[0]?.$message"
          >
            <BaseDatePicker v-model="temporaryProfile.birth_date" />
          </MyAccountFormGroup>

          <div class="mt-4">
            <UButton
              type="submit"
              :loading="status === 'pending'"
              label="Simpan"
            />
          </div>
        </form>

        <div class="w-72 pl-6 flex flex-col items-center gap-5">
          <UAvatar
            :src="imageProfile"
            size="3xl"
            :alt="temporaryProfile.name"
            icon="i-heroicons-user"
            img-class="object-cover"
          />
          <UButton label="Pilih Gambar" color="white" @click="pickFile" />
          <input
            ref="fileEl"
            type="file"
            accept=".jpeg,.png"
            class="hidden"
            @change="onPicked"
          />
          <ul class="text-sm font-normal text-black/55">
            <li>Ukuran gambar: maks. 1 MB</li>
            <li>Format gambar: .JPEG, .PNG</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- MOBILE -->
  <LayoutsMobileMyAccountProfile class="md:hidden" />
</template>

<script setup>
definePageMeta({ layout: "account" });

const {
  profile,
  temporaryProfile,
  v$,
  imageProfile,
  fileEl,
  pickFile,
  onPicked,
  handleSubmit,
  status,
} = useProfileForm();
</script>

<style scoped>
.profile-item {
  @apply flex gap-11 items-center;
}
.profile-item-title {
  @apply text-black/55 text-sm w-24 text-right;
}
.profile-item-text {
  @apply text-black/80 text-sm text-left;
}
</style>
