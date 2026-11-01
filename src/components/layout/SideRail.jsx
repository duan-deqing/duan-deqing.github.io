/**
 * 列表栏外壳：桌面端左侧固定宽度，头部为标题 + 操作，下面可放筛选/搜索。
 */
export default function SideRail({ title, action, header, children }) {
  return (
    <aside className="hidden shrink-0 border-r border-line bg-sidebar lg:flex lg:w-80 lg:flex-col lg:min-h-0 xl:w-96">
      <div className="border-b border-line px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold tracking-tight text-heading">{title}</span>
          {action}
        </div>
        {header ? <div className="mt-2 flex flex-col gap-2">{header}</div> : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
    </aside>
  )
}
