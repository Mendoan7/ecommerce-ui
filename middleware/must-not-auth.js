export default defineNuxtRouteMiddleware(async () => {
  const session = useSession();

  if (session.tokenCookie) {
    return navigateTo("/my-account/profile", {
      external: true
    });
  }
});