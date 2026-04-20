import api from "./api";

export const applyVoucher = async (data) => {
  const res = await api.post("/transactions/apply", data);
  return res.data;
};
