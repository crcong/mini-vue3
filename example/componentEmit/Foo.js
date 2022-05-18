import { h } from '../../dist/index.mjs'

export default {
  name: 'Foo',
  setup(props, { emit }) {
    console.log(props)
    props.value = 11

    function emitTestFn() {
      emit('add', 1, 2)

      emit('add-foo-fn', 3, 4)
    }

    return {
      emitTestFn,
    }
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
