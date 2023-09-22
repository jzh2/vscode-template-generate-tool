import * as vscode from 'vscode'
let generatePanel: vscode.WebviewPanel | null
let generateWebviewView: vscode.WebviewView | null
let generateWebviewViewProvider: vscode.WebviewViewProvider | null

export function activate(context: vscode.ExtensionContext) {
  const configuration = vscode.workspace.getConfiguration()
  if (configuration.get('vscode-template-generate-tool.enableSidebar')) {
    // 注册生成侧边栏
    generateWebviewViewProvider = new GenerateWebviewViewProvider(context)
    const generateSidebarProviderDisposable =
      vscode.window.registerWebviewViewProvider(
        'vscode-template-generate-tool.generate-webview',
        generateWebviewViewProvider,
        {
          webviewOptions: {
            retainContextWhenHidden: true
          }
        }
      )
    // 注册快捷键，用于显示侧边栏
    const generateSidebarDisposable = getGenerateSidebarDisposable(context)
    context.subscriptions.push(
      generateSidebarProviderDisposable,
      generateSidebarDisposable
    )
  }

  if (configuration.get('vscode-template-generate-tool.enableGeneratePanel')) {
    const formDisposable = getGenerateDisposable('表单生成', 'form', context)
    const tableDisposable = getGenerateDisposable('表格生成', 'table', context)
    const apiDisposable = getGenerateDisposable('API生成', 'api', context)
    const settingsDisposable = getGenerateDisposable(
      '设置',
      'settings',
      context
    )
    context.subscriptions.push(
      formDisposable,
      tableDisposable,
      apiDisposable,
      settingsDisposable
    )
  }

  if (configuration.get('vscode-template-generate-tool.enableDocPanel')) {
    const docDisposable = getDocDisposable(
      '前端文档',
      'http://172.18.166.134:31034/frontend-docs/pc/dev-env',
      context
    )
    const componentDisposable = getDocDisposable(
      '前端组件库',
      'http://172.18.166.134:31034/frontend-component-doc/#/changelog',
      context
    )
    const cssDisposable = getDocDisposable(
      '样式工具类',
      'http://172.18.166.134:31034/frontend-docs/pc/css-utils',
      context
    )
    context.subscriptions.push(
      docDisposable,
      componentDisposable,
      cssDisposable
    )
  }

  if (configuration.get('vscode-template-generate-tool.enableWebPanel')) {
    const webDisposable = getWebDisposable(context)
    context.subscriptions.push(webDisposable)
  }

  const runoobDisposable = getRunoobDisposable()
  const elementDisposable = getElementDisposable()
  context.subscriptions.push(runoobDisposable, elementDisposable)
}

// 侧边栏实例
class GenerateWebviewViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _context: vscode.ExtensionContext) {}
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.html = getGenerateContent(
      webviewView.webview,
      this._context.extensionUri
    )
    webviewView.webview.onDidReceiveMessage(
      async message => handleMessage(message, this._context),
      undefined,
      this._context.subscriptions
    )
    webviewView.webview.options = {
      enableScripts: true
    }
    generateWebviewView = webviewView
  }
}
// 显示侧边栏
function getGenerateSidebarDisposable(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(
    'vscode-template-generate-tool.打开侧边栏',
    () => {
      // TODO 启动一次后才能用快捷键
      // if (!generateWebviewView) {
      //   generateWebviewViewProvider?.resolveWebviewView(
      //     generateWebviewView,
      //     context,
      //     new vscode.CancellationTokenSource()
      //   )
      // }
      generateWebviewView?.show()
    }
  )
}

// 工具面板
function getGenerateDisposable(
  commandName: string,
  activeName: string,
  context: vscode.ExtensionContext
) {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      if (generatePanel) {
        generatePanel.reveal(vscode.ViewColumn.Two)
      } else {
        generatePanel = vscode.window.createWebviewPanel(
          'template-generate-tool',
          '模板代码生成工具',
          vscode.ViewColumn.Two,
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
          async message => handleMessage(message, context),
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
// 工具内容
function getGenerateContent(webview: vscode.Webview, extensionUri: any) {
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
function getWebDisposable(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.新建浏览器页签`,
    () => {
      let webPanel: vscode.WebviewPanel | null =
        vscode.window.createWebviewPanel(
          'template-generate-tool',
          '浏览器',
          vscode.ViewColumn.One,
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
function getWebContent(webview: vscode.Webview, extensionUri: any) {
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
function getDocDisposable(
  commandName: string,
  url: string,
  context: vscode.ExtensionContext
) {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.${commandName}`,
    () => {
      let docPanel: vscode.WebviewPanel | null =
        vscode.window.createWebviewPanel(
          'template-generate-tool',
          commandName,
          vscode.ViewColumn.One,
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
// 文档内容
function getDocContent(url: string) {
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

// 菜鸟教程搜索
function getRunoobDisposable() {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.菜鸟教程搜索`,
    () => {
      const editor = vscode.window.activeTextEditor
      const selection = editor?.selection
      const selectedText = editor?.document.getText(selection)
      vscode.env.openExternal(
        vscode.Uri.parse(`https://www.runoob.com/?s=${selectedText}`)
      )
    }
  )
}

// Element搜索
function getElementDisposable() {
  return vscode.commands.registerCommand(
    `vscode-template-generate-tool.Element搜索`,
    () => {
      const editor = vscode.window.activeTextEditor
      const selection = editor?.selection
      const selectedText = editor?.document.getText(selection)
      vscode.env.openExternal(
        vscode.Uri.parse(
          `https://element.eleme.cn/#/zh-CN/component/${selectedText}`
        )
      )
    }
  )
}

interface Message {
  command: string
  website: string
  folder: string
  file: string
}
// 处理消息
async function handleMessage(
  message: Message,
  context: vscode.ExtensionContext
) {
  const workspaceFolders = vscode.workspace.workspaceFolders
  switch (message.command) {
    case 'openWebsite':
      let panel: vscode.WebviewPanel | null = vscode.window.createWebviewPanel(
        'template-generate-tool',
        '参考文档',
        vscode.ViewColumn.One,
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
      vscode.env.openExternal(vscode.Uri.parse(message.website))
      return
    case 'openFolder':
      if (workspaceFolders && workspaceFolders.length !== 0) {
        await vscode.commands.executeCommand(
          'vscode.openFolder',
          vscode.Uri.file(`${workspaceFolders[0].uri.path}\\${message.folder}`),
          {
            noRecentEntry: true,
            forceNewWindow: true
          }
        )
      }
      return
    case 'openFile':
      if (workspaceFolders && workspaceFolders.length !== 0) {
        await vscode.commands.executeCommand(
          'vscode.openFolder',
          vscode.Uri.file(`${workspaceFolders[0].uri.path}\\${message.file}`)
        )
      }
      return
  }
}

function getUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  pathList: string[]
) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList))
}
