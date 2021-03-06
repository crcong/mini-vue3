import { createTextNode, h } from '../../dist/index.mjs'
import Bar from './Bar.js'

export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App')

    const bar = h(Bar, {}, {
      header: ({ name }) => h('p', {}, `header, my name is ${name}`),
      footer: ({ age }) => [h('p', {}, `footer, my age is ${age}`), createTextNode('this is text create by createTextNode')],
    })

    return h('div', {}, [app, bar])
  },

  setup() {
    return {}
  },
}
