type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div className="mb-9 max-w-3xl">
      <p className={`mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.24em] ${inverted ? 'text-emerald-200' : 'text-forest'}`}>
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${inverted ? 'bg-emerald-300' : 'bg-emerald-600'}`} />
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-bold tracking-[-.04em] sm:text-4xl lg:text-[2.65rem] ${inverted ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8 ${inverted ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
