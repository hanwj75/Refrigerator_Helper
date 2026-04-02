type HeroSectionProps = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  benefits: string[];
};

export function HeroSection({
  badge,
  title,
  highlight,
  description,
  benefits,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 px-6 py-10 shadow-[0_20px_60px_rgba(73,98,56,0.12)] backdrop-blur sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="inline-flex rounded-full border border-brand-200 bg-brand-50/90 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-brand-700 sm:text-sm">
          {badge}
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl lg:text-7xl">
          {title} <span className="text-brand-700">{highlight}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-center text-sm font-medium leading-none text-white"
            >
              <span className="mt-px h-2 w-2 shrink-0 rounded-full bg-brand-300" />
              <span className="whitespace-nowrap">{benefit}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
