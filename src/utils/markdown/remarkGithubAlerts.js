import { remarkAlert } from 'remark-github-blockquote-alert'

function titleCaseTitles(node) {
  if (
    node.type === 'paragraph' &&
    node.data?.hProperties?.className === 'markdown-alert-title'
  ) {
    for (const child of node.children) {
      if (child.type === 'text' && /^[A-Z]+$/.test(child.value)) {
        child.value = child.value.charAt(0) + child.value.slice(1).toLowerCase()
      }
    }
  }

  if (node.children) {
    for (const child of node.children) titleCaseTitles(child)
  }
}

export function remarkGithubAlerts() {
  const applyAlerts = remarkAlert()

  return (tree, file) => {
    applyAlerts(tree, file)
    titleCaseTitles(tree)
  }
}
