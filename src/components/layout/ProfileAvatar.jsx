import { cn } from '../../utils/cn'

/**
 * 前台子页面侧栏与后台侧栏共用的「头像 + 名称」展示。
 * 只负责展示，不加交互，外层用 Link / button 包裹。
 */
export default function ProfileAvatar({ avatar, name, role, className = '' }) {
  const hasImage =
    typeof avatar === 'string' && (avatar.startsWith('/') || avatar.startsWith('http'))
  const initial = typeof avatar === 'string' && avatar ? avatar.slice(0, 1) : name?.slice(0, 1) || '?'

  return (
    <>
      {hasImage ? (
        <img
          src={avatar}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn('size-10 shrink-0 rounded-full border border-line object-cover', className)}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-full border border-line bg-page text-lg font-medium text-heading',
            className
          )}
        >
          {initial}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="profile-name truncate font-semibold tracking-tight text-heading">
          {name}
        </span>
        {role ? <span className="profile-role truncate text-muted-strong">{role}</span> : null}
      </span>
    </>
  )
}
