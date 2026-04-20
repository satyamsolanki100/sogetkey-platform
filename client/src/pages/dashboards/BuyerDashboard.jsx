import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

function BuyerDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions/my");
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to load buyer transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-10">Loading dashboard...</p>
    );
  }

  const totalSavings = transactions.reduce(
    (sum, t) => sum + (t.originalPrice - t.finalPrice),
    0,
  );

  const uniquePlatforms = new Set(transactions.map((t) => t.redirectPlatform));

  return (
    <section className="w-full">
      <PageHeader
        title="Buyer Dashboard"
        subtitle="Track your savings and coupon usage"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <p className="text-sm text-gray-400">Total Savings</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            ₹{totalSavings}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Coupons Used</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">
            {transactions.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-400">Platforms Used</p>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">
            {uniquePlatforms.size}
          </p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Recent Savings
        </h2>

        {transactions.length === 0 && (
          <p className="text-sm text-gray-400">
            No transactions yet. Start saving now.
          </p>
        )}

        <div className="space-y-4">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between border-b border-[#1f2937] pb-3 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-100">{t.product?.title}</p>

                <div className="mt-1">
                  <Badge text={t.redirectPlatform || "Platform"} type="info" />
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-400">
                  Saved ₹{t.originalPrice - t.finalPrice}
                </p>
                <p className="text-sm text-gray-400">Paid ₹{t.finalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export default BuyerDashboard;
