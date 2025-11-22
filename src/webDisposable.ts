import {
  ExtensionContext,
  commands,
  WebviewPanel,
  window,
  ViewColumn,
  Webview
} from 'vscode'
import { getUri } from './uri'

// 浏览器面板
export function getWebDisposable(context: ExtensionContext) {
  return commands.registerCommand(
    `vscode-template-generate-tool.新建浏览器页签`,
    () => {
      let webPanel: WebviewPanel | null = window.createWebviewPanel(
        'template-generate-tool.web',
        '浏览器',
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      )
      webPanel.webview.html = getWebContent(
        webPanel.webview,
        context.extensionUri
      )
      webPanel.onDidDispose(
        () => {
          webPanel = null
        },
        null,
        context.subscriptions
      )
    }
  )
}

// 浏览器内容
function getWebContent(webview: Webview, extensionUri: any) {
  const scriptUri = getUri(webview, extensionUri, [
    'template-generate-tool',
    'dist',
    'js',
    'star-website.js'
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
    'star-website.css'
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
    <title>star-website</title>
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
