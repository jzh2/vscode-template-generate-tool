import {
  ExtensionContext,
  WebviewPanel,
  window,
  ViewColumn,
  env,
  Uri,
  commands
} from 'vscode'
import { getDocContent } from './docContent'
import { join } from 'path'
import { getProject } from './utils'

// 处理消息
export async function handleMessage(
  message: Message,
  context: ExtensionContext
) {
  if (!window.activeTextEditor) {
    return
  }
  const { projectPath } = getProject(window.activeTextEditor.document.uri)
  switch (message.command) {
    case 'openWebsite':
      let panel: WebviewPanel | null = window.createWebviewPanel(
        'template-generate-tool.reference',
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
      if (projectPath) {
        await commands.executeCommand(
          'vscode.openFolder',
          Uri.file(join(projectPath, message.folder)),
          {
            noRecentEntry: true,
            forceNewWindow: true
          }
        )
      }
      return
    case 'openFile':
      if (projectPath) {
        await commands.executeCommand(
          'vscode.openFolder',
          Uri.file(join(projectPath, message.file))
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
