import { h, renderSlots } from '../../dist/index.mjs'

export default {
  name: 'Foo',
  setup() {
    return {}
  },
  render() {
    const bar = h('p', {}, 'bar center')

    return h('div', {}, [
      renderSlots(this.$slot, 'header'),
      bar,
      renderSlots(this.$slot, 'footer'),
    ])
  },
}
