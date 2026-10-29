/**
 * Loading placeholder for a PostRow.
 *
 * Rows measure 150px–196px (one or two text lines); the placeholder is pinned
 * to the common single-line height (`min-h-[9.375rem]`) plus the same padding
 * and border, so swapping it for the loaded list does not shift the page (CLS).
 */
export default function PostRowSkeleton() {
  return (
    <div
      aria-hidden
      className="grid min-h-[9.375rem] content-start gap-1 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto] sm:gap-6"
    >
      <span className="h-3 w-16 rounded-[2px] bg-subtle sm:mt-1" />
      <div className="min-w-0 space-y-2">
        <span className="block h-4 w-3/4 rounded-[2px] bg-subtle" />
        <span className="block h-3 w-full rounded-[2px] bg-subtle" />
        <span className="block h-3 w-5/6 rounded-[2px] bg-subtle" />
        <span className="!mt-2.5 block h-[1.4rem] w-24 rounded-[2px] bg-subtle" />
      </div>
    </div>
  )
}
