const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance

    if (key in setupState) {
      return setupState[key]
    }

    if (publicPropertiesMap[key]) {
      return publicPropertiesMap[key](instance)
    }
  },
}
