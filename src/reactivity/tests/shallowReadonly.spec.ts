import { describe, expect, fn, it } from 'vitest'
import { isReadonly, shallowReadonly } from '../reactive'

describe('reactivity/readonly', () => {
  it('basic', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = shallowReadonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(wrapped.bar)).toBe(false)
  })

  it('warn then call set', () => {
    console.warn = fn()

    const wrapped = shallowReadonly({
      foo: 1,
      bar: {
        baz: 2,
      },
    })

    wrapped.foo = 2

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(wrapped.foo).toBe(1)

    wrapped.bar.baz = 3

    // nested
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(wrapped.bar.baz).toBe(3)
  })
})
