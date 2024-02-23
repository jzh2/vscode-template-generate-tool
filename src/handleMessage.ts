import {
  ExtensionContext,
  workspace,
  WebviewPanel,
  window,
  ViewColumn,
  env,
  Uri,
  commands
} from 'vscode'
import { getDocContent } from './docContent'
import { join } from 'path'

// 处理消息
export async function handleMessage(
  message: Message,
  context: ExtensionContext
) {
  const workspaceFolders = workspace.workspaceFolders
  switch (message.command) {
    case 'openWebsite':
      let panel: WebviewPanel | null = window.createWebviewPanel(
        'template-generate-tool',
        '参考文档',
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      )
      panel.webview.html = getDocContent(message.website)
      panel.onDidDispose(
        () => {
          panel = null
        },
        null,
        context.subscriptions
      )
      return
    case 'openExternalWebsite':
      env.openExternal(Uri.parse(message.website))
      return
    case 'openFolder':
      if (workspaceFolders && workspaceFolders.length !== 0) {
        await commands.executeCommand(
          'vscode.openFolder',
          Uri.file(join(workspaceFolders[0].uri.path, message.folder)),
          {
            noRecentEntry: true,
            forceNewWindow: true
          }
        )
      }
      return
    case 'openFile':
      if (workspaceFolders && workspaceFolders.length !== 0) {
        await commands.executeCommand(
          'vscode.openFolder',
          Uri.file(join(workspaceFolders[0].uri.path, message.file))
        )
      }
      return
  }
}

export interface Message {
  command: string
  website: string
  folder: string
  file: string
}
