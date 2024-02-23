import { commands, window, env, Uri } from 'vscode'

// 右键菜单搜索
export function getSearchDisposable(searchPlatform: string) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${searchPlatform}`,
    () => {
      const editor = window.activeTextEditor
      const selection = editor?.selection
      const selectedText = editor?.document.getText(selection)
      let searchText = ''
      switch (searchPlatform) {
        case '百度':
          searchText = `https://www.baidu.com/s?wd=${selectedText}`
          break
        case '必应':
          searchText = `https://cn.bing.com/search?q=${selectedText}`
          break
        case '谷歌':
          searchText = `https://www.google.com/search?q=${selectedText}`
          break
        case '菜鸟教程':
          searchText = `https://www.runoob.com/?s=js ${selectedText}`
          break
        case 'MDN':
          searchText = `https://www.baidu.com/s?wd=mdn ${selectedText}`
          break
        case 'ElementUI':
          searchText = `https://element.eleme.cn/#/zh-CN/component/${selectedText}`
          break
        case 'npmjs':
          searchText = `https://www.npmjs.com/search?q=${selectedText}`
          break
      }
      env.openExternal(Uri.parse(searchText))
    }
  )
}
