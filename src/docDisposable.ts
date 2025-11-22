import {
  ExtensionContext,
  commands,
  workspace,
  env,
  Uri,
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
      if (
        workspace
          .getConfiguration()
          .get<string>(`vscode-template-generate-tool.docOpenMode`) ===
        'external'
      ) {
        env.openExternal(Uri.parse(url))
        return
      }
      let docPanel: WebviewPanel | null = window.createWebviewPanel(
        'template-generate-tool.doc',
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
