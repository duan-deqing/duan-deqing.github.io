import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getVideoEmbed,
  parseCarouselBlock,
  parseVideoBlock,
} from '../../src/utils/articleEmbeds.js'

test('parseVideoBlock 读取 key-value 与裸 URL', () => {
  assert.deepEqual(parseVideoBlock('url: https://youtu.be/abc\ntitle: "示例视频"'), {
    url: 'https://youtu.be/abc',
    title: '示例视频',
    caption: '',
  })
  assert.deepEqual(parseVideoBlock('https://example.com/a.mp4'), {
    url: 'https://example.com/a.mp4',
    title: '',
    caption: '',
  })
})

test('getVideoEmbed 识别 YouTube / Vimeo / Bilibili / 直链', () => {
  assert.deepEqual(getVideoEmbed('https://www.youtube.com/watch?v=abc123'), {
    type: 'iframe',
    src: 'https://www.youtube-nocookie.com/embed/abc123?autoplay=0',
  })
  assert.deepEqual(getVideoEmbed('https://youtu.be/abc123'), {
    type: 'iframe',
    src: 'https://www.youtube-nocookie.com/embed/abc123?autoplay=0',
  })
  assert.deepEqual(getVideoEmbed('https://vimeo.com/123456'), {
    type: 'iframe',
    src: 'https://player.vimeo.com/video/123456?autoplay=0',
  })
  assert.deepEqual(getVideoEmbed('https://www.bilibili.com/video/BV1xx411c7mD'), {
    type: 'iframe',
    src: 'https://player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1&autoplay=0',
  })
  assert.deepEqual(getVideoEmbed('https://cdn.test/video.mp4'), {
    type: 'video',
    src: 'https://cdn.test/video.mp4',
  })
})

test('getVideoEmbed 未知地址回退为链接', () => {
  assert.deepEqual(getVideoEmbed('https://example.com/watch'), {
    type: 'link',
    src: 'https://example.com/watch',
  })
  assert.equal(getVideoEmbed(''), null)
})

test('parseCarouselBlock 读取 Markdown 图片与 caption', () => {
  assert.deepEqual(
    parseCarouselBlock(
      [
        '![第一张](/images/a.jpg "说明一")',
        '![第二张](/images/b.jpg)',
        '忽略这一行',
      ].join('\n')
    ),
    [
      { src: '/images/a.jpg', alt: '第一张', caption: '说明一' },
      { src: '/images/b.jpg', alt: '第二张', caption: '' },
    ]
  )
})
