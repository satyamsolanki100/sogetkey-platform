function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-extrabold text-gray-100">{title}</h1>

      {subtitle && <p className="mt-2 text-sm text-gray-400">{subtitle}</p>}

      <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-amber-500 to-orange-600" />
    </div>
  );
}

export default PageHeader;
