import { describe, expect, it, fn } from 'vitest'
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

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler },
    )
    // 执行 effect 不会执行 scheduler
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    // 数据变更后不执行 effect fn , 执行 scheduler
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)

    // 执行 runner , 会执行 effect fn
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
})
