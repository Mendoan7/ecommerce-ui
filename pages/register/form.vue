<template>
  <section class="bg-white">
    <UContainer class="py-10 sm:py-14">
      <div class="max-w-[500px] mx-auto">
        <div class="step-header">
          <template v-for="(step, index) in registerStep" :key="step.key">
            <div class="step-item" :class="[index <= stepActive && 'is-done']">
              <div class="step-item-icon">
                {{ index + 1 }}
              </div>
              <p class="step-item-title">{{ step.title }}</p>
            </div>
            <IconStepArrow
              v-if="index < registerStep.length - 1"
              class="mb-6 hidden sm:block"
            />
          </template>
        </div>
        <UCard class="auth-shadow">
          <component
            :is="registerStep[stepActive].component"
            ref="formStepElement"
            v-bind="customProps"
            @next="handleNext(registerStep[stepActive].key, $event)"
            @back="handleBack(registerStep[stepActive].key)"
            @resend="handleResendOtp"
          />
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
import { FormCompleted, FormOtp, FormPassword } from "#components";

definePageMeta({
  layout: "auth",
  header: {
    class: "custom-shadow sticky top-0 z-40",
    title: "Daftar",
  },
});

const session = useSession();
const { tokenCookie, token, profile, registerForm } = storeToRefs(session);

const router = useRouter();
const stepActive = ref(0);
const formStepElement = ref();

const registerStep = [
  {
    key: "otp",
    title: "Verifikasi email",
    component: FormOtp,
  },
  {
    key: "password",
    title: "Buat password",
    component: FormPassword,
  },
  {
    key: "completed",
    title: "Selesai",
    component: FormCompleted,
  },
];

const {
  status: statusValidate,
  error: errorValidate,
  execute: validateOtp,
} = useSubmit("/server/api/check-otp");
const { status: statusResend, execute: resendOtp } = useSubmit(
  "/server/api/resend-otp",
  {
    onResponse({ response }) {
      if (response.ok) {
        formStepElement.value.startCountdown();
      }
    },
  }
);
function handleResendOtp() {
  resendOtp({
    email: registerForm.value.email,
  });
}

const {
  status: statusRegister,
  execute: verifyRegister,
  error: errorRegister,
  data: dataRegister,
} = useSubmit("/server/api/verify-register");

const { execute: getProfile, status: statusProfile } = useApi(
  "/server/api/profile",
  {
    immediate: false,
    onResponse({ response }) {
      if (response.ok) {
        profile.value = response._data.data;
        session.resetRegisterForm();
        stepActive.value++;
      }
    },
  }
);

const customProps = computed(() => {
  switch (registerStep[stepActive.value].key) {
    case "otp":
      return {
        loading: statusValidate.value === "pending",
        loadingResend: statusResend.value === "pending",
      };

    case "password":
      return {
        loading:
          statusRegister.value === "pending" ||
          statusProfile.value === "pending",
      };

    default:
      return {};
  }
});

async function handleNext(step, value) {
  switch (step) {
    case "otp":
      formStepElement.value.setError("");
      await validateOtp({
        email: registerForm.value.email,
        otp: value.otp,
      });

      if (errorValidate.value) {
        formStepElement.value.setError(
          errorValidate.value.data?.meta?.validations?.otp?.[0]
        );
        return;
      }

      if (statusValidate.value === "success") {
        registerForm.value.otp = value.otp;
        stepActive.value++;
      }
      break;

    case "password":
      formStepElement.value.setError({});

      await verifyRegister({
        email: registerForm.value.email,
        otp: registerForm.value.otp,
        password: value.password,
        password_confirmation: value.password,
      });

      if (errorRegister.value) {
        formStepElement.value.setError(
          errorRegister.value.data?.meta?.validations || {}
        );
        return;
      }

      if (statusRegister.value === "success") {
        registerForm.value.password = value.password;
        registerForm.value.password_confirmation = value.password;

        token.value = dataRegister.value.data?.token;
        tokenCookie.value = dataRegister.value.data?.token;

        getProfile();
      }
      break;

    default:
      break;
  }
}
function handleBack(stepKey) {
  if (stepKey === "otp") {
    return router.push("/register");
  }
  stepActive.value--;
}
</script>

<style scoped>
.auth-shadow {
  box-shadow: 0px 3px 10px 0px #00000024;
}

.step-header {
  @apply flex justify-between gap-3 items-center mb-10 sm:mb-16 overflow-x-auto;
  @apply px-1 -mx-1; /* beri ruang saat scroll */
}
.step-item {
  @apply flex flex-col items-center shrink-0;
}

.step-item-icon {
  @apply rounded-full px-3 py-1 ring-1 ring-inset ring-black/25;
  @apply flex items-center justify-center;
  @apply text-black/25;
}

.step-item-title {
  @apply text-black/40 text-[11px] sm:text-xs font-normal mt-1 text-center;
}

.step-item.is-done .step-item-icon {
  @apply bg-green-500 text-white ring-transparent;
}
.step-item.is-done .step-item-title {
  @apply text-green-500;
}
</style>
