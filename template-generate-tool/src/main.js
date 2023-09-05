import Vue from 'vue'
import App from './App.vue'
import {
  Dialog,
  Autocomplete,
  Input,
  InputNumber,
  RadioGroup,
  RadioButton,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Icon,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Row,
  Col,
  Backtop,
  Collapse,
  CollapseItem,
  Cascader,
  Link,
  Divider
} from 'element-ui'
import 'element-theme-darkplus'
import Clipboard from './plugin/clipboard'
import Confirm2 from './plugin/confirm2'
import Tip from './plugin/tip'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'mini' }

Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Backtop)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(Link)
Vue.use(Divider)
Vue.use(Tip)
Vue.use(Confirm2)
Vue.use(Clipboard)

new Vue({
  render: h => h(App)
}).$mount('#app')
