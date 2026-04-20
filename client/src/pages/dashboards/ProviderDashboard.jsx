import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import UploadCoupon from "../../components/coupon/UploadCoupon";

function ProviderDashboard() {
  const [coupons, setCoupons] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [sales, setSales] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [couponRes, earningRes] = await Promise.all([
        api.get("/vouchers"),
        api.get("/provider/earnings"),
      ]);

      setCoupons(couponRes.data || []);
      setEarnings(earningRes.data.totalEarnings || 0);
      setSales(earningRes.data.totalSales || 0);
    } catch (err) {
      console.error("Failed to load provider dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-10">Loading dashboard...</p>
    );
  }

  const approvedCoupons = coupons.filter((c) => c.isApproved);
  const pendingCoupons = coupons.filter((c) => !c.isApproved);

  return (
    <section className="w-full">
      <PageHeader
        title="Provider Dashboard"
        subtitle="Upload coupons and track your earnings"
      />

      <UploadCoupon onSuccess={fetchData} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card>
          <p className="text-sm text-gray-400">Total Earnings</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            ₹ {earnings}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Total Sales</p>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">
            {sales}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Approved</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            {approvedCoupons.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Pending</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">
            {pendingCoupons.length}
          </p>
        </Card>
      </div>

      {/* Coupon Table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Uploaded Coupons
        </h2>

        {coupons.length === 0 && (
          <p className="text-sm text-gray-400">
            You haven’t uploaded any coupons yet.
          </p>
        )}

        {coupons.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1f2937] text-left text-gray-400">
                  <th className="py-2">Code</th>
                  <th className="py-2">Platform</th>
                  <th className="py-2">Product</th>
                  <th className="py-2">Discount</th>
                  <th className="py-2">Expiry</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Used</th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-[#1f2937] last:border-b-0"
                  >
                    <td className="py-3 font-medium text-gray-100">{c.code}</td>

                    <td className="py-3">
                      <Badge text={c.platform} type="info" />
                    </td>

                    <td className="py-3 text-gray-400">{c.product?.title}</td>

                    <td className="py-3 text-gray-300">
                      {c.discountType === "percent"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>

                    <td className="py-3 text-gray-400">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="py-3">
                      <Badge
                        text={c.isApproved ? "approved" : "pending"}
                        type={c.isApproved ? "success" : "warning"}
                      />
                    </td>

                    <td className="py-3 text-gray-300">{c.usedCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}

export default ProviderDashboard;
