<template>
  <UModal v-model="open">
    <UCard
      :ui="{
        rounded: 'rounded-sm',
      }"
    >
      <h3 class="text-xl font-normal">Alamat Baru</h3>
      <form class="grid grid-cols-2 gap-5 mt-5">
        <UFormGroup>
          <UInput placeholder="Nama Lengkap" size="lg" />
        </UFormGroup>
        <UFormGroup>
          <UInput placeholder="Nomor Telepon" size="lg" />
        </UFormGroup>
        <UFormGroup class="col-span-2">
          <FeatureProfileAddressInputSelectCity />
        </UFormGroup>
        <UFormGroup>
          <UInput placeholder="Kecamatan" size="lg" />
        </UFormGroup>
        <UFormGroup>
          <UInput placeholder="Kode Pos" size="lg" />
        </UFormGroup>
        <UFormGroup class="col-span-2">
          <UTextarea placeholder="Nama Jalan, Gedung, No. Rumah" size="lg" />
        </UFormGroup>
        <UFormGroup class="col-span-2">
          <UInput
            placeholder="Detail Lainnya (Cth: Blok / Unit No., Patokan)"
            size="lg"
          />
        </UFormGroup>
        <div class="col-span-2">
          <label class="text-sm font-normal text-black/80">
            Tandai Sebagai:
          </label>
          <!-- <BaseRadioCard class="!flex !gap-2 justify-start my-2">
            <template #item="{ label, value, selected, onClick }">
              <UButton
                :color="selected ? 'primary' : 'white'"
                :variant="selected ? 'soft' : 'solid'"
                :ui="{
                  padding: {
                    sm: 'py-3 px-3',
                  },
                }"
                @click="onClick(value)"
              >
                {{ label }}
              </UButton>
            </template>
          </BaseRadioCard> -->

          <UCheckbox
            label="Atur sebagai Alamat Pribadi"
            :ui="{
              label: 'text-black/55',
            }"
          />
        </div>
        <div class="flex justify-end mt-6 gap-2 col-span-2">
          <UButton
            label="Nanti Saja"
            color="gray"
            class="max-w-36"
            variant="link"
            block
            @click="handleCancel"
          />
          <UButton
            type="submit"
            label="Ok"
            class="max-w-36"
            block
            @click="handleSave"
          />
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup>
const open = defineModel("open", {
  type: Boolean,
  default: false,
});

function handleCancel() {
  open.value = false;
}

function handleSave() {
  open.value = false;
}
</script>

<style lang="scss" scoped></style>
