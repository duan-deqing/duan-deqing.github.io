import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getProjectInitial,
  resolveBookmarkCategoryIcon,
  resolveButtonIcon,
  resolveProjectIcon,
  resolveStackIcon,
} from '../../src/utils/projectIcon.js'

test('resolveProjectIcon 支持文件名、路径与图标链接', () => {
  assert.equal(resolveProjectIcon('orbit-desk.svg'), '/images/projects/orbit-desk.svg')
  assert.equal(resolveProjectIcon('./icons/a.svg'), '/images/projects/icons/a.svg')
  assert.equal(resolveProjectIcon('images/projects/a.svg'), '/images/projects/a.svg')
  assert.equal(resolveProjectIcon('/images/projects/a.svg'), '/images/projects/a.svg')
  assert.equal(resolveProjectIcon('https://example.com/icon.svg'), 'https://example.com/icon.svg')
  assert.equal(resolveProjectIcon(''), null)
  assert.equal(resolveProjectIcon(null), null)
})

test('resolveBookmarkCategoryIcon 使用书签分类图标目录', () => {
  assert.equal(
    resolveBookmarkCategoryIcon('frontend.svg'),
    '/images/bookmark-categories/frontend.svg'
  )
  assert.equal(
    resolveBookmarkCategoryIcon('./icons/a.svg'),
    '/images/bookmark-categories/icons/a.svg'
  )
  assert.equal(
    resolveBookmarkCategoryIcon('images/bookmark-categories/a.svg'),
    '/images/bookmark-categories/a.svg'
  )
  assert.equal(
    resolveBookmarkCategoryIcon('/images/bookmark-categories/a.svg'),
    '/images/bookmark-categories/a.svg'
  )
  assert.equal(
    resolveBookmarkCategoryIcon('https://example.com/icon.svg'),
    'https://example.com/icon.svg'
  )
  assert.equal(resolveBookmarkCategoryIcon(''), null)
  assert.equal(resolveBookmarkCategoryIcon(null), null)
})

test('resolveButtonIcon 使用按钮图标目录', () => {
  assert.equal(resolveButtonIcon('github.svg'), '/images/buttons/github.svg')
  assert.equal(resolveButtonIcon('./icons/a.svg'), '/images/buttons/icons/a.svg')
  assert.equal(resolveButtonIcon('images/buttons/a.svg'), '/images/buttons/a.svg')
  assert.equal(resolveButtonIcon('/images/buttons/a.svg'), '/images/buttons/a.svg')
  assert.equal(resolveButtonIcon('https://example.com/icon.svg'), 'https://example.com/icon.svg')
  assert.equal(resolveButtonIcon(''), null)
  assert.equal(resolveButtonIcon(null), null)
})

test('resolveStackIcon 使用技术栈图标目录', () => {
  assert.equal(resolveStackIcon('react.svg'), '/images/stack/react.svg')
  assert.equal(resolveStackIcon('./icons/react.svg'), '/images/stack/icons/react.svg')
  assert.equal(resolveStackIcon('images/stack/react.svg'), '/images/stack/react.svg')
  assert.equal(resolveStackIcon('/images/stack/react.svg'), '/images/stack/react.svg')
  assert.equal(resolveStackIcon('https://example.com/react.svg'), 'https://example.com/react.svg')
  assert.equal(resolveStackIcon(''), null)
})

test('getProjectInitial 使用英文标题首字母', () => {
  assert.equal(getProjectInitial({ en: 'Orbit Desk', zh: '轨道工作台' }), 'O')
  assert.equal(getProjectInitial('weijian'), 'W')
  assert.equal(getProjectInitial({ zh: '微笺' }), '微')
  assert.equal(getProjectInitial(''), '?')
})
