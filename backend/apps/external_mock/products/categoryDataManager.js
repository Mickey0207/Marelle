// Minimal category dataset and helpers for filters/cascader

export const PRODUCT_CATEGORIES = [
  {
    id: 'c-f', name: '女裝', children: [
      { id: 'c-f-d', name: '洋裝', children: [{ id: 'c-f-w-1', name: '連衣裙' }] },
      { id: 'c-f-t', name: '上衣' },
    ]
  },
  {
    id: 'c-m', name: '男裝', children: [
      { id: 'c-m-t', name: '外套', children: [{ id: 'c-m-t-1', name: '西裝外套' }] },
    ]
  },
  { id: 'c-u', name: '通用', children: [ { id: 'c-u-b-1', name: '褲裝' } ] },
]

export function getAllChildCategoryIds(tree, targetId) {
  const ids = []
  function dfs(nodes, includeSelf = false) {
    for (const n of nodes || []) {
      if (includeSelf) ids.push(n.id)
      if (n.children) dfs(n.children, true)
    }
  }
  function find(nodes) {
    for (const n of nodes || []) {
      if (n.id === targetId) { dfs(n.children || [], true); return true }
      if (n.children && find(n.children)) return true
    }
    return false
  }
  find(Array.isArray(tree) ? tree : [])
  return ids
}

export function getCategoryBreadcrumb(tree, id) {
  const path = []
  function dfs(nodes, trail) {
    for (const n of nodes || []) {
      const next = [...trail, n]
      if (n.id === id) { path.push(...next); return true }
      if (n.children && dfs(n.children, next)) return true
    }
    return false
  }
  dfs(Array.isArray(tree) ? tree : [], [])
  return path.map(n => n.name).join(' / ')
}

// Deep filter a category tree by name; keep parents if any descendant matches
export function searchCategories(tree, term) {
  const kw = String(term || '').trim().toLowerCase()
  if (!kw) return Array.isArray(tree) ? tree : []
  function filterNode(node) {
    const selfHit = String(node.name || '').toLowerCase().includes(kw)
    const children = (node.children || []).map(filterNode).filter(Boolean)
    if (selfHit || children.length) {
      return { ...node, children }
    }
    return null
  }
  return (Array.isArray(tree) ? tree : []).map(filterNode).filter(Boolean)
}

export const CategoryTreeUtils = {
  hasSelectedChildren(category, selected) {
    const set = new Set(selected || [])
    let found = false
    ;(function dfs(n){
      for (const c of n.children || []) {
        if (set.has(c.id)) { found = true; return }
        dfs(c)
        if (found) return
      }
    })(category)
    return found
  },
  allChildrenSelected(category, selected) {
    const set = new Set(selected || [])
    let all = true
    ;(function dfs(n){
      for (const c of n.children || []) {
        if (!set.has(c.id)) all = false
        dfs(c)
      }
    })(category)
    return all && (category.children || []).length > 0
  },
  collectAllIds(tree) {
    const ids = []
    ;(function dfs(nodes){
      for (const n of nodes || []) {
        ids.push(n.id)
        if (n.children) dfs(n.children)
      }
    })(Array.isArray(tree) ? tree : [])
    return ids
  }
}

// Explicit named exports aggregator (helps some bundlers' static analysis)
// (named exports are already defined above)
