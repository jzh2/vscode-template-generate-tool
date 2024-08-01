import { WebviewPanel, ExtensionContext, window, languages } from 'vscode'
import { GenerateWebviewViewProvider } from './GenerateWebviewViewProvider'
import { getGenerateDisposable } from './generateDisposable'
import { CopyFunctionHoverProvider } from './CopyFunctionHoverProvider'
import { FunctionDefinitionProvider } from './FunctionDefinitionProvider'
import { ApiDefinitionProvider } from './ApiDefinitionProvider'
import { ComponentDefinitionProvider } from './ComponentDefinitionProvider'
import { getComponentDocumentDisposable } from './componentDocumentDisposable'
import { getComponentImportDisposable } from './componentImportDisposable'
import { getDebuggerDisposable } from './debuggerDisposable'
import { getTerminalDisposable } from './terminalDisposable'
import { getRecentFileDisposable } from './recentFileDisposable'
import { getOpenGitRepositoryDisposable } from './openGitRepositoryDisposable'
import { getOpenLinkDisposable } from './openLinkDisposable'
import { getOpenFileDisposable } from './openFileDisposable'
import { getAddProxyDisposable } from './addProxyDisposable'
import { getDocDisposable } from './docDisposable'
import { getWebDisposable } from './webDisposable'
import { getSearchDisposable } from './searchDisposable'

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
  const availableLanguages = ['vue', 'javascript']
  const copyFunctionHoverProvider = new CopyFunctionHoverProvider(context)
  availableLanguages.forEach(language => {
    context.subscriptions.push(
      languages.registerHoverProvider(language, copyFunctionHoverProvider)
    )
  })

  // 查找函数定义
  const functionDefinitionProvider = new FunctionDefinitionProvider()
  context.subscriptions.push(
    languages.registerDefinitionProvider('vue', functionDefinitionProvider)
  )

  // 查找Api定义
  const apiDefinitionProvider = new ApiDefinitionProvider()
  availableLanguages.forEach(language => {
    context.subscriptions.push(
      languages.registerDefinitionProvider(language, apiDefinitionProvider)
    )
  })

  // 查找组件定义
  const peekFileDefinitionProvider = new ComponentDefinitionProvider()
  context.subscriptions.push(
    languages.registerDefinitionProvider('vue', peekFileDefinitionProvider)
  )

  // 打开组件文档
  context.subscriptions.push(getComponentDocumentDisposable())

  // 组件导入
  context.subscriptions.push(getComponentImportDisposable())

  // 切换断点
  context.subscriptions.push(getDebuggerDisposable())

  // 终端命令
  context.subscriptions.push(
    getTerminalDisposable('npmRunServe', 'npm run serve'),
    getTerminalDisposable('npmRunDev', 'npm run dev'),
    getTerminalDisposable('npmRunBuild', 'npm run build'),
    getTerminalDisposable('npmPublish', 'npm publish'),
    getTerminalDisposable('npmInstall', 'npm install'),
    getTerminalDisposable('gitPull', 'git pull'),
    getTerminalDisposable(
      'gitRemoteUpdateOriginP',
      'git remote update origin -p'
    )
  )

  // 自定义终端命令
  for (let i = 4; i <= 6; i++) {
    context.subscriptions.push(
      getTerminalDisposable(`customTerminal${i}`, '', i)
    )
  }

  // 打开最近文件
  context.subscriptions.push(getRecentFileDisposable())

  // 打开项目相关链接
  context.subscriptions.push(getOpenGitRepositoryDisposable())
  context.subscriptions.push(getOpenLinkDisposable('openJenkins'))
  context.subscriptions.push(getOpenLinkDisposable('openKubernetes2'))
  context.subscriptions.push(getOpenLinkDisposable('openKubernetes4'))

  // 打开指定文件
  context.subscriptions.push(
    getOpenFileDisposable('openProxy', 'vue.config.proxy.js'), // 本地代理
    getOpenFileDisposable('openModule', 'src/views/index.js'), // 组件库
    getOpenFileDisposable('openMenu', 'src/mock/menu.js'), // 菜单
    getOpenFileDisposable('openRoute', 'src/router/routes.js') // 路由
  )

  // 添加到本地代理
  context.subscriptions.push(getAddProxyDisposable())

  context.subscriptions.push(
    // 文档
    getDocDisposable(
      '前端文档',
      'http://172.18.166.139:31034/pc/dev-env',
      context
    ),
    getDocDisposable(
      '前端组件库',
      'http://172.18.166.139:31035/#/changelog',
      context
    ),
    getDocDisposable(
      '样式工具类',
      'http://172.18.166.139:31034/pc/css-utils',
      context
    ),
    // 浏览器
    getWebDisposable(context)
  )

  // 右键菜单搜索
  const searchPlatforms = [
    '百度',
    '必应',
    '谷歌',
    '菜鸟教程',
    'MDN',
    'ElementUI',
    'npmjs'
  ]
  searchPlatforms.forEach(searchPlatform => {
    context.subscriptions.push(getSearchDisposable(searchPlatform))
  })
}
