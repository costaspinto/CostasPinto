export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return <div className="mb-8 max-w-2xl">
    <p className={`mb-3 text-xs font-bold uppercase tracking-[.22em] ${inverted ? 'text-emerald-200' : 'text-forest'}`}>{eyebrow}</p>
    <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${inverted ? 'text-white' : 'text-ink'}`}>{title}</h2>
    {description && <p className={`mt-3 leading-7 ${inverted ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>}
  </div>;
}
