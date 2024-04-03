import { commands, workspace, window, Range, Position } from 'vscode'

// 切换断点
export function getDebuggerDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.toggleDebugger`,
    () => {
      if (
        !workspace
          .getConfiguration()
          .get<boolean>(`vscode-template-generate-tool.enableToggleDebugger`)
      ) {
        return
      }
      const editor = window.activeTextEditor
      if (!editor) {
        return
      }
      const line = editor.selection.active.line
      const lineText = editor.document.lineAt(line).text
      if (lineText.trim() === 'debugger') {
        editor.edit(editBuilder => {
          editBuilder.delete(new Range(line, 0, line + 1, 0))
        })
      } else {
        // 复制上一行前缀空格
        const preLineText = editor.document.lineAt(line > 0 ? line - 1 : 0).text
        const match = preLineText.match(/^\s*/)
        const preSpace = match ? match[0] : ''
        editor.edit(editBuilder => {
          editBuilder.insert(new Position(line, 0), `${preSpace}debugger\n`)
        })
      }
    }
  )
}
