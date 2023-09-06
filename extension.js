const vscode = require('vscode')
let generatePanel = null

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const settingsDisposable = getDisposable('设置', 'settings', context)
  const formDisposable = getDisposable('表单生成', 'form', context)
  const tableDisposable = getDisposable('表格生成', 'table', context)
  const apiDisposable = getDisposable('API生成', 'api', context)

  const webDisposable = getWebDisposable(context)

  const docDisposable = getDocDisposable(
    '前端文档',
    'http://172.18.150.201:10012/frontend-docs/pc/dev-env',
    context
  )
  const componentDisposable = getDocDisposable(
    '前端组件库',
    'http://172.18.166.134:31034/frontend-component-doc/index.html#/changelog',
    context
  )
  const cssDisposable = getDocDisposable(
    '样式工具类',
    'http://172.18.150.201:10012/frontend-docs/pc/css-utils',
    context
  )

  context.subscriptions.push(
    settingsDisposable,
    formDisposable,
    tableDisposable,
    apiDisposable,
    webDisposable,
    docDisposable,
    componentDisposable,
    cssDisposable
  )
}

// 工具面板
function getDisposable(commandName, activeName, context) {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      if (generatePanel) {
        generatePanel.reveal(vscode.ViewColumn.Beside)
      } else {
        generatePanel = vscode.window.createWebviewPanel(
          'template-generate-tool',
          '模板代码生成工具',
          vscode.ViewColumn.Beside,
          {
            enableScripts: true,
            retainContextWhenHidden: true
          }
        )
        generatePanel.webview.html = _getWebviewContent(
          generatePanel.webview,
          context.extensionUri
        )
        generatePanel.webview.onDidReceiveMessage(
          async message => {
            switch (message.command) {
              case 'openWebsite':
                let panel = vscode.window.createWebviewPanel(
                  'template-generate-tool',
                  '参考文档',
                  vscode.ViewColumn.One,
                  {
                    enableScripts: true,
                    retainContextWhenHidden: true
                  }
                )
                panel.webview.html = loadDocument(message.website)
                panel.onDidDispose(
                  () => {
                    panel = null
                  },
                  null,
                  context.subscriptions
                )
                return
              case 'openExternalWebsite':
                vscode.env.openExternal(vscode.Uri.parse(message.website))
                return
              case 'openFolder':
                await vscode.commands.executeCommand(
                  'vscode.openFolder',
                  vscode.Uri.file(
                    `${vscode.workspace.workspaceFolders[0].uri.path}\\${message.folder}`
                  ),
                  {
                    forceNewWindow: true // 新窗口打开
                  }
                )
                return
              case 'openFile':
                await vscode.commands.executeCommand(
                  'vscode.openFolder',
                  vscode.Uri.file(
                    `${vscode.workspace.workspaceFolders[0].uri.path}\\${message.file}`
                  )
                )
                return
            }
          },
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

function _getWebviewContent(webview, extensionUri) {
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

// 浏览器面板
function getWebDisposable(context) {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.新建浏览器页签`,
    () => {
      let webPanel = vscode.window.createWebviewPanel(
        'template-generate-tool',
        '浏览器',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      )
      webPanel.webview.html = loadWebsite(
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

function loadWebsite(webview, extensionUri) {
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

// 文档面板
function getDocDisposable(commandName, url, context) {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      let docPanel = vscode.window.createWebviewPanel(
        'template-generate-tool',
        commandName,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      )
      docPanel.webview.html = loadDocument(url)
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

function loadDocument(url) {
  return /*html*/ `
  <!DOCTYPE html>
  <html lang="">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>文档</title>
    </head>
    <style>
      html,body,iframe{
        width:100%;
        height:100%;
        border:0;
        overflow: hidden;
        background-color: #fff;
      }
    </style>
    <body>
      <iframe src="${url}"/>
    </body>
  </html>
  `
}

function getUri(webview, extensionUri, pathList) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList))
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
