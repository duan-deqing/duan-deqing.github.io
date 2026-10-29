export default function WritingRowSkeleton({ rows = 6 }) {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col gap-1 motion-reduce:animate-none">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex min-h-[69px] flex-col gap-2 rounded-lg p-2">
          <span className="h-4 w-3/4 rounded bg-subtle" />
          <span className="h-3.5 w-40 rounded bg-subtle" />
        </div>
      ))}
    </div>
  )
}
