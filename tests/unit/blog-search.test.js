import test from 'node:test'
import assert from 'node:assert/strict'
import { searchPosts } from '../../src/utils/blogSearch.js'

const posts = [
  {
    slug: 'react',
    title: { en: 'React Hooks', zh: 'React 钩子' },
    excerpt: { en: 'A guide to hooks', zh: '钩子指南' },
    tags: ['React', 'Hooks'],
    category: 'tutorial',
  },
  {
    slug: 'vim',
    title: { en: 'Vim Basics', zh: 'Vim 基础' },
    excerpt: { en: 'Modal editing', zh: '模态编辑' },
    tags: ['Vim'],
    category: 'tutorial',
  },
]

const t = (value) => (value && typeof value === 'object' && 'en' in value ? value.en : value)

test('empty query returns all posts', () => {
  assert.equal(searchPosts(posts, '', t).length, 2)
})

test('matches title, excerpt, tag and category', () => {
  assert.deepEqual(searchPosts(posts, 'hooks', t).map((post) => post.slug), ['react'])
  assert.deepEqual(searchPosts(posts, 'docs', t).map((post) => post.slug), [])
  assert.deepEqual(searchPosts(posts, 'modal', t).map((post) => post.slug), ['vim'])
  assert.deepEqual(searchPosts(posts, 'vim', t).map((post) => post.slug), ['vim'])
  assert.deepEqual(searchPosts(posts, 'tutorial', t).map((post) => post.slug), ['react', 'vim'])
})
