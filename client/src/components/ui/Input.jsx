function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full
          rounded-xl
          bg-[#0b0f1a]
          border border-[#1f2937]
          px-4 py-3
          text-gray-100
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-amber-500
        "
      />
    </div>
  );
}

export default Input;
