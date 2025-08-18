<template><div></div></template>

<script setup>
definePageMeta({ layout: "account", wrapper: "div" });

const bp = useBreakpoints({ md: 768 });
onMounted(() => {
  if (bp.greaterOrEqual("md").value) navigateTo("/my-account/profile");
});
</script>
