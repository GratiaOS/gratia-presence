import Image from 'next/image';
export default function Gallery({ images, cols = 3 }: { images: string[]; cols?: 2 | 3 | 4 }) {
  return (
    <div className={`mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-${cols}`}>
      {images.map((src, i) => (
        <Image key={i} src={src} alt="" width={1200} height={800} className="rounded-xl" />
      ))}
    </div>
  );
}
