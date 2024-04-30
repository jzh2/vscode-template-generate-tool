import { commands, window, Position } from 'vscode'
import { parse, ExportDefaultDeclaration } from 'acorn'
import { simple } from 'acorn-walk'
import { parse as parse5 } from 'parse5'
import { getScriptTextAndStartLine } from './FunctionDefinitionProvider'

// 组件导入
let componentName: string
export function getComponentImportDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.componentImport`,
    () => {
      const editor = window.activeTextEditor
      if (!editor) {
        return
      }
      const { line, character } = editor.selection.active
      // 获取组件名
      const lineText = editor.document.lineAt(line).text
      // 从光标开始，往前后搜索
      const lineText1 =
        (lineText.slice(0, character).split(/\s/).pop() ?? '')
          .split('>')
          .pop() ?? ''
      const lineText2 = lineText.slice(character).split(/\s/)[0].split('>')[0]
      if (!lineText1.startsWith('<')) {
        return
      }
      componentName =
        lineText1.slice(lineText1.indexOf('/') === 1 ? 2 : 1) + lineText2
      if (!/^[\w-]+$/.test(componentName)) {
        return
      }
      const { document } = editor

      const ast = parse5(document.getText(), {
        sourceCodeLocationInfo: true
      })
      getScriptTextAndStartLine(ast).map(getJsFunctionStart)
    }
  )
}

function toPascalCase(componentName: string) {
  return componentName
    .replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase())
  // const camelCase = componentName.replace(/-([a-z])/g, (_match, letter) =>
  //   letter.toUpperCase()
  // )
}

// 获取script中的函数开始位置
function getJsFunctionStart(script: { text: string; startLine: number }) {
  const { text, startLine } = script
  const ast = parse(text, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true
  })
  function getNodeStart(node: ExportDefaultDeclaration) {
    if (node.loc) {
      const exportStartLine = node.loc.start.line
      if (node.declaration.type === 'ObjectExpression') {
        const componentsNode = node.declaration.properties.find(
          item =>
            item.type === 'Property' &&
            item.key.type === 'Identifier' &&
            item.key.name === 'components'
        )
        let insertPosition: Position, insertValue: string
        if (componentsNode) {
          const componentsStartLine = componentsNode.loc?.start.line
          const componentsEndLine = componentsNode.loc?.end.line
          if (componentsStartLine === componentsEndLine) {
            // components在一行
            const componentsEndColumn = componentsNode.loc?.end.column
            if (
              componentsNode.type === 'Property' &&
              componentsNode.value.type === 'ObjectExpression' &&
              componentsNode.value.properties.length === 0
            ) {
              // components是空的
              insertPosition = new Position(
                startLine + componentsEndLine! - 2,
                componentsEndColumn! - 1
              )
              insertValue = ` ${toPascalCase(componentName)} `
            } else {
              // components不是空的
              insertPosition = new Position(
                startLine + componentsEndLine! - 2,
                componentsEndColumn! - 2
              )
              insertValue = `, ${toPascalCase(componentName)}`
            }
          } else {
            // components不在一行
            insertPosition = new Position(
              startLine + componentsEndLine! - 3,
              1000
            )
            insertValue = `,\n    ${toPascalCase(componentName)}`
          }
        } else {
          // 没有components
          insertPosition = new Position(startLine + exportStartLine - 1, 0)
          insertValue = `  components: {\n    ${toPascalCase(
            componentName
          )}\n  },\n`
        }
        window.activeTextEditor!.edit(editBuilder => {
          editBuilder.insert(
            new Position(startLine + exportStartLine - 2, 0),
            `import ${toPascalCase(
              componentName
            )} from './${componentName}.vue'\n\n`
          )
          editBuilder.insert(insertPosition, insertValue)
        })
      }
    }
  }
  simple(ast, {
    ExportDefaultDeclaration: node => getNodeStart(node)
  })
}
