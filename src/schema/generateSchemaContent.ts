import { Webview } from 'vscode'

import { Uri } from 'vscode'

// 资源Uri
export function getUri(
  webview: Webview,
  extensionUri: Uri,
  pathList: string[]
) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList))
}
// 工具内容
export function getSchemaGenerateContent(webview: Webview, extensionUri: any) {
  const scriptUri = getUri(webview, extensionUri, [
    'preview-schema',
    'dist',
    'assets',
    'index.js'
  ])
  const stylesUri = getUri(webview, extensionUri, [
    'preview-schema',
    'dist',
    'assets',
    'index.css'
  ])
  return /*html*/ `
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>preview-schema</title>
    <script defer="defer" src="${scriptUri}"></script>
    <link href="${stylesUri}" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`
}
