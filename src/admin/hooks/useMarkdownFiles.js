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

  const applySaved = useCallback((serverItems, key) => {
    setState((prev) => {
      // 只清除已保存的键；保存过程中又产生的新编辑继续保留
      const serverForKey = serverItems.find((item) => item.key === key)
      const localForKey = prev.items.find((item) => item.key === key)
      const dirtyKeys = new Set(prev.dirtyKeys)
      if (localForKey && serverForKey && localForKey.content !== serverForKey.content) {
        dirtyKeys.add(key)
      } else {
        dirtyKeys.delete(key)
      }
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
  }, [])

  const saveOne = useCallback(
    async (key) => {
      const item = state.items.find((entry) => entry.key === key)
      if (!item || !state.dirtyKeys.has(key)) return false
      setState((prev) => ({ ...prev, savingKey: key, error: '', notice: '' }))
      try {
        const data = await save(key, item)
        applySaved(normalize(data), key)
        return true
      } catch (err) {
        setState((prev) => ({ ...prev, savingKey: '', error: err.message }))
        return false
      }
    },
    [applySaved, normalize, save, state.dirtyKeys, state.items]
  )

  /**
   * 串行保存多个文件；单个失败不会影响后续文件，返回成功/失败明细。
   */
  const saveMany = useCallback(
    async (keys) => {
      const pending = keys.filter((key) => state.dirtyKeys.has(key))
      const saved = []
      const failed = []
      for (const key of pending) {
        const item = state.items.find((entry) => entry.key === key)
        if (!item) continue
        setState((prev) => ({ ...prev, savingKey: key, error: '', notice: '' }))
        try {
          const data = await save(key, item)
          applySaved(normalize(data), key)
          saved.push(key)
        } catch (err) {
          setState((prev) => ({ ...prev, savingKey: '', error: err.message }))
          failed.push({ key, error: err.message })
        }
      }
      return { saved, failed }
    },
    [applySaved, normalize, save, state.dirtyKeys, state.items]
  )

  return {
    ...state,
    dirty: state.dirtyKeys.size > 0,
    dirtyCount: state.dirtyKeys.size,
    reload,
    update,
    saveOne,
    saveMany,
    discard,
  }
}
