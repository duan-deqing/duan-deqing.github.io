import { HOME_SIGNATURE_PATH } from './homeSignaturePath'

export default function HomeSignature() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="home-signature h-12 w-12"
    >
      <path
        className="home-signature-path"
        d={HOME_SIGNATURE_PATH}
        pathLength="350"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
