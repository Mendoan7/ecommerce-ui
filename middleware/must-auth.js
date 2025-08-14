// // middleware/must-auth.js
// export default defineNuxtRouteMiddleware(async () => {
//   const session = useSession();

//   if (!session.tokenCookie) {
//     // ⬇️ internal redirect (tanpa external:true) → hindari hydration warning
//     return navigateTo("/login");
//   }

//   if (!session.token) {
//     session.token = session.tokenCookie;

//     if (!session.profile.email) {
//       // Ambil profil di client (punya token)
//       const { error } = await useApi("/server/api/profile", {
//         key: "profile",
//         server: false,
//         immediate: true,
//         onResponse({ response }) {
//           if (response.ok) session.profile = response._data.data;
//         },
//       });

//       if (error.value) return session.logout();
//     }
//   }
// });

export default defineNuxtRouteMiddleware(async () => {
  const session = useSession();
  if (!session.tokenCookie) {
    return navigateTo("/login", {
      external: true,
    });
  }

  if (!session.token) {
    session.token = session.tokenCookie;

    if (!session.profile.email) {
      const { error } = await useApi("/server/api/profile", {
        key: "profile",
        onResponse({ response }) {
          if (response.ok) {
            session.profile = response._data.data;
          }
        },
      });

      if (error.value) {
        return session.logout();
      }
    }
  }
});
