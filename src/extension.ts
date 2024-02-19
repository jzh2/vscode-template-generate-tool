import { WebviewPanel, ExtensionContext, window, languages } from 'vscode'

import { GenerateWebviewViewProvider } from './GenerateWebviewViewProvider'
import { getGenerateDisposable } from './generateDisposable'
import { CopyMethodHoverProvider } from './CopyMethodHoverProvider'
import { getTerminalDisposable } from './terminalDisposable'
import { getDocDisposable } from './docDisposable'
import { getWebDisposable } from './webDisposable'
import {
  getRunoobDisposable,
  getMdnDisposable,
  getElementDisposable
} from './searchDisposable'

let generatePanel: WebviewPanel | null

export function activate(context: ExtensionContext) {
  // 侧边栏
  const generateWebviewViewProvider = new GenerateWebviewViewProvider(context)
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      'vscode-template-generate-tool.generate-webview',
      generateWebviewViewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  )

  // 面板快捷键
  context.subscriptions.push(
    getGenerateDisposable('表单生成', 'form', context, generatePanel),
    getGenerateDisposable('表格生成', 'table', context, generatePanel),
    getGenerateDisposable('API生成', 'api', context, generatePanel),
    getGenerateDisposable('设置', 'settings', context, generatePanel)
  )

  // 函数悬浮时复制按钮
  const availableLanguages = ['vue', 'javascript', 'typescript']
  const copyMethodHoverProvider = new CopyMethodHoverProvider(context)
  availableLanguages.forEach(language => {
    context.subscriptions.push(
      languages.registerHoverProvider(language, copyMethodHoverProvider)
    )
  })

  // 终端命令
  context.subscriptions.push(
    getTerminalDisposable('npmRunServe', 'npm run serve'),
    getTerminalDisposable('npmRunDev', 'npm run dev'),
    getTerminalDisposable('npmRunBuild', 'npm run build'),
    getTerminalDisposable('npmPublish', 'npm publish')
  )

  // 自定义终端命令
  for (let i = 1; i <= 3; i++) {
    context.subscriptions.push(
      getTerminalDisposable(`customTerminal${i}`, '', i)
    )
  }

  context.subscriptions.push(
    // 文档
    getDocDisposable(
      '前端文档',
      'http://172.18.166.134:31034/frontend-docs/pc/dev-env',
      context
    ),
    getDocDisposable(
      '前端组件库',
      'http://172.18.166.134:31034/frontend-component-doc/#/changelog',
      context
    ),
    getDocDisposable(
      '样式工具类',
      'http://172.18.166.134:31034/frontend-docs/pc/css-utils',
      context
    ),
    // 浏览器
    getWebDisposable(context),
    // 搜索右键菜单
    getRunoobDisposable(),
    getMdnDisposable(),
    getElementDisposable()
  )
}