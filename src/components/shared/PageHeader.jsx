export default function PageHeader({ kicker, title, description, actions }) {
  return (
    <section className="border-b border-line py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {kicker ? (
            <p className="mb-3 font-mono-ui text-[11px] uppercase tracking-[0.12em] text-accent">
              {kicker}
            </p>
          ) : null}
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-[15px] leading-[1.75] text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  )
}
