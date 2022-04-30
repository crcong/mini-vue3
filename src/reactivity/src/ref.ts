import { hasChanged, isObject } from '../../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

class RefImpl {
  private _value: any
  public dep: Set<any>
  private _rawValue: any
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  public get value() {
    trackRefValue(this)
    return this._value
  }

  public set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._value = convert(newValue)
      this._rawValue = newValue
      triggerEffects(this.dep)
    }
  }
}

export function ref(target) {
  return new RefImpl(target)
}
