import { commands, workspace, env, Uri, MessageItem, window } from 'vscode'
import { getProject } from './utils'

async function confirmOpenSettings(message: string) {
  const yes: MessageItem = { title: '是' }
  const no: MessageItem = { title: '否', isCloseAffordance: true }
  const result = await window.showInformationMessage(message, yes, no)
  if (result === yes) {
    commands.executeCommand(
      'workbench.action.openSettings',
      '@ext:jzh.vscode-template-generate-tool'
    )
  }
}

// 打开项目相关链接
export function getOpenLinkDisposable(commandName: string) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    async (uri: Uri) => {
      const linkUriMap =
        workspace
          .getConfiguration()
          .get<
            Record<string, string>
          >(`vscode-template-generate-tool.${commandName}`) || {}
      const linkUri = linkUriMap[getProject(uri).projectName]
      if (linkUri) {
        env.openExternal(Uri.parse(linkUri))
      } else {
        await confirmOpenSettings(`链接地址未设置，是否去设置`)
      }
    }
  )
}

// 打开自定义链接
export function getOpenCustomLinkDisposable(index: number) {
  return commands.registerCommand(
    `vscode-template-generate-tool.openCustomLink${index}`,
    async () => {
      const configuration = workspace.getConfiguration()
      const customLink =
        configuration.get<string>(
          `vscode-template-generate-tool.customLink${index}`
        ) || ''
      if (customLink) {
        env.openExternal(Uri.parse(formatLink(customLink)))
      } else {
        await confirmOpenSettings(`自定义链接${index}未设置，是否去设置`)
      }
    }
  )
}

// 补全协议，避免没有协议时打开失败
function formatLink(link: string) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(link) ? link : `https://${link}`
}
