import { useNavigate, useSearchParams } from "react-router-dom";

function SearchResults() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get("q") || "product";

  // TEMP dummy data (backend will replace later)
  const products = [
    {
      id: "1",
      name: "iPhone 15",
      prices: [
        { platform: "Flipkart", price: 78999, best: true },
        { platform: "Amazon", price: 79999 },
        { platform: "Blinkit", price: 80999 },
      ],
    },
    {
      id: "2",
      name: "iPhone 14",
      prices: [
        { platform: "Amazon", price: 69999, best: true },
        { platform: "Flipkart", price: 70999 },
      ],
    },
  ];

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-100">
          Results for <span className="text-amber-400">“{query}”</span>
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Compare platforms and apply verified coupons
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              bg-[#0b0f1a]
              border border-[#1f2937]
              rounded-2xl
              p-6
              shadow-[0_0_20px_rgba(255,165,0,0.08)]
            "
          >
            {/* Product name */}
            <h3 className="text-xl font-semibold text-gray-100">
              {product.name}
            </h3>

            {/* Price list */}
            <div className="mt-4 space-y-2">
              {product.prices.map((p, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between
                    rounded-lg px-4 py-2
                    ${
                      p.best
                        ? "bg-amber-500/10 border border-amber-500/30"
                        : "bg-[#05070d]"
                    }
                  `}
                >
                  <span className="text-sm font-medium text-gray-300">
                    {p.platform}
                  </span>

                  <div className="flex items-center gap-2">
                    {p.best && (
                      <span className="text-xs font-semibold text-amber-400">
                        ★ Best
                      </span>
                    )}
                    <span className="font-semibold text-gray-100">
                      ₹{p.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/apply-coupon/${product.id}`)}
                className="
                  flex-1 rounded-xl px-4 py-3 text-sm font-semibold
                  bg-gradient-to-r from-amber-500 to-orange-600
                  text-black
                  hover:from-amber-400 hover:to-orange-500
                  transition
                "
              >
                View savings & coupons
              </button>

              <button
                className="
                  flex-1 rounded-xl px-4 py-3 text-sm font-medium
                  border border-[#1f2937]
                  text-gray-300
                  hover:bg-[#0b0f1a]
                  transition
                "
              >
                Buy without coupon
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SearchResults;
