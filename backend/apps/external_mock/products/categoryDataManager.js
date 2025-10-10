// Minimal category dataset and helpers for filters/cascader

export const PRODUCT_CATEGORIES = [
  {
    id: 'c-f', slug: 'c-f', name: '女裝', image: 'https://picsum.photos/seed/c-f/200/200', children: [
      { id: 'c-f-d', slug: 'c-f-d', name: '洋裝', image: 'https://picsum.photos/seed/c-f-d/200/200', children: [{ id: 'c-f-w-1', slug: 'c-f-w-1', name: '連衣裙', image: 'https://picsum.photos/seed/c-f-w-1/200/200' }] },
      { id: 'c-f-t', slug: 'c-f-t', name: '上衣', image: 'https://picsum.photos/seed/c-f-t/200/200' },
    ]
  },
  {
    id: 'c-m', slug: 'c-m', name: '男裝', image: 'https://picsum.photos/seed/c-m/200/200', children: [
      { id: 'c-m-t', slug: 'c-m-t', name: '外套', image: 'https://picsum.photos/seed/c-m-t/200/200', children: [{ id: 'c-m-t-1', slug: 'c-m-t-1', name: '西裝外套', image: 'https://picsum.photos/seed/c-m-t-1/200/200' }] },
    ]
  },
  { id: 'c-u', slug: 'c-u', name: '通用', image: 'https://picsum.photos/seed/c-u/200/200', children: [ { id: 'c-u-b-1', slug: 'c-u-b-1', name: '褲裝', image: 'https://picsum.photos/seed/c-u-b-1/200/200' } ] },
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

// By-slug breadcrumb (prefer使用 slug 作為唯一鍵)
export function getCategoryBreadcrumbBySlug(tree, slug) {
  const path = []
  function dfs(nodes, trail) {
    for (const n of nodes || []) {
      const next = [...trail, n]
      if (n.slug === slug) { path.push(...next); return true }
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

// --- Category CRUD Manager (mock) ---
function clone(obj){ return JSON.parse(JSON.stringify(obj)) }

function findNodePathBySlug(slug){
  const path = []
  function dfs(nodes, parent=null){
    for (let i=0;i<(nodes||[]).length;i++){
      const n = nodes[i]
      path.push({ node:n, parent, index:i })
      if (n.slug === slug) return true
      if (n.children && dfs(n.children, n)) return true
      path.pop()
    }
    return false
  }
  return dfs(PRODUCT_CATEGORIES, null) ? path.slice() : null
}

function findNodeById(id){
  let found = null
  ;(function dfs(nodes){
    for (const n of nodes || []){
      if (n.id === id){ found = n; return }
      if (n.children) dfs(n.children)
      if (found) return
    }
  })(PRODUCT_CATEGORIES)
  return found
}

// Backward-compatible alias
function findById(id){
  return findNodeById(id)
}

function slugExists(slug){
  let yes = false
  ;(function dfs(nodes){
    for (const n of nodes || []){
      if (n.slug === slug){ yes = true; return }
      if (n.children) dfs(n.children)
      if (yes) return
    }
  })(PRODUCT_CATEGORIES)
  return yes
}

function ensureUniqueSlug(s){
  let base = String(s||'').trim() || `cat-${Date.now().toString(36)}`
  let candidate = base
  let i = 1
  while (slugExists(candidate)){
    candidate = `${base}-${i++}`
  }
  return candidate
}

function getTree(){
  return clone(PRODUCT_CATEGORIES)
}

function findBySlug(slug){
  const p = findNodePathBySlug(slug)
  return p ? p[p.length-1].node : null
}

function addCategory({ parentSlug=null, name, slug, image }){
  const finalSlug = ensureUniqueSlug(slug || name?.toString().trim().toLowerCase().replace(/\s+/g,'-'))
  const node = { id: finalSlug, slug: finalSlug, name: name || '未命名分類', image: image || '', children: [] }
  if (!parentSlug){
    PRODUCT_CATEGORIES.push(node)
    return clone(node)
  }
  const path = findNodePathBySlug(parentSlug)
  if (!path) throw new Error('Parent not found')
  const parent = path[path.length-1].node
  parent.children = parent.children || []
  parent.children.push(node)
  return clone(node)
}

function updateCategory(slug, patch={}){
  const path = findNodePathBySlug(slug)
  if (!path) throw new Error('Category not found')
  const node = path[path.length-1].node
  if (patch.slug && patch.slug !== node.slug){
    node.slug = ensureUniqueSlug(patch.slug)
    node.id = node.slug // keep id in sync for components that still depend on id
  }
  if (typeof patch.name === 'string') node.name = patch.name
  if (typeof patch.image === 'string') node.image = patch.image
  return clone(node)
}

function deleteCategory(slug){
  function remove(nodes, slug){
    for (let i=0;i<(nodes||[]).length;i++){
      const n = nodes[i]
      if (n.slug === slug){
        nodes.splice(i,1)
        return true
      }
      if (n.children && remove(n.children, slug)) return true
    }
    return false
  }
  return remove(PRODUCT_CATEGORIES, slug)
}

const categoryManager = {
  getTree,
  findBySlug,
  findById,
  addCategory,
  updateCategory,
  deleteCategory,
  slugExists,
}

export default categoryManager
