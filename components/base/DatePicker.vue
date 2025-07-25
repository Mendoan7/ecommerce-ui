<script setup>
import { DatePicker as VCalendarDatePicker } from "v-calendar";

import "v-calendar/dist/style.css";
import { format } from "date-fns";

defineProps({
  range: {
    type: Boolean,
    default: false,
  },
});

const date = defineModel({
  type: [Date, Object],
  default: null,
});

const showingDate = computed(() => {
  if (date.value) return format(date.value, "d/MM/yy");
  return "";
});

const attrs = {
  transparent: true,
  borderless: true,
  color: "primary",
  "is-dark": { selector: "html", darkClass: "dark" },
  "first-day-of-week": 2,
};
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UInput :model-value="showingDate" readonly size="lg" class="w-full" />

    <template #panel="{ close }">
      <VCalendarDatePicker
        v-if="range"
        v-model.range="date"
        :columns="2"
        v-bind="{ ...attrs, ...$attrs }"
        @update:model-value="close"
      />
      <VCalendarDatePicker
        v-else
        v-model="date"
        v-bind="{ ...attrs, ...$attrs }"
        @update:model-value="close"
      />
    </template>
  </UPopover>
</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-gray-50));
  --vc-gray-100: rgb(var(--color-gray-100));
  --vc-gray-200: rgb(var(--color-gray-200));
  --vc-gray-300: rgb(var(--color-gray-300));
  --vc-gray-400: rgb(var(--color-gray-400));
  --vc-gray-500: rgb(var(--color-gray-500));
  --vc-gray-600: rgb(var(--color-gray-600));
  --vc-gray-700: rgb(var(--color-gray-700));
  --vc-gray-800: rgb(var(--color-gray-800));
  --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
  --vc-accent-50: rgb(var(--color-primary-50));
  --vc-accent-100: rgb(var(--color-primary-100));
  --vc-accent-200: rgb(var(--color-primary-200));
  --vc-accent-300: rgb(var(--color-primary-300));
  --vc-accent-400: rgb(var(--color-primary-400));
  --vc-accent-500: rgb(var(--color-primary-500));
  --vc-accent-600: rgb(var(--color-primary-600));
  --vc-accent-700: rgb(var(--color-primary-700));
  --vc-accent-800: rgb(var(--color-primary-800));
  --vc-accent-900: rgb(var(--color-primary-900));
}
</style>
