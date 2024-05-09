import { commands, workspace, env, Uri, MessageItem, window } from 'vscode'

// 打开项目相关链接
export function getOpenLinkDisposable(commandName: string) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    async uri => {
      const workspaceFolder = workspace.workspaceFolders?.find(item =>
        uri.path.includes(item.uri.path)
      )
      if (!workspaceFolder) {
        return
      }
      const linkUriMap =
        workspace
          .getConfiguration()
          .get<Record<string, string>>(
            `vscode-template-generate-tool.${commandName}`
          ) || {}
      const linkUri = linkUriMap[workspaceFolder.name]
      if (linkUri) {
        env.openExternal(Uri.parse(linkUri))
      } else {
        const yes: MessageItem = { title: '是' }
        const no: MessageItem = { title: '否', isCloseAffordance: true }
        const result = await window.showInformationMessage(
          `链接地址未设置，是否去设置`,
          yes,
          no
        )
        if (result === yes) {
          commands.executeCommand(
            'workbench.action.openSettings',
            '@ext:jzh.vscode-template-generate-tool'
          )
        }
      }
    }
  )
}
