import { HOME_SIGNATURE_PATH, HOME_SIGNATURE_VIEWBOX } from './homeSignaturePath'

export default function HomeSignature() {
  return (
    <svg
      viewBox={HOME_SIGNATURE_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className="home-signature h-9 w-auto"
    >
      <path d={HOME_SIGNATURE_PATH} fill="currentColor" fillRule="nonzero" />
    </svg>
  )
}
