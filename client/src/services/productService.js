import api from "./api";

export const searchProducts = async (q) => {
  const res = await api.get(`/products/search?q=${encodeURIComponent(q)}`);
  return res.data;
};
