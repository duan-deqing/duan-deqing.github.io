import { HOME_SIGNATURE_PATH, HOME_SIGNATURE_VIEWBOX } from './homeSignaturePath'

export default function HomeSignature() {
  return (
    <svg
      viewBox={HOME_SIGNATURE_VIEWBOX}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="home-signature h-7 w-auto"
    >
      <path
        d={HOME_SIGNATURE_PATH}
        pathLength="350"
        stroke="currentColor"
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="home-signature-path"
      />
    </svg>
  )
}
