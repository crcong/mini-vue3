import { h } from '../../dist/index.mjs'

export default {
  name: 'Foo',
  setup(props) {
    console.log(props)
    props.value = 11
  },
  render() {
    return h(
      'div',
      {
        onClick: this.emitTestFn,
      },
     `Foo component: ${this.value}`,
    )
  },
}
