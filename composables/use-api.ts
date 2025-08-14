import type { UseFetchOptions } from "#app";

export function useApi<T = unknown>(
  request: string | Ref<string>,
  options: UseFetchOptions<T>
) {
  const toast = useToast();
  const session = useSession();
  return useFetch(request, {
    onRequest({ options }) {
      if (session.token) {
        options.headers.set("Authorization", `Bearer ${session.token}`);
      }
    },
    onResponseError({ response }) {
      // ⬇️ abaikan 401: ini umum terjadi saat guest, jangan spam toast
      if (response.status === 401) return;

      if (response._data.meta?.messages?.[0]) {
        toast.add({
          color: "red",
          title: response._data.meta.messages[0],
        });
      }
    },
    retry: false,
    ...options,
  });
}
