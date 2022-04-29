import { extend } from '../shared'

const effectStack: any = []
let activeEffect
let shouldTrack = false

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
    if (!this.isActive) {
      return this.fn()
    }
    shouldTrack = true
    activeEffect = this
    effectStack.push(activeEffect)

    cleanupEffect(this)

    const result = this.fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    // reset
    shouldTrack = false
    return result
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
  effect.deps.length = 0
}

function isTracking() {
  return activeEffect !== undefined && shouldTrack === true
}

const targetMap = new Map()
export function track(target, key) {
  if (!isTracking() && effectStack.length === 0) {
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

  if (dep.has(activeEffect)) {
    return
  }

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
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

  const newDeps: any = new Set()
  for (const dep of deps) {
    if (dep !== activeEffect) {
      newDeps.add(dep)
    }
  }

  for (const effect of newDeps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options = {} as any) {
  const _effect: any = new ReactiveEffect(fn)

  extend(_effect, options)

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect

  runner()

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
