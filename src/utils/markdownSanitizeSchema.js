import { defaultSchema } from 'rehype-sanitize'

export const markdownSanitizeSchema = {
  ...defaultSchema,
  clobberPrefix: '',
  tagNames: [...new Set([...defaultSchema.tagNames, 'svg', 'path'])],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes['*'] || []), 'className'],
    a: [
      'className',
      ...(defaultSchema.attributes.a || []).filter(
        (entry) => !(Array.isArray(entry) && entry[0] === 'className')
      ),
      'target',
      'rel',
    ],
    svg: ['className', 'viewBox', 'width', 'height', 'ariaHidden', 'focusable'],
    path: ['className', 'd'],
  },
}
