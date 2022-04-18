import { describe, expect, it } from 'vitest'
import { reactive } from '../reactive'

describe('reactivity/reactive', () => {
  it('basic', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
  })
})
