import { commands, env, Uri, window } from 'vscode'
import { execSync } from 'child_process'
import { statSync } from 'fs'
import { dirname } from 'path'

// 打开Git仓库
export function getOpenGitRepositoryDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.openGitRepository`,
    async (uri: Uri) => {
      try {
        const { fsPath } = uri
        const cwd = statSync(fsPath).isDirectory() ? fsPath : dirname(fsPath)
        const url = execSync(`git remote get-url origin`, {
          cwd
        })
          .toString()
          .trim()
        env.openExternal(Uri.parse(url))
      } catch (error) {
        window.showInformationMessage('没有找到Git仓库')
      }
    }
  )
}
