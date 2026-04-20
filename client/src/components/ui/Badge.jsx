function Badge({ text, type = "default" }) {
  const styles = {
    default: "bg-[#111827] text-gray-300 border border-[#1f2937]",
    info: "bg-blue-900/40 text-blue-300 border border-blue-700/40",
    success: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40",
    warning: "bg-amber-900/40 text-amber-300 border border-amber-700/40",
    danger: "bg-red-900/40 text-red-300 border border-red-700/40",
  };

  return (
    <span
      className={`
        inline-flex items-center
        text-xs font-semibold
        px-3 py-1 rounded-full
        ${styles[type]}
      `}
    >
      {text}
    </span>
  );
}

export default Badge;
