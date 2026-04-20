export function formatPrice(value) {
  if (!value && value !== 0) return "₹0";

  return `₹${Number(value).toLocaleString("en-IN")}`;
}
