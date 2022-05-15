import { h } from '../../dist/index.mjs'

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
      ],
    )
  },

  setup() {
    return {
      msg: 'mini-vue3',
    }
  },
}
