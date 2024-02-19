import {
  ExtensionContext,
  WebviewPanel,
  commands,
  ViewColumn,
  window
} from 'vscode'
import { handleMessage, Message } from './handleMessage'
import { getGenerateContent } from './generateContent'

// 工具面板
export function getGenerateDisposable(
  commandName: string,
  activeName: string,
  context: ExtensionContext,
  generatePanel: WebviewPanel | null
) {
  return commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      if (generatePanel) {
        generatePanel.reveal(ViewColumn.Two)
      } else {
        generatePanel = window.createWebviewPanel(
          'template-generate-tool',
          '模板代码生成工具',
          ViewColumn.Two,
          {
            enableScripts: true,
            retainContextWhenHidden: true
          }
        )
        generatePanel.webview.html = getGenerateContent(
          generatePanel.webview,
          context.extensionUri
        )
        generatePanel.webview.onDidReceiveMessage(
          async (message: Message) => handleMessage(message, context),
          undefined,
          context.subscriptions
        )
        generatePanel.onDidDispose(
          () => {
            generatePanel = null
          },
          null,
          context.subscriptions
        )
      }
      generatePanel.webview.postMessage({ activeName })
    }
  )
}
