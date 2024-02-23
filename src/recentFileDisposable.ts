import { commands, Uri, window } from 'vscode'
import { execSync } from 'child_process'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
export function getRecentFileDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.openRecentFile`,
    async uri => {
      let gitFiles: string[] = []
      try {
        gitFiles = execSync(`git status -s`, { cwd: uri.fsPath })
          .toString()
          .split('\n')
          .slice(0, -1)
          .filter(item => !/^(D.|.D) /.test(item))
          .map(item =>
            item
              .slice(3)
              .replace(/.+ -> /, '')
              .replace(/"/g, '')
          )
          .filter(item => !item.startsWith('../') && !item.endsWith('/'))
      } catch (error) {}
      if (gitFiles.length > 0) {
        // 按顺序优先打开views、pages、src文件夹内文件
        let gitFile = gitFiles[0]
        const keywords = ['views/', 'pages/', 'src/']
        for (let keyword of keywords) {
          const file = gitFiles.find(file => file.includes(keyword))
          if (file) {
            gitFile = file
            break
          }
        }
        await commands.executeCommand(
          'vscode.openFolder',
          Uri.file(join(uri.path, gitFile))
        )
      } else {
        // 找出文件夹内第一个文件
        function findFirstFileInFolder(folderPath: string): string | null {
          try {
            const files = readdirSync(folderPath)
            for (let file of files) {
              const filePath = join(folderPath, file)
              const stat = statSync(filePath)
              if (stat.isFile()) {
                return filePath
              } else if (stat.isDirectory()) {
                const firstFileInSubFolder = findFirstFileInFolder(filePath)
                if (firstFileInSubFolder) {
                  return firstFileInSubFolder
                }
              }
            }
            return null
          } catch (error) {
            return null
          }
        }
        const dirFile = findFirstFileInFolder(uri.fsPath)
        if (dirFile) {
          // 先找src
          const srcFile = findFirstFileInFolder(join(uri.fsPath, 'src'))
          if (srcFile) {
            // src里找views
            const viewsFile = findFirstFileInFolder(
              join(uri.fsPath, 'src', 'views')
            )
            if (viewsFile) {
              await commands.executeCommand(
                'vscode.openFolder',
                Uri.file(viewsFile),
                {
                  noRecentEntry: true,
                  forceNewWindow: false
                }
              )
            } else {
              await commands.executeCommand(
                'vscode.openFolder',
                Uri.file(srcFile),
                {
                  noRecentEntry: true,
                  forceNewWindow: false
                }
              )
            }
          } else {
            // 再找pages
            const pagesFile = findFirstFileInFolder(join(uri.fsPath, 'pages'))
            if (pagesFile) {
              await commands.executeCommand(
                'vscode.openFolder',
                Uri.file(pagesFile),
                {
                  noRecentEntry: true,
                  forceNewWindow: false
                }
              )
            } else {
              await commands.executeCommand(
                'vscode.openFolder',
                Uri.file(dirFile),
                {
                  noRecentEntry: true,
                  forceNewWindow: false
                }
              )
            }
          }
        } else {
          window.showInformationMessage('文件夹是空的')
        }
      }
    }
  )
}
