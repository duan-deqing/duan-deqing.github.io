import YAML from 'yaml'

export default function yamlPlugin() {
  return {
    name: 'stylan-yaml',
    enforce: 'pre',
    transform(code, id) {
      const clean = id.split('?')[0]
      if (!clean.endsWith('.yaml') && !clean.endsWith('.yml')) return null
      try {
        const data = YAML.parse(code)
        return { code: `export default ${JSON.stringify(data)}`, map: null }
      } catch (err) {
        const message = `YAML 解析失败: ${clean}\n${err.message}`
        if (typeof this?.error === 'function') this.error(message)
        throw new Error(message)
      }
    },
  }
}
