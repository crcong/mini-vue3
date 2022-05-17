export const extend = Object.assign

export const isObject = (value) => value !== null && typeof value === 'object'

export const hasChanged = (value, newValue) => !Object.is(value, newValue)

export const isOn = (v) => /^on[A-Z]/.test(v)

export const hasOwn = (v, k) => Object.prototype.hasOwnProperty.call(v, k)

export const camelize = (str: string) => {
  return str.replace(/-([a-zA-Z])/g, (_, a) => a?.toUpperCase() ?? '')
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toHandlerKey = (str: string) => {
  return str ? `on${(capitalize(camelize(str)))}` : ''
}
