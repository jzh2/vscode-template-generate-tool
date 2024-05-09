import { commands, workspace, window, Uri } from 'vscode'
import { join } from 'path'
import { existsSync } from 'fs'

// 打开指定文件
export function getOpenFileDisposable(commandName: string, fileName: string) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    uri => {
      const workspaceFolder = workspace.workspaceFolders?.find(item =>
        uri.path.includes(item.uri.path)
      )
      if (!workspaceFolder) {
        return
      }
      const fsPath = workspaceFolder.uri.fsPath
      const filePath = join(fsPath, fileName)
      if (existsSync(filePath)) {
        commands.executeCommand('vscode.openFolder', Uri.file(filePath))
        return
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
              fileName
            )
            if (existsSync(entranceFilePath)) {
              commands.executeCommand(
                'vscode.openFolder',
                Uri.file(entranceFilePath)
              )
              return
            }
          }
        }
      }
      window.showInformationMessage('本项目没有该文件')
    }
  )
}
