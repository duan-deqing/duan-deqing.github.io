import { useCallback, useEffect, useState } from 'react'

const defaultPickItems = (data) => data.files || data.entries || []
const defaultKeyOf = (item) => item.id

/**
 * 一组 Markdown 文件的本地编辑状态。
 * load 返回 { items }，save 接收 key + { content, revision } 并返回最新集合。
 */
export function useMarkdownFiles({
  load,
  save,
  pickItems = defaultPickItems,
  keyOf = defaultKeyOf,
}) {
  const normalize = useCallback(
    (data) => pickItems(data).map((item) => ({ ...item, key: keyOf(item) })),
    [keyOf, pickItems]
  )
  const [state, setState] = useState({
    loading: true,
    items: [],
    baseline: [],
    dirtyKeys: new Set(),
    savingKey: '',
    error: '',
    notice: '',
  })

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '', notice: '' }))
    try {
      const data = await load()
      const items = normalize(data)
      setState({
        loading: false,
        items,
        baseline: items,
        dirtyKeys: new Set(),
        savingKey: '',
        error: '',
        notice: '',
      })
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err.message }))
    }
  }, [load, normalize])

  useEffect(() => {
    reload()
  }, [reload])

  const update = useCallback((key, content) => {
    setState((prev) => {
      const items = prev.items.map((item) => (item.key === key ? { ...item, content } : item))
      const baseline = prev.baseline.find((item) => item.key === key)
      const dirtyKeys = new Set(prev.dirtyKeys)
      if (baseline && baseline.content === content) dirtyKeys.delete(key)
      else dirtyKeys.add(key)
      return { ...prev, items, dirtyKeys, notice: '', error: '' }
    })
  }, [])

  const discard = useCallback((key) => {
    setState((prev) => {
      const baseline = prev.baseline.find((item) => item.key === key)
      if (!baseline) return prev
      const dirtyKeys = new Set(prev.dirtyKeys)
      dirtyKeys.delete(key)
      return {
        ...prev,
        items: prev.items.map((item) => (item.key === key ? baseline : item)),
        dirtyKeys,
        notice: '已撤销该文件的修改',
        error: '',
      }
    })
  }, [])

  const saveOne = useCallback(
    async (key) => {
      const item = state.items.find((entry) => entry.key === key)
      if (!item || !state.dirtyKeys.has(key)) return false
      setState((prev) => ({ ...prev, savingKey: key, error: '', notice: '' }))
      try {
        const data = await save(key, item)
        const serverItems = normalize(data)
        setState((prev) => {
          // 只清除当前文件；其他文件未保存的编辑继续保留
          const dirtyKeys = new Set(prev.dirtyKeys)
          dirtyKeys.delete(key)
          const items = serverItems.map((serverItem) => {
            if (!dirtyKeys.has(serverItem.key)) return serverItem
            const local = prev.items.find((entry) => entry.key === serverItem.key)
            return local ? { ...serverItem, content: local.content } : serverItem
          })
          return {
            loading: false,
            items,
            baseline: serverItems,
            dirtyKeys,
            savingKey: '',
            error: '',
            notice: '已保存',
          }
        })
        return true
      } catch (err) {
        setState((prev) => ({ ...prev, savingKey: '', error: err.message }))
        return false
      }
    },
    [normalize, save, state.dirtyKeys, state.items]
  )

  return {
    ...state,
    dirty: state.dirtyKeys.size > 0,
    dirtyCount: state.dirtyKeys.size,
    reload,
    update,
    saveOne,
    discard,
  }
}
