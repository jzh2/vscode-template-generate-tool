import {
  DefinitionProvider,
  TextDocument,
  Position,
  Definition,
  Range,
  Location,
  Uri,
  window
} from 'vscode'
import { parse, Expression, Property, SpreadElement } from 'acorn'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import { getProject } from './utils'

// Api定义实例
export class ApiDefinitionProvider implements DefinitionProvider {
  public async provideDefinition(
    document: TextDocument,
    position: Position
  ): Promise<Definition | undefined> {
    const range = document.getWordRangeAtPosition(position)
    if (!range) {
      return
    }
    const { line, character } = range.start
    const preMethodText =
      (line > 0 ? document.lineAt(line - 1).text.trim() : '') +
      document.getText(new Range(line, 0, line, character)).trim()
    if (
      !preMethodText.endsWith('$api.') && // $api.xxx中间可能有换行
      !preMethodText.endsWith('api-config="') &&
      !preMethodText.endsWith("method: '")
    ) {
      return
    }
    const methodText = document.getText(range)
    try {
      const { projectPath } = getProject(document.uri)
      const folderPath = join(projectPath, 'src', 'api')
      async function findMethodInFile(file: string): Promise<Location | void> {
        return new Promise(async resolve => {
          const filePath = join(folderPath, file)
          if (statSync(filePath).isDirectory()) {
            // 子文件夹找到任意一个也返回
            const subFiles = readdirSync(filePath)
            for (const subFile of subFiles) {
              const data = await findMethodInFile(join(file, subFile))
              if (data) {
                resolve(data)
                return
              }
            }
            resolve()
            return
          }
          const fileContent = readFileSync(filePath).toString()
          const ast = parse(fileContent, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            locations: true
          })
          const node = ast.body.find(
            item => item.type === 'ExportDefaultDeclaration'
          )
          if (
            node &&
            node.type === 'ExportDefaultDeclaration' &&
            node.declaration.type === 'ArrayExpression'
          ) {
            const { elements } = node.declaration
            for (const element of elements) {
              const data = await findMethodInElement(element, filePath)
              if (data) {
                resolve(data)
                return
              }
            }
          }
          resolve()
        })
      }
      async function findMethodInElement(
        element: Expression | SpreadElement | null,
        filePath: string
      ): Promise<Location | void> {
        return new Promise(async resolve => {
          if (element && element.type === 'ObjectExpression') {
            for (const property of element.properties) {
              const data = await findMethodInProperty(property, filePath)
              if (data) {
                resolve(data)
                return
              }
            }
          }
          resolve()
        })
      }
      async function findMethodInProperty(
        property: Property | SpreadElement,
        filePath: string
      ): Promise<Location | void> {
        return new Promise(async resolve => {
          if (
            property.type === 'Property' &&
            property.key.type === 'Identifier' &&
            property.key.name === 'method' &&
            property.value.type === 'Literal' &&
            property.value.value === methodText
          ) {
            const start = property.value.loc?.start
            if (start) {
              const { line, column } = start
              resolve(
                new Location(
                  Uri.file(filePath),
                  new Position(line - 1, column + 1)
                )
              )
              return
            }
          }
          resolve()
        })
      }
      const files = readdirSync(folderPath)
      for (const file of files) {
        const data = await findMethodInFile(file)
        if (data) {
          return data
        }
      }
    } catch (error) {
      window.showInformationMessage('项目内没有src/api文件夹')
    }
    return
  }
}
