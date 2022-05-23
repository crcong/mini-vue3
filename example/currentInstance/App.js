import { getCurrentInstance, h } from '../../dist/index.mjs'
import Foo from './Foo.js'

export const App = {
  name: 'App',
  render() {
    return h(
      'h1',
      {},
      [h(Foo)],
    )
  },

  setup() {
    console.log('App: ', getCurrentInstance())
    return {
      msg: 'mini-vue3',
    }
  },
}
