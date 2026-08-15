interface LogoProps {
  src?: string;
  alt?: string;
  /** Tailwind size class untuk kotak fallback. Ukuran tinggi img menyesuaikan. */
  sizeClass?: string;
  className?: string;
}

/**
 * Logo brand. Jika tenant menyediakan `logo`, tampilkan gambar tersebut;
 * jika tidak, fallback ke logo platform (`/logo.png`). Tidak ada teks nama.
 */
export function Logo({ src, alt = 'WashCut', sizeClass = 'h-9 w-9', className = '' }: LogoProps) {
  return (
    <img
      src={src || '/logo.png'}
      alt={alt}
      className={`object-contain ${sizeClass} ${className}`}
      aria-hidden={!src}
    />
  );
}