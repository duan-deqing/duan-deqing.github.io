import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const SEPARATOR = '\u001f'
const MARKER = '\u001e'
const MAX_FILE_LIST = 12

function parseLog(stdout) {
  const commits = []
  let current = null

  for (const rawLine of stdout.split(/\r?\n/)) {
    if (rawLine.startsWith(MARKER)) {
      const [hash, date, author, subject] = rawLine.slice(MARKER.length).split(SEPARATOR)
      current = {
        hash,
        short: hash.slice(0, 7),
        date,
        author,
        subject,
        fileCount: 0,
        files: [],
      }
      commits.push(current)
      continue
    }
    if (!current || !rawLine.trim()) continue
    current.fileCount += 1
    if (current.files.length < MAX_FILE_LIST) current.files.push(rawLine.trim())
  }

  return commits
}

/**
 * 只读 git 元数据，供本地后台 Dashboard 使用。
 * 固定参数、无用户输入拼接；仓库不可用时返回 available:false，由前端如实降级。
 */
export function createGitStore(root) {
  async function readLog(limit = 20) {
    const count = Math.min(Math.max(Number(limit) || 20, 1), 50)
    try {
      const [log, branch, total] = await Promise.all([
        execFileAsync(
          'git',
          [
            'log',
            `-n${count}`,
            '--name-only',
            `--pretty=format:${MARKER}%H${SEPARATOR}%aI${SEPARATOR}%an${SEPARATOR}%s`,
          ],
          { cwd: root, maxBuffer: 4 * 1024 * 1024 }
        ),
        execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root }),
        execFileAsync('git', ['rev-list', '--count', 'HEAD'], { cwd: root }),
      ])

      return {
        available: true,
        branch: branch.stdout.trim(),
        total: Number(total.stdout.trim()) || 0,
        commits: parseLog(log.stdout),
      }
    } catch (err) {
      return {
        available: false,
        reason: err?.code === 'ENOENT' ? '未找到 git 命令' : '当前目录无法读取 git 日志',
        branch: '',
        total: 0,
        commits: [],
      }
    }
  }

  return { readLog }
}
