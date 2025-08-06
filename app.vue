<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>

<script setup>
const url = useRequestURL();
useSeoMeta({
  description: "Tempat Belanja Online No. 1 di Asia Tengara",
  ogTitle: "Syopee - Ayo Belanja di sini",
  ogDescription: "Tempat Belanja Online No. 1 di Asia Tengara",
  twitterTitle: "Syopee - Ayo Belanja di sini",
  ogUrl: () => url.href,
  ogImage: "/images/syopee.png",
  twitterImage: "/images/syopee.png",
  twitterDescription: "Tempat Belanja Online No. 1 di Asia Tengara",
  twitterCard: "summary",
});

useHead({
  titleTemplate: (titlePerPage) => {
    return titlePerPage
      ? `${titlePerPage} | Syopee`
      : "Syopee - Ayo Belanja di sini";
  },
  htmlAttrs: {
    lang: "id",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.custom-shadow {
  box-shadow: 0px 6px 6px 0px #0000000f;
}
</style>
