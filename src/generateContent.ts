import { Webview } from 'vscode'
import { getUri } from './uri'

// 工具内容
export function getGenerateContent(webview: Webview, extensionUri: any) {
  const scriptUri = getUri(webview, extensionUri, [
    'template-generate-tool',
    'dist',
    'js',
    'index.js'
  ])
  const chunkScriptUri = getUri(webview, extensionUri, [
    'template-generate-tool',
    'dist',
    'js',
    'chunk-vendors.js'
  ])
  const stylesUri = getUri(webview, extensionUri, [
    'template-generate-tool',
    'dist',
    'css',
    'index.css'
  ])
  const chunkStylesUri = getUri(webview, extensionUri, [
    'template-generate-tool',
    'dist',
    'css',
    'chunk-vendors.css'
  ])
  return /*html*/ `
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>template-generate-tool</title>
    <script defer="defer" src="${chunkScriptUri}"></script>
    <script defer="defer" src="${scriptUri}"></script>
    <link href="${chunkStylesUri}" rel="stylesheet" />
    <link href="${stylesUri}" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`
}
