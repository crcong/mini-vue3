import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _dirty = true
  private _value: any
  private _effect: ReactiveEffect
  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      this._dirty = true
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}
