import { describe, expect, it } from 'vitest'
import { effect } from '../effect'
import { reactive } from '../reactive'

describe('reactivity/effect', () => {
  it('should observe basic properties', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))

    expect(dummy).toBe(0)
    counter.num = 7
    expect(dummy).toBe(7)
  })

  it('should return a new reactive version of the function', () => {
    function greet() {
      return 'Hello World'
    }
    const effect1 = effect(greet)
    const effect2 = effect(greet)
    expect(typeof effect1).toBe('function')
    expect(typeof effect2).toBe('function')
    expect(effect1).not.toBe(greet)
    expect(effect1).not.toBe(effect2)
  })

  it('should discover new branches when running manually', () => {
    let dummy
    let run = false
    const obj = reactive({ prop: 'value' })
    const runner = effect(() => {
      dummy = run ? obj.prop : 'other'
      return true
    })

    expect(dummy).toBe('other')
    const result = runner()
    expect(result).toBe(true)
    expect(dummy).toBe('other')
    run = true
    runner()
    expect(dummy).toBe('value')
    obj.prop = 'World'
    expect(dummy).toBe('World')
  })
})
