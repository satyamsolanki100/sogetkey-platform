function ProductCard({ product }) {
  return (
    <div className="bg-[#0b0f1a] border border-[#1f2937] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#1f2937]">
        <h3 className="text-lg font-semibold text-gray-100">{product.name}</h3>
        <p className="text-sm text-gray-400 capitalize">
          {product.category || "general"}
        </p>
      </div>

      <div className="p-5 bg-[#05070d]">
        <p className="text-sm text-gray-400 mb-1">Recommended platform</p>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-amber-400">
            {product.recommended.platform}
          </p>

          <span className="text-xs font-semibold text-amber-400">
            Best Choice
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Based on reliability, availability & coupon strength
        </p>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-400 mb-3">Available on</p>

        <div className="flex flex-wrap gap-2">
          {product.availablePlatforms.map((p, i) => (
            <span
              key={i}
              className="rounded-full border border-[#1f2937] text-gray-300 text-xs px-3 py-1"
            >
              {p}
            </span>
          ))}
        </div>

        <a
          href={product.recommended.link}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block text-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black py-2 font-semibold"
        >
          Go to {product.recommended.platform}
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
