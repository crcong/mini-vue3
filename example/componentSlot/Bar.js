import { h, renderSlots } from '../../dist/index.mjs'

export default {
  name: 'Foo',
  setup() {
    return {}
  },
  render() {
    const bar = h('p', {}, 'bar center')

    const age = 17
    const name = 'crcong'
    return h('div', {}, [
      renderSlots(this.$slot, 'header', { name }),
      bar,
      renderSlots(this.$slot, 'footer', { age }),
    ])
  },
}
