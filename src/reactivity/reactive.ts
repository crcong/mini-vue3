import { mutableHandler, readonlyHandler } from './baseHandlers'

const proxyMap = new WeakMap()

function createReactiveObject(target, handler) {
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  const proxy = new Proxy(target, handler)
  proxyMap.set(target, proxy)
  return proxy
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandler)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandler)
}

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function isReactive(target) {
  return Boolean(target[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(target) {
  return Boolean(target[ReactiveFlags.IS_READONLY])
}
