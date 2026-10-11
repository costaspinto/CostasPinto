export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand-mark${inverse ? ' brand-mark--inverse' : ''}`} aria-label="Costas Pinto">
      <span>CP</span>
      <span className="brand-mark__pixel" aria-hidden="true" />
    </span>
  );
}
