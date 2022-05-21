import { h } from '../../dist/index.mjs'
import Bar from './Bar.js'

export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App')

    const bar = h(Bar, {}, {
      header: h('p', {}, 'header'),
      footer: h('p', {}, 'footer'),
    })

    return h('div', {}, [app, bar])
  },

  setup() {
    return {}
  },
}
