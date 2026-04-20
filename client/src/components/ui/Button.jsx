function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  full = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:from-amber-400 hover:to-orange-500 hover:shadow-[0_0_20px_rgba(255,165,0,0.35)] active:scale-95",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95",
    danger:
      "bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] active:scale-95",
    warning:
      "bg-amber-600 text-black hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95",
    secondary:
      "bg-[#111827] text-gray-200 border border-[#1f2937] hover:bg-[#0b0f1a] hover:shadow-[0_0_16px_rgba(255,165,0,0.15)] active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
        ${full ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed active:scale-100" : ""}
      `}
    >
      {children}
    </button>
  );
}

export default Button;
