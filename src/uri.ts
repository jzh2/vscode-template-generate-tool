import { Webview, Uri } from 'vscode'

// 资源Uri
export function getUri(
  webview: Webview,
  extensionUri: Uri,
  pathList: string[]
) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList))
}
