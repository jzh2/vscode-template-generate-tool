import { commands, workspace, window, Uri } from 'vscode'
import { join } from 'path'
import { existsSync } from 'fs'

// 打开最近的文件
export function getOpenFileDisposable(commandName: string, fileName: string) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      const fsPath = workspace.workspaceFolders?.find(item =>
        window.activeTextEditor?.document.uri.path.includes(item.uri.path)
      )?.uri.fsPath
      if (fsPath) {
        const filePath = join(fsPath, fileName)
        if (existsSync(filePath)) {
          commands.executeCommand('vscode.openFolder', Uri.file(filePath))
        } else {
          window.showInformationMessage('本项目没有该文件')
        }
      }
    }
  )
}
