<template>
  <section class="auth-hero">
    <UContainer
      class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12 sm:py-16"
    >
      <!-- Left Logo -->
      <div class="flex justify-center md:justify-start">
        <div
          class="flex flex-col gap-6 sm:gap-10 text-white text-center md:text-left"
        >
          <h1 class="auth-hero-title">Syopee</h1>
          <p class="auth-hero-subtitle">
            Tempat Belanja Online No. 1<br class="hidden sm:block" />
            di Asia Tengara dan Taiwan
          </p>
        </div>
      </div>
      <div class="w-full">
        <UCard
          class="auth-card w-full max-w-md mx-auto"
          :ui="{
            rounded: 'rounded-sm',
          }"
        >
          <h2 class="auth-card-title">Daftar</h2>
          <form
            class="mt-6 sm:mt-7 space-y-6 sm:space-y-7"
            @submit.prevent="handleSubmit"
          >
            <UFormGroup :error="v$.email.$errors?.[0]?.$message">
              <UInput
                v-model="registerForm.email"
                placeholder="Email"
                size="lg"
              />
            </UFormGroup>
            <UButton
              :loading="status === 'pending'"
              type="submit"
              block
              class="uppercase"
              >Berikutnya</UButton
            >
          </form>
          <UDivider
            label="ATAU"
            class="my-4"
            :ui="{
              label: 'text-gray-300 font-normal',
            }"
          />
          <BaseButtonGoogleSignIn />
          <p class="text-sm font-normal text-black/25 text-center mt-8">
            Punya akun?
            <NuxtLink to="/login" class="text-primary">Log in</NuxtLink>
          </p>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";

definePageMeta({
  layout: "auth",
  header: {
    title: "Daftar",
  },
  middleware: ["must-not-auth"],
});

const router = useRouter();
const { registerForm } = storeToRefs(useSession());

const rules = {
  email: { required, email },
};

const $externalResults = ref({});

const v$ = useVuelidate(rules, registerForm, {
  $autoDirty: true,
  $externalResults,
});

const { status, error, execute } = useSubmit("/server/api/register");

async function handleSubmit() {
  $externalResults.value = {};

  const isValid = await v$.value.$validate();
  if (!isValid) return;

  await execute({
    email: registerForm.value.email,
  });

  if (error.value) {
    $externalResults.value = error.value.data?.meta?.validations || {};
    return;
  }

  if (status.value === "success") {
    router.push("/register/form");
  }
}
</script>

<style scoped>
.auth-hero {
  @apply bg-primary;
}
.auth-hero-title {
  @apply text-5xl sm:text-6xl md:text-7xl;
}
.auth-hero-subtitle {
  @apply text-sm sm:text-base text-white/90;
}
.auth-card {
  @apply bg-white;
}
.auth-card-title {
  @apply text-lg;
}
</style>
