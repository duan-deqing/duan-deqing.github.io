export function getIn(obj, path) {
  return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

export function setIn(obj, path, value) {
  if (path.length === 0) return value
  const [head, ...rest] = path
  const base = obj && typeof obj === 'object' ? obj : {}
  return { ...base, [head]: setIn(base[head], rest, value) }
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}
