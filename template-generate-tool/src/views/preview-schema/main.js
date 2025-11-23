import Vue from 'vue'
import App from './index'
import { Autocomplete, Button } from 'element-ui'
import 'element-theme-darkplus'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'mini' }

Vue.use(Autocomplete).use(Button)

new Vue({
  render: h => h(App)
}).$mount('#app')
