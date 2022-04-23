import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

function createGetter(readonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !readonly
    }
    const result = Reflect.get(target, key)
    if (!readonly) {
      track(target, key)
    }
    return result
  }
}

function createSetter() {
  return function set(target, key, value) {
    const result = Reflect.set(target, key, value)
    trigger(target, key)
    return result
  }
}

const get = createGetter()
const set = createSetter()

export const mutableHandler = {
  get,
  set,
}

const readonlyGet = createGetter(true)

export const readonlyHandler = {
  get: readonlyGet,
  set(_, key) {
    console.warn(`Set operation on key "${key}" failed: target is readonly.`)
    return true
  },
}
