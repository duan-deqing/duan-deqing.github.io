export default function WritingRowSkeleton({ rows = 6 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-t border-line py-4">
          <span className="hidden h-4 w-12 rounded bg-subtle md:block" />
          <span className="hidden h-4 w-20 rounded bg-subtle md:block" />
          <span className="h-4 flex-1 rounded bg-subtle" />
          <span className="hidden h-4 w-16 rounded bg-subtle md:block" />
        </div>
      ))}
    </div>
  )
}
