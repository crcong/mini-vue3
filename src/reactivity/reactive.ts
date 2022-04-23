import { mutableHandler, readonlyHandler } from './baseHandlers'

function createReactiveObject(target, handler) {
  return new Proxy(target, handler)
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandler)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandler)
}

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export function isReactive(target) {
  return Boolean(target[ReactiveFlags.IS_REACTIVE])
}
