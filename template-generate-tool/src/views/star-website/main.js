import Vue from 'vue'
import App from './index.vue'
import { Autocomplete } from 'element-ui'
import 'element-theme-darkplus'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'mini' }

Vue.use(Autocomplete)

new Vue({
  render: h => h(App)
}).$mount('#app')
