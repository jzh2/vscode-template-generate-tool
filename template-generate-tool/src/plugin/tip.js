import { Message } from 'element-ui'
const TYPE_MAP = ['info', 'warning', 'success', 'error']

/**
 * 1、界面上，同一消息，只提示一次
 * 2、界面上，最多只提示两条不同消息
 * 3、待提示消失后，可重新提示
 */
const messageQueue = [] // 显示中的消息队列
const messageMaxCount = 2 // 界面上，同时最多提示消息数量

function pushMessage(msg) {
  return messageQueue.includes(msg) || messageQueue.length === messageMaxCount
    ? null
    : (messageQueue.push(msg), msg)
}
function popMessage() {
  return messageQueue.shift()
}

export default {
  install(Vue) {
    Vue.$tip = Vue.prototype.$tip = opt => {
      const message = pushMessage(opt.message)
      if (message) {
        return Message({
          customClass: 'tip',
          offset: 140,
          onClose: popMessage,
          ...opt
        })
      }
    }

    TYPE_MAP.forEach(type => {
      Vue.$tip[type] = Vue.prototype.$tip[type] = (message, opt) =>
        Vue.prototype.$tip({ message, type, ...opt })
    })
  }
}
