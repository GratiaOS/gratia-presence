type GratiaMarkProps = {
  /** @deprecated The mark now uses a single canonical SVG. */
  variant?: 'color' | 'outline';
  size?: number;
  className?: string;
  motion?: 'suave';
};

/**
 * Lightweight Mark component so we reuse the same flower everywhere (header, Codex, Vortex, Vienna).
 */
export function GratiaMark({ variant: _variant = 'color', size, className, motion }: GratiaMarkProps) {
  const motionClass = motion === 'suave' ? 'mark-motion-suave' : '';
  const sizedStyle = size ? { width: size, height: size } : className ? undefined : { width: 32, height: 32 };

  return (
    <span
      role="img"
      aria-label="Gratia mark"
      className={['inline-block bg-current align-middle', className, motionClass].filter(Boolean).join(' ')}
      style={{
        ...sizedStyle,
        aspectRatio: '203.725 / 230.345',
        WebkitMask: "url('/mark/gratia-mark.svg') center / contain no-repeat",
        mask: "url('/mark/gratia-mark.svg') center / contain no-repeat",
      }}
    />
  );
}

export default GratiaMark;
