import { WebviewViewProvider, ExtensionContext, WebviewView } from 'vscode'
import { handleMessage, Message } from './handleMessage'
import { getGenerateContent } from './generateContent'

// 侧边栏实例
export class GenerateWebviewViewProvider implements WebviewViewProvider {
  constructor(private readonly _context: ExtensionContext) {}
  public resolveWebviewView(webviewView: WebviewView) {
    webviewView.webview.html = getGenerateContent(
      webviewView.webview,
      this._context.extensionUri
    )
    webviewView.webview.onDidReceiveMessage(
      async (message: Message) => handleMessage(message, this._context),
      undefined,
      this._context.subscriptions
    )
    webviewView.webview.options = {
      enableScripts: true
    }
  }
}
