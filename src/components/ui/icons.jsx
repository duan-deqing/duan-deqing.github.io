function LineIcon({ children, size = 16, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

function FillIcon({ children, size = 16, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

export const ChevronDownIcon = (props) => (
  <LineIcon {...props}>
    <path d="m6 9 6 6 6-6" />
  </LineIcon>
)

export const LinkIcon = (props) => (
  <LineIcon {...props}>
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
    <path d="M8 12h8" />
  </LineIcon>
)

export const PlumBranchIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4 20c3.1-2.3 5.3-5.4 6.6-9 1-2.9 3.1-5.3 6.8-6.6" />
    <path d="M10.6 11C8.9 9.9 7.1 9.4 5.1 9.5" />
    <path d="M12.7 7.2c1.3-1.1 2.9-1.7 4.6-1.8" />
    <circle cx="4.3" cy="9.1" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="18.6" cy="3.1" r="0.9" fill="currentColor" stroke="none" />
  </LineIcon>
)

export const DotsIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="5.5" cy="5.5" r="1.2" fill="currentColor" stroke="none" opacity="0.65" />
    <circle cx="12" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="18.5" cy="5.5" r="1.3" fill="currentColor" stroke="none" opacity="0.45" />
    <circle cx="5.5" cy="12" r="0.9" fill="currentColor" stroke="none" opacity="0.45" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" opacity="0.8" />
    <circle cx="18.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="5.5" cy="18.5" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" opacity="0.55" />
    <circle cx="18.5" cy="18.5" r="0.9" fill="currentColor" stroke="none" opacity="0.8" />
  </LineIcon>
)

export const GridIcon = (props) => (
  <LineIcon {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
  </LineIcon>
)

export const WavesIcon = (props) => (
  <LineIcon {...props}>
    <path d="M3 7c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
    <path d="M3 12c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
    <path d="M3 17c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
  </LineIcon>
)

export const AuroraIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4 20c3-6.4 4.4-11.7 9.8-15.6" />
    <path d="M9.2 20c2.9-5.8 4.1-9.9 10.2-13.4" />
    <path d="M14.4 20c1.8-3.4 2.5-5.7 6.4-7.8" />
  </LineIcon>
)

export const BackgroundOffIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m6 6 12 12" />
  </LineIcon>
)

export const CheckIcon = (props) => (
  <LineIcon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </LineIcon>
)

export const SaveIcon = (props) => (
  <LineIcon {...props}>
    <path d="M5 3h11l3 3v15H5z" />
    <path d="M8 3v6h8V3" />
    <path d="M8 21v-7h8v7" />
  </LineIcon>
)

export const EyeIcon = (props) => (
  <LineIcon {...props}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </LineIcon>
)

export const CopyIcon = (props) => (
  <LineIcon {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </LineIcon>
)

export const HistoryIcon = (props) => (
  <LineIcon {...props}>
    <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </LineIcon>
)

export const GitHubIcon = (props) => (
  <FillIcon {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </FillIcon>
)

export const RssIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" />
  </LineIcon>
)

export const RadioIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </LineIcon>
)

export const MenuIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </LineIcon>
)

export const CloseIcon = (props) => (
  <LineIcon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </LineIcon>
)

export const SunIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </LineIcon>
)

export const MoonIcon = (props) => (
  <LineIcon {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </LineIcon>
)

export const GlobeIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </LineIcon>
)

export const SearchIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </LineIcon>
)

export const ArrowUpRightIcon = (props) => (
  <LineIcon {...props}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </LineIcon>
)

export const ArrowLeftIcon = (props) => (
  <LineIcon {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </LineIcon>
)

export const ArrowRightIcon = (props) => (
  <LineIcon {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </LineIcon>
)
