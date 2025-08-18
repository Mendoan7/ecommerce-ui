export function useMyAccountLinks() {
  return [
    {
      label: "Akun Saya",
      icon: "i-heroicons:user",
      defaultOpen: true,
      children: [
        { label: "Profil", to: "/my-account/profile" },
        { label: "Alamat", to: "/my-account/addresses" },
        { label: "Ubah Password", to: "/my-account/change-password" },
      ],
    },
    {
      label: "Pesanan Saya",
      icon: "i-heroicons:clipboard-document-list",
      to: "/my-account/orders",
    },
  ];
}
