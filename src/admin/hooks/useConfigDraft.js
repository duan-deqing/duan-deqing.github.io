import { useCallback, useEffect, useReducer } from 'react'
import { adminApi } from '../api.js'
import { contentSchema } from '../schema.js'
import { getIn, setIn } from '../lib/objectPath.js'
import { deepEqual } from '../lib/deepEqual.js'
import { validateDoc } from '../lib/validate.js'

const initialState = {
  status: 'loading',
  documents: null,
  baseline: null,
  revision: null,
  dirtyPaths: new Set(),
  saving: false,
  error: '',
  notice: '',
  conflict: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STARTED':
      return { ...state, status: 'loading', error: '' }
    case 'LOADED':
      return {
        ...state,
        status: 'ready',
        documents: action.documents,
        baseline: action.documents,
        revision: action.revision,
        dirtyPaths: new Set(),
        error: '',
        notice: '',
        conflict: null,
      }
    case 'LOAD_FAILED':
      return { ...state, status: 'error', error: action.error }
    case 'FIELD_CHANGED': {
      const current = getIn(state.documents[action.docId], action.path)
      if (deepEqual(current, action.value)) return state
      const baseValue = getIn(state.baseline[action.docId], action.path)
      const dirtyPaths = new Set(state.dirtyPaths)
      if (deepEqual(action.value, baseValue)) dirtyPaths.delete(action.key)
      else dirtyPaths.add(action.key)
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.docId]: setIn(state.documents[action.docId], action.path, action.value),
        },
        dirtyPaths,
        notice: '',
      }
    }
    case 'DISCARD':
      return {
        ...state,
        documents: state.baseline,
        dirtyPaths: new Set(),
        notice: '已撤销未保存修改',
        error: '',
        conflict: null,
      }
    case 'SAVE_STARTED':
      return { ...state, saving: true, error: '', notice: '' }
    case 'SAVE_SUCCEEDED':
      return {
        ...state,
        documents: action.documents,
        baseline: action.documents,
        revision: action.revision,
        dirtyPaths: new Set(),
        saving: false,
        error: '',
        notice: '已保存',
        conflict: null,
      }
    case 'SAVE_FAILED':
      return { ...state, saving: false, error: action.error, notice: '' }
    case 'CONFLICT':
      return {
        ...state,
        saving: false,
        conflict: action.conflict,
        error: '',
      }
    case 'APPLY_SERVER':
      return {
        ...state,
        documents: action.documents,
        baseline: action.documents,
        revision: action.revision,
        dirtyPaths: new Set(),
        conflict: null,
        notice: '已加载磁盘版本',
        error: '',
      }
    case 'CLEAR_CONFLICT':
      return { ...state, conflict: null }
    case 'SET_NOTICE':
      return { ...state, notice: action.notice }
    default:
      return state
  }
}

export function useConfigDraft() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_STARTED' })
    try {
      const data = await adminApi.getConfig()
      dispatch({ type: 'LOADED', documents: data.documents, revision: data.revision })
    } catch (err) {
      dispatch({ type: 'LOAD_FAILED', error: err.message })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const update = useCallback((docId, path, value) => {
    dispatch({
      type: 'FIELD_CHANGED',
      docId,
      path,
      value,
      key: `${docId}:${path.join('.')}`,
    })
  }, [])

  const save = useCallback(
    async (overrideRevision) => {
      const errors = validateDoc(contentSchema, state.documents)
      if (errors.length) {
        dispatch({ type: 'SAVE_FAILED', error: errors[0] })
        return false
      }
      dispatch({ type: 'SAVE_STARTED' })
      try {
        const result = await adminApi.saveConfig(
          state.documents,
          overrideRevision ?? state.revision
        )
        dispatch({
          type: 'SAVE_SUCCEEDED',
          documents: result.documents,
          revision: result.revision,
        })
        return true
      } catch (err) {
        if (err.code === 'REVISION_CONFLICT') {
          dispatch({
            type: 'CONFLICT',
            conflict: {
              message: err.message,
              current: err.payload.current,
              revision: err.payload.revision,
            },
          })
        } else {
          dispatch({ type: 'SAVE_FAILED', error: err.message })
        }
        return false
      }
    },
    [state.documents, state.revision]
  )

  const discard = useCallback(() => dispatch({ type: 'DISCARD' }), [])

  const resolveConflict = useCallback(
    async (mode) => {
      if (!state.conflict) return
      if (mode === 'server') {
        dispatch({
          type: 'APPLY_SERVER',
          documents: state.conflict.current.documents,
          revision: state.conflict.current.revision,
        })
        return
      }
      if (mode === 'local') {
        await save(state.conflict.revision)
        return
      }
      dispatch({ type: 'CLEAR_CONFLICT' })
    },
    [state.conflict, save]
  )

  return {
    ...state,
    dirty: state.dirtyPaths.size > 0,
    dirtyCount: state.dirtyPaths.size,
    load,
    update,
    save,
    discard,
    resolveConflict,
  }
}
