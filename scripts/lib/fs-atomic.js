import fs from 'node:fs'

export function writeFileAtomic(file, content) {
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, file)
}
