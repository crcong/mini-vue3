import { getCurrentInstance, h } from '../../dist/index.mjs'

export default {
  name: 'Foo',
  setup() {
    console.log('Foo: ', getCurrentInstance())
  },
  render() {
    return h(
      'div',
      {},
      'Foo component',
    )
  },
}
