import {
  commands,
  window,
  Position,
  Selection,
  TextEditorRevealType
} from 'vscode'
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
      getScriptTextAndStartLine(ast).map(insertStatementAtScript)
    }
  )
}

// 转大驼峰
function toPascalCase(componentName: string) {
  return componentName
    .replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase())
    .replace(/^\w/, c => c.toUpperCase())
  // const camelCase = componentName.replace(/-([a-z])/g, (_match, letter) =>
  //   letter.toUpperCase()
  // )
}

// 转小驼峰
function toCamelCase(componentName: string) {
  return componentName.replace(/-([a-z])/g, (_match, letter) =>
    letter.toUpperCase()
  )
}

// 插入语句
function insertStatementAtScript(script: { text: string; startLine: number }) {
  const { text, startLine } = script
  const ast = parse(text, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true
  })
  function insertStatementAtDeclaration(node: ExportDefaultDeclaration) {
    if (node.loc) {
      const exportStartLine = node.loc.start.line
      if (node.declaration.type === 'ObjectExpression') {
        // components
        const componentsNode = node.declaration.properties.find(
          item =>
            item.type === 'Property' &&
            item.key.type === 'Identifier' &&
            item.key.name === 'components'
        )
        const pascalCaseComponentName = toPascalCase(componentName)
        let componentInsertPosition: Position, componentInsertValue: string
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
              componentInsertPosition = new Position(
                startLine + componentsEndLine! - 2,
                componentsEndColumn! - 1
              )
              componentInsertValue = ` ${pascalCaseComponentName} `
            } else {
              // components不是空的
              componentInsertPosition = new Position(
                startLine + componentsEndLine! - 2,
                componentsEndColumn! - 2
              )
              componentInsertValue = `, ${pascalCaseComponentName}`
            }
          } else {
            // components不在一行
            componentInsertPosition = new Position(
              startLine + componentsEndLine! - 3,
              1000
            )
            componentInsertValue = `,\n    ${pascalCaseComponentName}`
          }
        } else {
          // 没有components
          componentInsertPosition = new Position(
            startLine + exportStartLine - 1,
            0
          )
          componentInsertValue = `  components: {\n    ${pascalCaseComponentName}\n  },\n`
        }
        let dataInsertPosition: Position, dataInsertValue: string
        // data
        if (componentName.endsWith('-dialog')) {
          const camelCaseComponentName = toCamelCase(componentName)
          const dataNode = node.declaration.properties.find(
            item =>
              item.type === 'Property' &&
              item.key.type === 'Identifier' &&
              item.key.name === 'data'
          )
          if (dataNode) {
            // 有data
            const dataStartLine = dataNode.loc?.start.line
            const dataEndLine = dataNode.loc?.end.line
            if (dataStartLine === dataEndLine) {
              // 没有return
              dataInsertPosition = new Position(
                startLine + dataEndLine! - 2,
                10
              )
              dataInsertValue = `
    return {
      ${camelCaseComponentName}: {
        data: {},
        mode: 1,
        show: false
      }
    }
  `
            } else if (dataEndLine! - dataStartLine! === 2) {
              // 有return没数据
              dataInsertPosition = new Position(
                startLine + dataEndLine! - 3,
                12
              )
              dataInsertValue = `
      ${camelCaseComponentName}: {
        data: {},
        mode: 1,
        show: false
      }
    `
            } else {
              // 有return有数据
              dataInsertPosition = new Position(
                startLine + dataEndLine! - 4,
                1000
              )
              dataInsertValue = `,
      ${camelCaseComponentName}: {
        data: {},
        mode: 1,
        show: false
      }`
            }
          } else {
            // 没有data
            dataInsertPosition = new Position(
              startLine + exportStartLine - 1,
              0
            )
            dataInsertValue = `  data() {
    return {
      ${camelCaseComponentName}: {
        data: {},
        mode: 1,
        show: false
      }
    }
  },\n`
          }
        }
        window.activeTextEditor!.edit(editBuilder => {
          editBuilder.insert(
            new Position(startLine + exportStartLine - 2, 0),
            `import ${pascalCaseComponentName} from './${componentName}.vue'\n\n`
          )
          editBuilder.insert(componentInsertPosition, componentInsertValue)
          if (dataInsertValue) {
            editBuilder.insert(dataInsertPosition, dataInsertValue)
          }
        })
        const editor = window.activeTextEditor
        if (editor) {
          editor.selection = new Selection(
            startLine + exportStartLine - 2,
            pascalCaseComponentName.length + 14,
            startLine + exportStartLine - 2,
            pascalCaseComponentName.length + 14
          )
          editor.revealRange(editor.selection, TextEditorRevealType.InCenter)
        }
      }
    }
  }
  simple(ast, {
    ExportDefaultDeclaration: node => insertStatementAtDeclaration(node)
  })
}
