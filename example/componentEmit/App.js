import { h } from '../../dist/index.mjs'
import Foo from './Foo.js'

export const App = {
  render() {
    return h(
      'div',
      {
        class: 'app',
        style: 'color: red;',
        onClick() {
          console.warn('click')
        },
      },
      [
        h('span', { class: 'span' }, `hi, ${this.msg}, $el: ${this.$el}`),
        h('a', { href: 'https://v3.cn.vuejs.org/', target: '_blank' }, 'vue3中文文档'),
        h(
          Foo,
          {
            value: 333,
            onAdd(...args) {
              console.log('call onAdd good!!', args)
            },
            onAddFooFn(...args) {
              console.log('call onFooFn good!!', args)
            },
          },
        ),
      ],
    )
  },

  setup() {
    return {
      msg: 'mini-vue3',
    }
  },
}
