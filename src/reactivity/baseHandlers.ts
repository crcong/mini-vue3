import { track, trigger } from './effect'

function createGetter(readonly = false) {
  return function get(target, key) {
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
  set() {
    return true
  },
}
