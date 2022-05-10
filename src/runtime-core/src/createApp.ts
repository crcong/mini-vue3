import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // exchange vnode
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    },
  }
}
