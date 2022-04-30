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
  public dep = new Set()
  public __v_isRef = true
  private _rawValue: any
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
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

export function isRef(r) {
  return Boolean(r && r.__v_isRef === true)
}

export function unref(r) {
  return isRef(r) ? r.value : r
}
