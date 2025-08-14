<template>
  <div class="input-quantity">
    <UButton
      color="white"
      icon="i-heroicons:minus"
      variant="ghost"
      :disabled="disabled"
      @click="handleDecrease"
    />
    <UInput
      v-model.number="model"
      type="number"
      :padded="false"
      :ui="{
        base: 'text-center w-14',
        rounded: 'rounded-none',
        color: { white: '' },
        variant: { solid: '' },
      }"
      :disabled="disabled"
      @change="normalize"
      @blur="normalize"
    />
    <UButton
      color="white"
      icon="i-heroicons:plus"
      variant="ghost"
      :disabled="disabled"
      @click="handleIncrease"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  min: { type: Number, default: 1 },
  max: { type: Number, default: 10 },
  disabled: { type: Boolean, default: false },
});
const model = defineModel({ default: 1, type: Number });

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
function normalize() {
  const v = Number.isFinite(model.value) ? model.value : props.min;
  model.value = clamp(v, props.min, props.max);
}
function handleDecrease() {
  if (props.disabled) return;
  model.value = clamp((model.value ?? props.min) - 1, props.min, props.max);
}
function handleIncrease() {
  if (props.disabled) return;
  model.value = clamp((model.value ?? props.min) + 1, props.min, props.max);
}
</script>

<style scoped>
.input-quantity {
  @apply border;
  @apply flex;
  @apply divide-x;
}

.input-quantity :deep(input) {
  @apply h-full;
  @apply text-center;
  @apply w-14;
}

.input-quantity :deep(input)::-webkit-outer-spin-button,
.input-quantity :deep(input)::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.input-quantity :deep(input)[type="number"] {
  -moz-appearance: textfield;
}
</style>
