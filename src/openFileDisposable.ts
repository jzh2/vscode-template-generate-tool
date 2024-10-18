import { commands, window, Uri } from 'vscode'
import { join } from 'path'
import { existsSync } from 'fs'
import { getRelatedProjectPaths } from './utils'

// 打开指定文件
export function getOpenFileDisposable(commandName: string, fileName: string) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    (uri: Uri) => {
      const relatedProjectPaths = getRelatedProjectPaths(uri)
      for (const fsPath of relatedProjectPaths) {
        const filePath = join(fsPath, fileName)
        if (existsSync(filePath)) {
          commands.executeCommand('vscode.openFolder', Uri.file(filePath))
          return
        }
      }
      window.showInformationMessage('本项目没有该文件')
    }
  )
}
