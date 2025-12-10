import {
  ExtensionContext,
  commands,
  WebviewPanel,
  window,
  ViewColumn,
  Webview,
  workspace,
  TextDocument
} from 'vscode'
import { existsSync } from 'fs'
import { getUri } from './uri'
let mySchemaPanel: WebviewPanel | null = null
let currentDocument: TextDocument | undefined = undefined
let customHash = ''
let timeoutId: NodeJS.Timeout | null = null

// Schema面板
export function getSchemaWebviewDisposable(
  context: ExtensionContext,
  schemaPanel: WebviewPanel | null
) {
  return commands.registerCommand(
    `vscode-template-generate-tool.previewSchema`,
    () => {
      const document = window.activeTextEditor?.document
      currentDocument = document
      const fileName = document?.fileName
      if (schemaPanel) {
        schemaPanel.reveal(ViewColumn.Two)
        schemaPanel.title = getSchemaName(fileName)
        mySchemaPanel = schemaPanel
        customHash = ''
        postMessageSchema(document)
      } else {
        schemaPanel = window.createWebviewPanel(
          'template-generate-tool.schema',
          getSchemaName(fileName),
          ViewColumn.Two,
          {
            enableScripts: true,
            retainContextWhenHidden: true
          }
        )
        schemaPanel.webview.html = getWebContent(
          schemaPanel.webview,
          context.extensionUri
        )
        schemaPanel.onDidDispose(
          () => {
            schemaPanel = null
          },
          null,
          context.subscriptions
        )
        mySchemaPanel = schemaPanel
        postMessageSchema(document)
      }
    }
  )
}

// 监听Schema文件变化
export function updateSchemaDisposable() {
  return workspace.onDidSaveTextDocument(async e => {
    postMessageSchema(e)
  })
}

async function postMessageSchema(e: TextDocument | undefined) {
  if (!e || !mySchemaPanel) {
    return
  }
  let schema = ''
  let effects = ''
  if (isSchema(e.fileName)) {
    schema = e.getText()
    const effectsPath = e.fileName.replace('.json', '.js')
    if (existsSync(effectsPath)) {
      const effectsDoc = await workspace.openTextDocument(effectsPath)
      effects = effectsDoc.getText()
    }
  } else if (isEffects(e.fileName)) {
    effects = e.getText()
    const schemaPath = e.fileName.replace('.js', '.json')
    if (existsSync(schemaPath)) {
      const schemaDoc = await workspace.openTextDocument(schemaPath)
      schema = schemaDoc.getText()
    } else {
      window.showInformationMessage(`未找到对应的Schema文件：${schemaPath}`)
      return
    }
  } else {
    return
  }
  mySchemaPanel.title = getSchemaName(e.fileName)
  mySchemaPanel.webview.postMessage({
    command: 'previewSchema',
    schema,
    effects,
    fileName: e.fileName,
    website: getSchemaWebsite(e.fileName)
  })
}

// 刷新Schema面板
export function refreshSchemaWebviewDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.refreshSchema`,
    () => {
      if (mySchemaPanel) {
        const useCustomSchemaWebsite = workspace
          .getConfiguration()
          .get<boolean>('vscode-template-generate-tool.useCustomSchemaWebsite')
        if (
          useCustomSchemaWebsite &&
          (customHash === '' || customHash === 'zhfw')
        ) {
          postMessageSchema(currentDocument)
        } else {
          mySchemaPanel.webview.postMessage({
            command: 'refreshSchema'
          })
        }
      }
    }
  )
}
// 保存Schema内容
export function saveSchemaDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.saveSchema`,
    () => {
      if (mySchemaPanel) {
        mySchemaPanel.webview.postMessage({
          command: 'saveSchema'
        })
      }
    }
  )
}
// 切换到线上环境
export function toggleOnlineSchemaWebsiteDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.toggleOnlineSchemaWebsite`,
    async () => {
      await workspace
        .getConfiguration()
        .update(
          'vscode-template-generate-tool.useCustomSchemaWebsite',
          false,
          1
        )
      postMessageSchema(currentDocument)
      if (mySchemaPanel) {
        mySchemaPanel.webview.postMessage({
          command: 'refreshSchema'
        })
      }
    }
  )
}
// 切换到自定义环境
export function toggleCustomSchemaWebsiteDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.toggleCustomSchemaWebsite`,
    async () => {
      await workspace
        .getConfiguration()
        .update('vscode-template-generate-tool.useCustomSchemaWebsite', true, 1)
      customHash = ''
      postMessageSchema(currentDocument)
      if (mySchemaPanel) {
        mySchemaPanel.webview.postMessage({
          command: 'refreshSchema'
        })
      }
    }
  )
}

function isSchema(fileName: string) {
  return fileName.match(/\\(form|page).json$/)
}
function isEffects(fileName: string) {
  return fileName.match(/\\(form|page).js$/)
}
// 获取凭证编码
function getSchemaName(fileName: string | undefined) {
  if (!fileName) {
    return ''
  }
  const fileNameList = fileName.split('\\')
  if (fileNameList[fileNameList.length - 3] === '单据配置') {
    return fileNameList[fileNameList.length - 2]
  } else {
    return fileNameList[fileNameList.length - 3]
  }
}
// 获取Schema网址
function getSchemaWebsite(fileName: string | undefined) {
  if (!fileName) {
    return ''
  }
  const configuration = workspace.getConfiguration()
  const schemaWebsiteMap =
    configuration.get<Record<string, string>>(
      'vscode-template-generate-tool.schemaWebsiteMap'
    ) || {}
  const useCustomSchemaWebsite = configuration.get<boolean>(
    'vscode-template-generate-tool.useCustomSchemaWebsite'
  )
  const onlineSchemaWebsite =
    configuration.get<string>(
      'vscode-template-generate-tool.onlineSchemaWebsite'
    ) || ''
  const customSchemaWebsite =
    configuration.get<string>(
      'vscode-template-generate-tool.customSchemaWebsite'
    ) || ''
  const fileNameList = fileName.split('\\')
  let realHash = ''
  if (fileNameList[fileNameList.length - 2] === 'mobile') {
    realHash = schemaWebsiteMap['移动端'] || ''
  } else if (fileNameList[fileNameList.length - 3] === '单据配置') {
    realHash = schemaWebsiteMap['单据配置'] || ''
  } else {
    const key = fileNameList[fileNameList.length - 4]
    realHash = schemaWebsiteMap[key] || ''
  }
  let hash = ''
  if (useCustomSchemaWebsite) {
    // 自定义环境下，未登录hash会重定向到zhfw，刷新后才会访问realHash
    if (customHash === '') {
      customHash = 'zhfw'
    } else {
      customHash = realHash
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    timeoutId = setTimeout(() => {
      customHash = ''
      // token可能过期，自定义环境需要定时重定向到登录页
    }, 30 * 60 * 1000)
    hash = customHash
  } else {
    hash = realHash
  }
  return (
    (useCustomSchemaWebsite ? customSchemaWebsite : onlineSchemaWebsite) +
    '/#/' +
    hash
  )
}

// Schema内容
function getWebContent(webview: Webview, extensionUri: any) {
  const scriptUri = getUri(webview, extensionUri, [
    'template-generate-tool',
    'dist',
    'js',
    'preview-schema.js'
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
    'preview-schema.css'
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
    <title>preview-schema</title>
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
