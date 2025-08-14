// // middleware/must-not-auth.js
// export default defineNuxtRouteMiddleware(async () => {
//   const session = useSession();

//   if (session.tokenCookie) {
//     return navigateTo("/my-account/profile"); // internal redirect
//   }
// });

export default defineNuxtRouteMiddleware(async () => {
  const session = useSession();

  if (session.tokenCookie) {
    return navigateTo("/my-account/profile", {
      external: true,
    });
  }
});
