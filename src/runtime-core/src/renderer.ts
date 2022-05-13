import { isObject } from '../../shared'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  const el = document.createElement(vnode.type)

  const { children, props = {} } = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  for (const k in props) {
    if (Object.prototype.hasOwnProperty.call(props, k)) {
      const p = props[k]
      el.setAttribute(k, p)
    }
  }
  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((c) => patch(c, container))
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance, initialVNode, container) {
  const { render, proxy } = instance
  const subtree = render.call(proxy)

  patch(subtree, container)
}
