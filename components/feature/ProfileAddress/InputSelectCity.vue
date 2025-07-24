<template>
  <UPopover
    :popper="{ placement: 'bottom-start', strategy: 'absolute' }"
    :ui="{
      width: 'w-full',
      rounded: 'rounded-sm',
    }"
    @update:open="handleCheckSelected"
  >
    <UInput
      :model-value="showSelected"
      :placeholder="placeholder"
      class="w-full"
      size="lg"
    />

    <template #panel="{ close }">
      <div>
        <UTabs
          v-model="tabActive"
          :items="items"
          :ui="{
            list: {
              background: 'bg-white border-b',
              padding: 'p-0',
              rounded: 'rounded-none',
              marker: {
                wrapper:
                  '!top-[0px] left-0 !h-[100%] border-b-2 border-primary',
                rounded: 'rounded-none',
                shadow: 'shadow-none',
              },
              tab: {
                active: 'text-primary',
                inactive: 'text-black/80',
                rounded: 'rounded-none',
              },
            },
          }"
        >
          <template #item="{ item }">
            <template v-if="options[item.key].length">
              <UButton
                v-for="child in options[item.key]"
                :key="child.uuid"
                variant="ghost"
                block
                :color="
                  form[item.key]?.uuid === child.uuid ? 'primary' : 'gray'
                "
                class="justify-start"
                :label="child.name"
                @click="handleSelect(child, item.key, close)"
              />
            </template>
            <p v-else class="text-center my-3 text-black/40">
              Tidak ada data ditemukan
            </p>
          </template>
        </UTabs>
      </div>
    </template>
  </UPopover>
</template>

<script setup>
defineProps({
  placeholder: {
    type: String,
    default: "Provinsi, Kota",
  },
});

const tabActive = ref(0);
const form = reactive({
  province: null,
  city: null,
});

const showSelected = computed(
  () => `${form.province?.name || ""} ${form.city?.name || ""}`
);

const items = computed(() => [
  {
    label: "Provinsi",
    key: "province",
  },
  {
    label: "Kota",
    key: "city",
    disabled: !form.province?.uuid,
  },
]);

const options = computed(() => ({
  city: cities.value,
  province: provinces.value,
}));

const provinces = computed(() => [
  {
    uuid: "ee236b0c-2f1d-4a8e-9f3c-5b6d7e8f9a0b",
    name: "Bali",
  },
  {
    uuid: "f4b5c6d7-e8f9-0a1b-2c3d-4e5f6g7h8i9h",
    name: "Jawa Barat",
  },
  {
    uuid: "f4b5c6d7-e8f9-0a1b-2c3d-4e5f6g7h8i9g",
    name: "Jawa Timur",
  },
  {
    uuid: "f4b5c6d7-e8f9-0a1b-2c3d-4e5f6g7h9i9j",
    name: "DKI Jakarta",
  },
]);

const cities = computed(() =>
  [
    {
      uuid: "f4b5c6d7-e8f9-0a1b-2c3d-4e5f6g7h8i9k",
      province: {
        uuid: "f4b5c6d7-e8f9-0a1b-2c3d-4e5f6g7h8i9g",
        name: "Jawa Timur",
      },
      external_id: "104",
      name: "Kediri",
    },
  ].filter((item) => item.province.uuid === form.province?.uuid)
);

async function handleSelect(value, type, close) {
  form[type] = value;

  await nextTick();
  if (type === "province") {
    form.city = null;
    tabActive.value = 1;
  } else {
    tabActive.value = 0;
    close();
  }
}

function handleCheckSelected(isOpen) {
  if (!isOpen) {
    tabActive.value = 0;
    if (!form.city) {
      form.province = null;
    }
  }
}
</script>

<style scoped></style>
