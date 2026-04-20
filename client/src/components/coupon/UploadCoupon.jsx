import { useState } from "react";
import api from "../../services/api";
import Button from "../ui/Button";

function UploadCoupon({ onSuccess }) {
  const [form, setForm] = useState({
    code: "",
    platform: "",
    discountType: "flat",
    discountValue: "",
    expiryDate: "",
  });

  const [proofImage, setProofImage] = useState(null);

  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductSearch = async () => {
    if (!productSearch.trim()) return;

    try {
      const res = await api.get(`/products/search?q=${productSearch}`);
      setSearchResults(res.data || []);
    } catch (err) {
      console.log(err);
      setSearchResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError("Please select a product first");
      return;
    }

    if (!proofImage) {
      setError("Proof image is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Coupon fields
      data.append("code", form.code.trim());
      data.append("platform", form.platform.trim());
      data.append("discountType", form.discountType);
      data.append("discountValue", Number(form.discountValue));
      data.append("expiryDate", form.expiryDate);

      // Product fields (VERY IMPORTANT)
      data.append("productId", String(selectedProduct.productId));
      data.append("productTitle", selectedProduct.title);
      data.append("productImage", selectedProduct.image);
      data.append("productPrice", Number(selectedProduct.price));

      // Multer field (must match backend upload.single("image"))
      data.append("image", proofImage);

      await api.post("/vouchers", data);

      setSuccess("Coupon submitted for admin approval");

      setForm({
        code: "",
        platform: "",
        discountType: "flat",
        discountValue: "",
        expiryDate: "",
      });

      setProofImage(null);
      setSelectedProduct(null);
      setSearchResults([]);
      setProductSearch("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to upload coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0f1a] border border-[#1f2937] rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Upload new coupon
        </h3>

        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        {success && <p className="text-sm text-emerald-400 mb-3">{success}</p>}

        {/* PRODUCT SEARCH */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              placeholder="Search product first..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="flex-1 bg-[#05070d] border border-[#1f2937] rounded-lg px-4 py-2 text-gray-100"
            />
            <Button type="button" onClick={handleProductSearch}>
              Search
            </Button>
          </div>

          {searchResults.map((p) => (
            <div
              key={p.productId}
              onClick={() => {
                setSelectedProduct(p);
                setSearchResults([]);
              }}
              className="mt-3 p-3 border border-[#1f2937] rounded-lg cursor-pointer hover:border-amber-500"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="text-gray-100">{p.title}</p>
                  <p className="text-sm text-gray-400">₹ {p.price}</p>
                </div>
              </div>
            </div>
          ))}

          {selectedProduct && (
            <p className="mt-3 text-emerald-400 text-sm">
              Selected: {selectedProduct.title}
            </p>
          )}
        </div>

        {/* COUPON FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="code"
            placeholder="Coupon code"
            value={form.code}
            onChange={handleChange}
            required
            className="bg-[#05070d] border border-[#1f2937] rounded-lg px-4 py-2 text-gray-100"
          />

          <input
            name="platform"
            placeholder="Platform (Amazon, Flipkart)"
            value={form.platform}
            onChange={handleChange}
            required
            className="bg-[#05070d] border border-[#1f2937] rounded-lg px-4 py-2 text-gray-100"
          />

          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="bg-[#05070d] border border-[#1f2937] rounded-lg px-4 py-2 text-gray-100"
          >
            <option value="flat">Flat discount (₹)</option>
            <option value="percent">Percentage (%)</option>
          </select>

          <input
            name="discountValue"
            type="number"
            min="1"
            placeholder="Discount value"
            value={form.discountValue}
            onChange={handleChange}
            required
            className="bg-[#05070d] border border-[#1f2937] rounded-lg px-4 py-2 text-gray-100"
          />

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            required
            onChange={(e) => setProofImage(e.target.files[0])}
            className="text-gray-300"
          />

          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Expiry Date</label>
            <input
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              required
              className="bg-[#05070d] border border-[#1f2937] rounded-lg px-4 py-2 text-gray-100"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Submit for approval"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadCoupon;
