import { describe, expect, fn, it } from 'vitest'
import { effect, stop } from '../effect'
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

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })

  it('should not track after stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })

    stop(runner)

    obj.prop++
    expect(dummy).toBe(1)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(2)
  })

  it('events: onStop', () => {
    const onStop = fn()

    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })

  it('should cleanup effect before run effect function', () => {
    let dummy
    const obj = reactive({ a: 1, isOk: true })
    const effectFn = fn(() => {
      dummy = obj.isOk ? obj.a : 'notOk'
    })
    effect(effectFn)
    expect(dummy).toBe(1)
    expect(effectFn).toHaveBeenCalledTimes(1)

    obj.a = 2
    expect(effectFn).toHaveBeenCalledTimes(2)

    obj.isOk = false
    expect(effectFn).toHaveBeenCalledTimes(3)
    expect(dummy).toBe('notOk')

    // notice that: need cleanup effects, collect effect again
    obj.a = 2
    expect(effectFn).toHaveBeenCalledTimes(3)
    expect(dummy).toBe('notOk')

    obj.isOk = true
    expect(effectFn).toHaveBeenCalledTimes(4)

    obj.a = 3
    expect(effectFn).toHaveBeenCalledTimes(5)
    expect(dummy).toBe(3)
  })

  it('nested effect', () => {
    const obj = reactive({
      foo: 1,
      bar: 2,
    })

    let outerFoo
    let outerBar
    const fn1 = fn()
    const fn2 = fn()

    effect(() => {
      effect(() => {
        fn2()
        outerBar = obj.bar
      })
      fn1()
      outerFoo = obj.foo
    })

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(outerFoo).toBe(1)
    expect(outerBar).toBe(2)
    obj.bar = 4
    expect(fn2).toBeCalledTimes(2)
    expect(outerBar).toBe(4)

    obj.foo = 3
    expect(fn1).toBeCalledTimes(2)
    expect(outerFoo).toBe(3)
    expect(fn2).toBeCalledTimes(3)
  })

  it('should allow nested effects', () => {
    const numbers = reactive({ num1: 0, num2: 1, num3: 2 })
    const dummy: any = {}

    const childSpy = fn(() => (dummy.num1 = numbers.num1))
    const childEffect = effect(childSpy)
    const parentSpy = fn(() => {
      dummy.num2 = numbers.num2
      childEffect()
      dummy.num3 = numbers.num3
    })
    effect(parentSpy)

    expect(dummy).toEqual({ num1: 0, num2: 1, num3: 2 })
    expect(parentSpy).toHaveBeenCalledTimes(1)
    expect(childSpy).toHaveBeenCalledTimes(2)
    // this should only call the childEffect
    numbers.num1 = 4
    expect(dummy).toEqual({ num1: 4, num2: 1, num3: 2 })
    expect(parentSpy).toHaveBeenCalledTimes(1)
    expect(childSpy).toHaveBeenCalledTimes(3)
    // this calls the parentEffect, which calls the childEffect once
    numbers.num2 = 10
    expect(dummy).toEqual({ num1: 4, num2: 10, num3: 2 })
    expect(parentSpy).toHaveBeenCalledTimes(2)
    expect(childSpy).toHaveBeenCalledTimes(4)
    // this calls the parentEffect, which calls the childEffect once
    numbers.num3 = 7
    expect(dummy).toEqual({ num1: 4, num2: 10, num3: 7 })
    expect(parentSpy).toHaveBeenCalledTimes(3)
    expect(childSpy).toHaveBeenCalledTimes(5)
  })
})
