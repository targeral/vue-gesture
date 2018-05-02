const isString = value => typeof value === 'string'

const VALUE = [
  'all',
  'vertical',
  'horizontal'
]

const DEFAULT = 'all'

const validator = value => isString(value) && VALUE.includes(value)

export default {
  validator,
  default: DEFAULT
}
