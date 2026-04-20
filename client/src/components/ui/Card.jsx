function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-[#0b0f1a]
        border border-[#1f2937]
        rounded-2xl
        p-6
        shadow-[0_0_20px_rgba(255,165,0,0.05)]
        hover:shadow-[0_0_30px_rgba(255,165,0,0.15)]
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
