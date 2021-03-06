import { isOn } from '../../shared'
import { ShapeFlags } from '../../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  const { type, shapeFlag } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break
    case Text:
      processText(vnode, container)
      break

    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
      }
      break
  }
}

function processElement(vnode, container) {
  const el = vnode.el = document.createElement(vnode.type)

  const { children, props = {}, shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  for (const k in props) {
    if (Object.prototype.hasOwnProperty.call(props, k)) {
      const p = props[k]

      // native events, TODO: bind context
      if (isOn(k)) {
        el.addEventListener(k.slice(2).toLocaleLowerCase(), p)
      } else {
        el.setAttribute(k, p)
      }
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

  setupComponent(instance, initialVNode)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance, initialVNode, container) {
  const { render, proxy } = instance
  const subtree = render.call(proxy)

  patch(subtree, container)

  initialVNode.el = subtree.el
}

function processFragment(vnode, container) {
  mountChildren(vnode, container)
}

function processText(vnode, container) {
  const { children } = vnode
  const textNode = vnode.el = document.createTextNode(children)
  container.append(textNode)
}
