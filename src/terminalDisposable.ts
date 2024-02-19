import { commands, workspace, MessageItem, window } from 'vscode'

// 终端命令
export function getTerminalDisposable(
  commandName: string,
  commandContent: string,
  commandIndex?: number
) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    async () => {
      let content = commandContent
      if (!content) {
        const configuration = workspace.getConfiguration()
        content =
          configuration.get(
            `vscode-template-generate-tool.customTerminal${commandIndex}`
          ) || ''
      }
      if (content) {
        await commands.executeCommand('openInIntegratedTerminal')
        // commands.executeCommand('workbench.action.terminal.new')
        // commands.executeCommand('workbench.action.terminal.sendSequence', {
        //   text: `cd ${uri._fsPath}\r`
        // })
        await commands.executeCommand(
          'workbench.action.terminal.sendSequence',
          {
            text: `${content}\r`
          }
        )
      } else {
        const yes: MessageItem = { title: '是' }
        const no: MessageItem = { title: '否', isCloseAffordance: true }
        const result = await window.showInformationMessage(
          `自定义命令未设置，是否去设置`,
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
