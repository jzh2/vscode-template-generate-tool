import { commands, env, window, Uri } from 'vscode'
import * as path from 'path'

const certFolderReg = /^(.+)_([^_]+)$/

// 从路径自身开始逐级向上查找凭证编码文件夹，返回编码
function findCertCode(targetPath: string): string | null {
  let current = targetPath
  while (true) {
    const match = certFolderReg.exec(path.basename(current))
    if (match) {
      return match[2]
    }
    const parent = path.dirname(current)
    if (parent === current) {
      return null
    }
    current = parent
  }
}

// 复制凭证编码
export function getCopyCertCodeDisposable() {
  return commands.registerCommand(
    'vscode-template-generate-tool.copyCertCode',
    async (uri: Uri) => {
      const targetPath =
        uri?.fsPath || window.activeTextEditor?.document.uri.fsPath
      if (!targetPath) {
        window.showInformationMessage('未找到文件路径')
        return
      }
      const certCode = findCertCode(targetPath)
      if (!certCode) {
        window.showInformationMessage(`未在路径中找到凭证编码${targetPath}`)
        return
      }
      await env.clipboard.writeText(certCode)
      window.showInformationMessage(`已复制凭证编码：${certCode}`)
    }
  )
}
