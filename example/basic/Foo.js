import { h } from '../../dist/index.mjs'

export default {
  name: 'Foo',
  setup(props) {
    // eslint-disable-next-line no-console
    console.log(props)
    props.value = 11
  },
  render() {
    return h('div', {}, `Foo component: ${this.value}`)
  },
}
