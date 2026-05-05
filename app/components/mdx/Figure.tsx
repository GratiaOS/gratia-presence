import Image from 'next/image';
export default function Figure({
  src,
  alt,
  caption,
  width = 1400,
  height = 900,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-8">
      <Image src={src} alt={alt} width={width} height={height} className="rounded-2xl" />
      {caption && <figcaption className="text-muted mt-3">{caption}</figcaption>}
    </figure>
  );
}
