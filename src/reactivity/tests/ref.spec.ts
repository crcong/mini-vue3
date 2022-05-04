import { describe, expect, it } from 'vitest'
import { effect } from '../src/effect'
import { isRef, proxyRefs, ref, unref } from '../src/ref'

describe('reactive/ref', () => {
  it('should hold a value', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
    a.value = 2
    expect(a.value).toBe(2)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('unref', () => {
    expect(unref(1)).toBe(1)
    expect(unref(ref(1))).toBe(1)
  })

  it('isRef', () => {
    expect(isRef(ref(1))).toBe(true)

    expect(isRef(0)).toBe(false)
    expect(isRef(1)).toBe(false)
    // an object that looks like a ref isn't necessarily a ref
    expect(isRef({ value: 0 })).toBe(false)
  })

  it('proxyRefs', () => {
    const foo = {
      bar: ref(1),
      foo: 2,
    }

    const proxyFoo = proxyRefs(foo)
    expect(proxyFoo.bar).toBe(1)
    expect(foo.bar.value).toBe(1)
    expect(proxyFoo.foo).toBe(2)
    expect(foo.foo).toBe(2)

    proxyFoo.bar = 2
    expect(proxyFoo.bar).toBe(2)
    expect(foo.bar.value).toBe(2)

    proxyFoo.foo = 3
    expect(proxyFoo.foo).toBe(3)

    proxyFoo.bar = ref(4)
    expect(proxyFoo.bar).toBe(4)
    expect(foo.bar.value).toBe(4)
  })
})
