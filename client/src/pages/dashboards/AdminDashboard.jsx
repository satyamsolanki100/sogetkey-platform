import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

function AdminDashboard() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchPendingCoupons();
  }, []);

  const fetchPendingCoupons = async () => {
    try {
      const res = await api.get("/admin/pending-coupons");
      setCoupons(res.data || []);
    } catch (err) {
      console.error("Failed to load pending coupons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;

    try {
      await api.put(`/admin/reject/${rejectingId}`, {
        reason: rejectReason,
      });

      setCoupons((prev) => prev.filter((c) => c._id !== rejectingId));
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-10">Loading dashboard...</p>
    );
  }

  return (
    <section className="w-full">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Review and control all uploaded coupons"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <p className="text-sm text-gray-400">Pending Coupons</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">
            {coupons.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">System Status</p>
          <p className="text-lg font-semibold text-emerald-400 mt-2">Active</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Review Mode</p>
          <p className="text-lg font-semibold text-indigo-400 mt-2">
            Manual Approval
          </p>
        </Card>
      </div>

      {/* Pending Coupons */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Pending Coupons
        </h2>

        {coupons.length === 0 && (
          <p className="text-sm text-gray-400">No pending coupons</p>
        )}

        {coupons.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1f2937] text-left text-gray-400">
                  <th className="py-2">Code</th>
                  <th className="py-2">Product</th>
                  <th className="py-2">Platform</th>
                  <th className="py-2">Discount</th>
                  <th className="py-2">Provider</th>
                  <th className="py-2">Expiry</th>
                  <th className="py-2">Proof</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-[#1f2937] last:border-b-0"
                  >
                    <td className="py-3 font-medium text-gray-100">{c.code}</td>

                    <td className="py-3 text-gray-300">
                      {c.product?.title || "—"}
                    </td>

                    <td className="py-3">
                      <Badge text={c.platform} type="info" />
                    </td>

                    <td className="py-3 text-gray-300">
                      {c.discountType === "percent"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>

                    <td className="py-3 text-gray-300">
                      {c.uploadedBy?.email || "—"}
                    </td>

                    <td className="py-3 text-gray-400">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="py-3">
                      {c.proofImage ? (
                        <img
                          src={`http://localhost:5000/uploads/coupons/${c.proofImage}`}
                          alt="proof"
                          className="w-16 h-16 object-cover rounded-lg border border-[#1f2937]"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No image</span>
                      )}
                    </td>

                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => handleApprove(c._id)}
                        >
                          Approve
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => setRejectingId(c._id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b0f1a] border border-[#1f2937] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Reject Coupon
            </h3>

            <textarea
              placeholder="Enter rejection reason (mandatory)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="
                w-full rounded-xl
                bg-[#05070d]
                border border-[#1f2937]
                px-4 py-3
                text-gray-100
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-red-500
              "
            />

            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </Button>

              <Button variant="danger" onClick={handleReject}>
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
