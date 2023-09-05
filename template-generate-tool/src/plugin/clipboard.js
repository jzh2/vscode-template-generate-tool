/**
 * 剪贴板
 */
import Clipboard from 'clipboard'

export default {
  install(Vue) {
    Vue.prototype.$copy = text => {
      const clipboard = new Clipboard(window.event.target, {
        text: () => text
      })
      clipboard.on('success', () => {
        Vue.$tip.success('复制成功')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        Vue.$tip.warning('复制失败')
        clipboard.destroy()
      })
      clipboard.onClick(window.event)
    }
  }
}
