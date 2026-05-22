export default function PageBackground({ variant = 'single', images = [], overlay = 'content' }) {
  if (variant === 'collage' && images.length) {
    return (
      <div className="page-bg page-bg--collage" aria-hidden="true">
        {images.map((src, index) => (
          <div
            key={src}
            className={`page-bg-panel page-bg-panel--${index + 1}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className={`page-bg-overlay page-bg-overlay--${overlay}`} />
      </div>
    );
  }

  if (!images.length) return null;

  return (
    <div
      className="page-bg page-bg--single"
      style={{ backgroundImage: `url(${images[0]})` }}
      aria-hidden="true"
    >
      <div className={`page-bg-overlay page-bg-overlay--${overlay}`} />
    </div>
  );
}
