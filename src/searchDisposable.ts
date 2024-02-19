import { commands, window, env, Uri } from 'vscode'

// 菜鸟教程搜索
export function getRunoobDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.菜鸟教程搜索`,
    () => {
      const editor = window.activeTextEditor
      const selection = editor?.selection
      const selectedText = editor?.document.getText(selection)
      env.openExternal(
        Uri.parse(`https://www.runoob.com/?s=js ${selectedText}`)
      )
    }
  )
}

// MDN搜索
export function getMdnDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.MDN搜索`,
    () => {
      const editor = window.activeTextEditor
      const selection = editor?.selection
      const selectedText = editor?.document.getText(selection)
      env.openExternal(
        Uri.parse(`https://www.baidu.com/s?wd=mdn ${selectedText}`)
      )
    }
  )
}

// Element搜索
export function getElementDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.Element搜索`,
    () => {
      const editor = window.activeTextEditor
      const selection = editor?.selection
      const selectedText = editor?.document.getText(selection)
      env.openExternal(
        Uri.parse(`https://element.eleme.cn/#/zh-CN/component/${selectedText}`)
      )
    }
  )
}
