import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function CouponApply() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const res = await api.get(`/vouchers/product/${product.productId}`);
        setCoupons(res.data || []);
      } catch (err) {
        console.error("Failed to load coupons", err);
      } finally {
        setLoading(false);
      }
    };

    if (product?.productId) {
      loadCoupons();
    } else {
      setLoading(false);
    }
  }, [product]);

  const handleContinue = async () => {
    if (!product) return;

    try {
      setApplying(true);

      if (selectedCoupon) {
        await api.post("/transactions/apply", {
          productId: product.productId,
          productTitle: product.title,
          productPrice: product.price,
          voucherId: selectedCoupon._id,
        });
      }
    } catch (err) {
      console.error("Transaction failed", err);
    } finally {
      setApplying(false);

      if (product?.recommended?.link) {
        window.open(product.recommended.link, "_blank");
      }
    }
  };

  if (!product) {
    return (
      <section className="max-w-3xl mx-auto">
        <p className="text-gray-400">Product not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto">
        <p className="text-gray-400">Loading coupons...</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto">
      <Card>
        <div className="flex items-center gap-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-24 h-24 object-contain"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-100">
              {product.title}
            </h2>
            <p className="text-gray-400 text-sm">Price: ₹ {product.price}</p>
            <p className="text-xs text-amber-400 mt-1">
              Recommended Platform: {product.recommended?.platform}
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-gray-100">Available Coupons</h3>

        {coupons.length === 0 && (
          <p className="text-gray-500 text-sm">No verified coupons available</p>
        )}

        {coupons.map((c) => (
          <Card
            key={c._id}
            className={`cursor-pointer ${
              selectedCoupon?._id === c._id ? "border border-amber-500" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-100">{c.code}</p>
                <p className="text-sm text-gray-400">
                  Save{" "}
                  {c.discountType === "percent"
                    ? `${c.discountValue}%`
                    : `₹${c.discountValue}`}
                </p>
                <p className="text-xs text-gray-500">
                  Expires: {new Date(c.expiryDate).toLocaleDateString()}
                </p>
              </div>

              <Button onClick={() => setSelectedCoupon(c)}>
                {selectedCoupon?._id === c._id ? "Selected" : "Apply"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button full disabled={applying} onClick={handleContinue}>
          {applying ? "Redirecting..." : "Continue to Recommended Platform"}
        </Button>
      </div>
    </section>
  );
}

export default CouponApply;
