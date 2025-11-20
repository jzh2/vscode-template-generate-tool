import {
  ExtensionContext,
  WebviewPanel,
  commands,
  ViewColumn,
  window
} from 'vscode'
import { handleMessage, Message } from '../handleMessage'
import { getSchemaGenerateContent } from './generateSchemaContent'

// 工具面板
export function getGenerateSchemaDisposable(
  context: ExtensionContext,
  generatePanel: WebviewPanel | null
) {
  return commands.registerCommand(
    `vscode-template-generate-tool.previewSchema`,
    () => {
      if (generatePanel) {
        generatePanel.reveal(ViewColumn.Two)
      } else {
        generatePanel = window.createWebviewPanel(
          'preview-schema',
          '预览Schema',
          ViewColumn.Two,
          {
            enableScripts: true,
            retainContextWhenHidden: true
          }
        )
        generatePanel.webview.html = getSchemaGenerateContent(
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
    }
  )
}
