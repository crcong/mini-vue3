import { describe, expect, fn, it } from 'vitest'
import { isProxy, isReadonly, readonly } from '../src/reactive'

describe('reactivity/readonly', () => {
  it('basic', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('warn then call set', () => {
    console.warn = fn()

    const wrapped = readonly({
      foo: 1,
    })

    wrapped.foo = 2

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(wrapped.foo).toBe(1)
  })

  it('isReadonly', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
  })

  it('isReadonly isProxy', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)

    expect(isProxy(wrapped)).toBe(true)
  })
})
