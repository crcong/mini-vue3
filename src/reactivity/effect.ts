let activeEffect

class ReactiveEffect {
  fn: any

  constructor(fn) {
    this.fn = fn
  }

  run() {
    activeEffect = this
    return this.fn()
  }
}

const targetMap = new Map()
export function track(target, key) {
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const deps = depsMap.get(key)
  if (!deps) {
    return
  }

  for (const effect of deps) {
    effect.run()
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()

  return _effect.run.bind(_effect)
}
