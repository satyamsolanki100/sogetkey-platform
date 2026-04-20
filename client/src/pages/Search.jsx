import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);

      const productRes = await api.get(
        `/products/search?q=${encodeURIComponent(query)}`,
      );

      const products = productRes.data || [];

      setResults(products);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto">
      <Card>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Search products
        </h2>

        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            placeholder="Search product (e.g. iPhone 15)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </Card>

      <div className="mt-6 space-y-4">
        {!loading && results.length === 0 && (
          <p className="text-gray-400 text-sm">No products found</p>
        )}

        {results.map((p) => (
          <Card key={p.productId}>
            <div className="flex items-center gap-4">
              <img
                src={p.image}
                alt={p.title}
                className="w-20 h-20 object-contain"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-100">
                  {p.title}
                </h3>

                <p className="text-sm text-gray-400">₹ {p.price}</p>

                <p className="text-xs text-amber-400 mt-1">
                  Recommended: {p.recommended?.platform}
                </p>
              </div>

              <div>
                <Button
                  onClick={() =>
                    navigate(`/apply-coupon/${p.productId}`, {
                      state: { product: p },
                    })
                  }
                >
                  View Deals
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Search;
