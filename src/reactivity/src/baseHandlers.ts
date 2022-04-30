import { extend, isObject } from '../../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

function createGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const result = Reflect.get(target, key)

    if (isShallowReadonly) {
      return result
    }

    // Also need to lazy access readonly and reactive here to avoid circular dependency.
    if (isObject(result)) {
      return isReadonly ? readonly(result) : reactive(result)
    }

    if (!isReadonly) {
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

const shallowReadonlyGet = createGetter(true, true)

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGet,
})
