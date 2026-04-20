function ImagePreview({ src }) {
  if (!src) return null;

  return (
    <div className="mt-3">
      <img
        src={src}
        alt="Preview"
        className="h-32 w-32 object-cover rounded-lg border"
      />
    </div>
  );
}

export default ImagePreview;
