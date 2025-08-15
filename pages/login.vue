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
      <!-- Right Form -->
      <div class="w-full">
        <UCard
          class="auth-card w-full max-w-md mx-auto"
          :ui="{
            rounded: 'rounded-sm',
          }"
        >
          <h2 class="auth-card-title">Login</h2>
          <form
            class="mt-6 sm:mt-7 space-y-6 sm:space-y-7"
            @submit.prevent="handleSubmit"
          >
            <UFormGroup :error="v$.phone_email.$errors?.[0]?.$message">
              <UInput
                v-model="form.phone_email"
                placeholder="No. Handphone/Email"
                size="lg"
              />
            </UFormGroup>
            <UFormGroup :error="v$.password.$errors?.[0]?.$message">
              <BaseInputPassword
                v-model="form.password"
                placeholder="Password"
                size="lg"
              />
            </UFormGroup>
            <div>
              <UButton
                type="submit"
                block
                :loading="status === 'pending' || statusProfile === 'pending'"
                >Log in</UButton
              >
              <UButton
                variant="link"
                color="blue"
                :padded="false"
                class="mt-2"
                to="/forgot-password"
              >
                Lupa password
              </UButton>
            </div>
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
            Baru di Syopee?
            <NuxtLink to="/register" class="text-primary">Daftar</NuxtLink>
          </p>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";

definePageMeta({
  layout: "auth",
  header: {
    title: "Log in",
  },
  middleware: ["must-not-auth"],
});

const session = useSession();
const { profile, token: tokenSession } = storeToRefs(session);
const token = useCookie("access_token");

const nuxtApp = useNuxtApp();

const form = ref({
  phone_email: "",
  password: "",
});

const rules = {
  phone_email: {
    required,
    isValidUsername: helpers.withMessage("Value is not valid", (value) => {
      if (value) {
        if (/^\d{4}/.test(value)) {
          // checking phone number
          return /^\d+$/.test(value);
        }

        // chekcing email
        return email.$validator(value);
      }
      return true;
    }),
  },
  password: { required, minLength: minLength(8) },
};

const $externalResults = ref({});

const v$ = useVuelidate(rules, form, {
  $autoDirty: true,
  $externalResults,
});

const { status, execute, error, data } = useSubmit("/server/api/login");

const { execute: getProfile, status: statusProfile } = useApi(
  "/server/api/profile",
  {
    immediate: false,
    onResponse({ response }) {
      if (response.ok) {
        profile.value = response._data?.data;

        nuxtApp.runWithContext(() => {
          navigateTo("/");
        });
      }
    },
  }
);

async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  // Fetch api

  await execute(form.value);

  if (error.value) {
    $externalResults.value = error.value.data?.meta?.validations || {};
    return;
  }

  if (status.value === "success" && data.value?.data?.token) {
    tokenSession.value = data.value?.data?.token;
    token.value = data.value?.data?.token;
    getProfile();
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
