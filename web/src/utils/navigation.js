export const getRoleHomePath = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "admin") return "/admin/dashboard";
  if (normalized === "seller") return "/seller/dashboard";
  if (normalized === "customer") return "/customer/home";
  return "/";
};
