import { describe, expect, it } from 'vitest'
import { isReactive, reactive } from '../reactive'

describe('reactivity/reactive', () => {
  it('basic', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    observed.foo = 2
    expect(observed.foo).toBe(2)
  })

  it('isReactive', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })

  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })

  it('get same nested object need return save proxy', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }

    const observed = reactive(original)
    expect(observed.nested).toBe(observed.nested)
  })
})
