function VoucherCard({ voucher, onApply, showApply = true }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1f2937] bg-[#0b0f1a] p-4">
      <div>
        <p className="text-lg font-semibold text-gray-100">{voucher.code}</p>

        <p className="text-sm text-gray-400">
          ₹{voucher.discountValue} OFF · Valid till {voucher.expiry}
        </p>

        {voucher.verified && (
          <span className="text-xs text-emerald-400 font-semibold">
            ✔ Verified
          </span>
        )}
      </div>

      {showApply && (
        <button
          onClick={() => onApply(voucher)}
          className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-black"
        >
          Apply
        </button>
      )}
    </div>
  );
}

export default VoucherCard;
