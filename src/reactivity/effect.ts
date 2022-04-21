let activeEffect

class ReactiveEffect {
  fn: any
  deps = []
  isActive = true
  scheduler?: () => void
  onStop?: () => void

  constructor(fn) {
    this.fn = fn
  }

  run() {
    activeEffect = this
    return this.fn()
  }

  stop() {
    if (this.isActive) {
      cleanupEffect(this)
      this.onStop?.()
      this.isActive = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
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
  activeEffect.deps.push(dep)
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
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options = {} as any) {
  const _effect: any = new ReactiveEffect(fn)

  // FIXME: refactor utils to shared package
  Object.assign(_effect, options)

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect

  runner()

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
