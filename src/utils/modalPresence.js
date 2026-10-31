export const MODAL_EXIT_MS = 240

export function presenceReducer(state, action) {
  switch (action.type) {
    case 'open':
      return state === 'open' ? state : 'entering'
    case 'shown':
      return state === 'entering' ? 'open' : state
    case 'close':
      return state === 'closed' ? state : 'exiting'
    case 'closed':
      return state === 'exiting' ? 'closed' : state
    default:
      return state
  }
}

export function isMounted(state) {
  return state !== 'closed'
}

export function isVisible(state) {
  return state === 'open'
}

export function isExiting(state) {
  return state === 'exiting'
}
