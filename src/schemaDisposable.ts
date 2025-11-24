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

// Schema面板
export function getSchemaWebviewDisposable(
  context: ExtensionContext,
  schemaPanel: WebviewPanel | null
) {
  return commands.registerCommand(
    `vscode-template-generate-tool.previewSchema`,
    () => {
      const document = window.activeTextEditor?.document
      const fileName = document?.fileName
      if (schemaPanel) {
        schemaPanel.reveal(ViewColumn.Two)
        schemaPanel.title = getSchemaName(fileName)
        mySchemaPanel = schemaPanel
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
  return fileNameList[fileNameList.length - 3]
}
// 获取Schema网址
function getSchemaWebsite(fileName: string | undefined) {
  if (!fileName) {
    return ''
  }
  const schemaWebsiteMap =
    workspace
      .getConfiguration()
      .get<Record<string, string>>(
        'vscode-template-generate-tool.schemaWebsiteMap'
      ) || {}
  const fileNameList = fileName.split('\\')
  const key = fileNameList[fileNameList.length - 4]
  return schemaWebsiteMap[key] || ''
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
