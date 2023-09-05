import { MessageBox } from 'element-ui'

const ICON_MAP = {
  info: {
    color: '#909399',
    icon: 'el-icon-info'
  },
  success: {
    color: '#4ec89c',
    icon: 'el-icon-circle-check'
  },
  warning: {
    color: '#FAAD14',
    icon: 'el-icon-warning-outline'
  },
  error: {
    color: '#f94348',
    icon: 'el-icon-circle-close'
  }
}

export default {
  install(Vue) {
    Vue.$confirm2 = Vue.prototype.$confirm2 = (msg, title = '提示', opt) => {
      let message = typeof msg === 'string' ? { msg } : msg
      const options = Object.assign(
        {
          confirmButtonClass: 'el-button--success el-button--mini',
          cancelButtonClass: 'el-button--mini',
          closeOnClickModal: false,
          closeOnPressEscape: false
        },
        opt,
        {
          iconClass: 'none',
          customClass: 'tip',
          dangerouslyUseHTMLString: true
        }
      )
      const iconMap = ICON_MAP[options.type || 'info']
      message = /*html*/ `<div style="display:flex">
        <i
          class="${iconMap.icon}"
          style="font-size:40px;color:${iconMap.color};"
        ></i>
        <div style="margin-left: 10px;display:flex;align-items:center;">
          <p style="font-size:14px;">
            ${message.msg}
          </p>
          <p style="font-size:12px;">${message.subMsg ?? ''}</p>
        </div>
      </div>`
      return MessageBox.confirm(message, title, options)
    }
    Object.keys(ICON_MAP).forEach(type => {
      Vue.$confirm2[type] = Vue.prototype.$confirm2[type] = (msg, title, opt) =>
        Vue.prototype.$confirm2(msg, title, { type, ...opt })
    })
    Vue.$confirm2.delete = Vue.prototype.$confirm2.delete = opt =>
      Vue.prototype.$confirm2.warning('您确定要删除当前选中的记录吗', '提示', {
        ...opt
      })
  }
}
