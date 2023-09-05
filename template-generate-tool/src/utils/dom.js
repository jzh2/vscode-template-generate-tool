// 获取MouseEvent.path 针对浏览器兼容性兼容ie11,edge,chrome,firefox,safari
export function getEventPath(evt) {
  const target = evt.target
  const path = (evt.composedPath && evt.composedPath()) || evt.path
  if (path != null) {
    return path.indexOf(window) < 0 ? path.concat(window) : path
  }
  if (target === window) {
    return [window]
  }
  function getParents(node, memo = []) {
    const parentNode = node.parentNode
    if (!parentNode) {
      return memo
    } else {
      return getParents(parentNode, memo.concat(parentNode))
    }
  }
  return [target].concat(getParents(target), window)
}
