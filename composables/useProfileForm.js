import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { format } from "date-fns";

export function useProfileForm() {
  const session = useSession();
  const { profile } = storeToRefs(session);

  const temporaryProfile = ref({
    ...JSON.parse(JSON.stringify(profile.value)),
    birth_date: profile.value.birth_date
      ? new Date(profile.value.birth_date)
      : null,
  });

  const rules = {
    name: { required },
    username: { required },
    store_name: { required },
    gender: { required },
    photo_url: {},
    birth_date: { required },
  };

  const $externalResults = ref({});
  const v$ = useVuelidate(rules, temporaryProfile, {
    $autoDirty: true,
    $externalResults,
  });

  const imageProfile = computed(() => {
    if (
      temporaryProfile.value.photo_url &&
      typeof temporaryProfile.value.photo_url !== "string"
    ) {
      return window.URL.createObjectURL(temporaryProfile.value.photo_url);
    }
    return profile.value.photo_url;
  });

  const fileEl = ref(null);
  function pickFile() {
    if (!fileEl.value) return;
    fileEl.value.value = "";
    fileEl.value.click();
  }
  function onPicked(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    const allowed = [".jpeg", ".png"];
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowed.includes(ext))
      return alert("Format file tidak didukung (.jpeg/.png)");
    if (file.size > 1024 * 1024) return alert("Ukuran gambar melebihi 1 MB");
    temporaryProfile.value.photo_url = file;
  }

  const { execute, status, error } = useSubmit("/server/api/profile");
  async function handleSubmit() {
    $externalResults.value = {};
    const ok = await v$.value.$validate();
    if (!ok) return;

    const payload = {
      name: temporaryProfile.value.name,
      email: temporaryProfile.value.email,
      username: temporaryProfile.value.username,
      store_name: temporaryProfile.value.store_name,
      gender: temporaryProfile.value.gender,
      birth_date: temporaryProfile.value.birth_date
        ? format(temporaryProfile.value.birth_date, "Y-MM-d")
        : undefined,
      _method: "PATCH",
      photo: temporaryProfile.value.photo_url || undefined,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === "photo" && v && typeof v === "object") formData.append(k, v);
      else if (k !== "photo" && v !== undefined) formData.append(k, v);
    });

    await execute(formData);
    if (error.value) {
      $externalResults.value = error.value.data?.meta?.validations || {};
      return;
    }
    window.location.reload();
  }

  const maskedPhone = computed(() => {
    const p = temporaryProfile.value.phone || "";
    if (p.length < 4) return p || "-";
    return `${"*".repeat(Math.max(0, p.length - 2))}${p.slice(-2)}`;
  });

  const formatDate = (d) => (d ? format(d, "dd/MM/yyyy") : "");

  return {
    session,
    profile,
    temporaryProfile,
    v$,
    $externalResults,
    imageProfile,
    fileEl,
    pickFile,
    onPicked,
    execute,
    status,
    error,
    handleSubmit,
    maskedPhone,
    formatDate,
  };
}
