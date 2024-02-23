import {
  DefinitionProvider,
  ExtensionContext,
  TextDocument,
  Position,
  Definition,
  Range,
  workspace,
  Location,
  Uri,
  window
} from 'vscode'
import { parse, Expression, Property, SpreadElement } from 'acorn'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

// Api定义实例
export class ApiDefinitionProvider implements DefinitionProvider {
  public async provideDefinition(
    document: TextDocument,
    position: Position
  ): Promise<Definition | null> {
    const range = document.getWordRangeAtPosition(position)
    if (!range) {
      return null
    }
    const { line, character } = range.start
    const preMethodText = document.getText(
      new Range(line, character - 5, line, character)
    )
    if (preMethodText !== '$api.') {
      return null
    }
    const workspaceFolder = workspace.workspaceFolders?.find(item =>
      document.uri.path.includes(item.uri.path)
    )?.uri.fsPath
    if (!workspaceFolder) {
      return null
    }
    const methodText = document.getText(range)
    try {
      const folderPath = join(workspaceFolder, 'src', 'api')
      const files = readdirSync(folderPath)
      async function findMethodInFile(file: string): Promise<Location | void> {
        return new Promise(async resolve => {
          if (!workspaceFolder) {
            resolve()
            return
          }
          const filePath = join(folderPath, file)
          if (!statSync(filePath).isFile()) {
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
      for (const file of files) {
        const data = await findMethodInFile(file)
        if (data) {
          return data
        }
      }
    } catch (error) {
      window.showInformationMessage('项目内没有src/api文件夹')
    }
    return null
  }
}
