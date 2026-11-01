export default function CenteredPageHeading({ title, description, actions }) {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-4xl font-extrabold leading-[1.11] tracking-tight text-heading">
        {title}
      </h1>
      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-base italic leading-[1.75] text-muted md:text-lg">
          {description}
        </p>
      ) : null}
      {actions ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      ) : null}
      <hr className="mx-auto mt-8 w-[50px] border-line" />
    </header>
  )
}
