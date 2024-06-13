import {
  commands,
  workspace,
  window,
  Uri,
  Range,
  WorkspaceEdit,
  MessageItem
} from 'vscode'
import { join } from 'path'
import { existsSync } from 'fs'

// 打开指定文件
export function getAddProxyDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.addProxyDisposable`,
    async uri => {
      const workspaceFolder = workspace.workspaceFolders?.find(item =>
        uri.path.includes(item.uri.path)
      )
      if (!workspaceFolder) {
        return
      }

      const editor = window.activeTextEditor
      if (!editor) {
        return
      }
      let selectedText = editor.document.getText(editor.selection)
      if (!selectedText) {
        // 从引号到光标的内容
        const { line, character } = editor.selection.active
        const preText = editor.document.getText(
          new Range(line, 0, line, character)
        )
        let preLastIndex = Math.max(
          preText.lastIndexOf("'"),
          preText.lastIndexOf('"'),
          preText.lastIndexOf('`')
        )
        if (preLastIndex === -1) {
          window.showInformationMessage('未找到引号内的字符串')
          return
        }
        // 从光标到引号的内容
        const nextText = editor.document.getText(
          new Range(line, character, line, 1000)
        )
        let nextFirstIndex = Math.min(
          nextText.indexOf("'") + 1 || Number.MAX_SAFE_INTEGER,
          nextText.indexOf('"') + 1 || Number.MAX_SAFE_INTEGER,
          nextText.indexOf('`') + 1 || Number.MAX_SAFE_INTEGER
        )
        if (nextFirstIndex === Number.MAX_SAFE_INTEGER) {
          window.showInformationMessage('未找到引号内的字符串')
          return
        }
        selectedText =
          preText.slice(preLastIndex + 1) +
          nextText.slice(0, nextFirstIndex - 1)
      }

      const fsPath = workspaceFolder.uri.fsPath
      const filePath = join(fsPath, 'vue.config.proxy.js')
      let proxyUri: Uri
      if (existsSync(filePath)) {
        proxyUri = Uri.file(filePath)
      } else {
        const entranceWorkspaceMap =
          workspace
            .getConfiguration()
            .get<Record<string, string>>(
              `vscode-template-generate-tool.entranceWorkspaceMap`
            ) || {}
        const entranceName = entranceWorkspaceMap[workspaceFolder.name]
        if (entranceName) {
          const entranceWorkspaceFolder = workspace.workspaceFolders?.find(
            item => item.name === entranceName
          )
          if (entranceWorkspaceFolder) {
            const entranceFilePath = join(
              entranceWorkspaceFolder.uri.fsPath,
              'vue.config.proxy.js'
            )
            if (existsSync(entranceFilePath)) {
              proxyUri = Uri.file(entranceFilePath)
            }
          }
        } else {
          const yes: MessageItem = { title: '是' }
          const no: MessageItem = { title: '否', isCloseAffordance: true }
          const result = await window.showInformationMessage(
            `无本地代理文件，是否创建`,
            yes,
            no
          )
          if (result === yes) {
            workspace.fs.writeFile(
              Uri.file(filePath),
              Buffer.from(`module.exports = {
  port: 8080
}
`)
            )
            proxyUri = Uri.file(filePath)
          }
        }
      }
      editFile()

      function editFile() {
        workspace.openTextDocument(proxyUri).then(document => {
          const edit = new WorkspaceEdit()
          edit.replace(
            proxyUri,
            new Range(
              document.lineCount - 3,
              1000,
              document.lineCount - 3,
              1000
            ),
            `,
  '${selectedText}': {
    ws: false,
    changeOrigin: true,
    target: ''
  }`
          )
          workspace.applyEdit(edit)
          window.showTextDocument(document)
        })
      }
    }
  )
}
