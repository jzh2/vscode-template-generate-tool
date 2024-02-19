import {
  ExtensionContext,
  commands,
  WebviewPanel,
  window,
  ViewColumn
} from 'vscode'
import { getDocContent } from './docContent'

// 文档面板
export function getDocDisposable(
  commandName: string,
  url: string,
  context: ExtensionContext
) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      let docPanel: WebviewPanel | null = window.createWebviewPanel(
        'template-generate-tool',
        commandName,
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      )
      docPanel.webview.html = getDocContent(url)
      docPanel.onDidDispose(
        () => {
          docPanel = null
        },
        null,
        context.subscriptions
      )
    }
  )
}
