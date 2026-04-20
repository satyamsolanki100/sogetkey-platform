import api from "./api";

// Provider upload
export const uploadVoucher = async (data) => {
  const res = await api.post("/vouchers", data);
  return res.data;
};

// Admin get all vouchers
export const getVouchers = async () => {
  const res = await api.get("/vouchers");
  return res.data;
};

// Admin approve
export const approveVoucher = async (id) => {
  const res = await api.put(`/vouchers/${id}/approve`);
  return res.data;
};
