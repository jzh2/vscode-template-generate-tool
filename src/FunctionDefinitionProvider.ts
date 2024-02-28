import {
  DefinitionProvider,
  TextDocument,
  Position,
  Definition,
  Location,
  Uri,
  Range,
  commands
} from 'vscode'
import { parse, FunctionExpression } from 'acorn'
import { simple } from 'acorn-walk'
import { parse as parse5 } from 'parse5'
import {
  Node,
  Element,
  Document,
  DocumentFragment,
  Template,
  TextNode
} from 'parse5/dist/tree-adapters/default'

// Api定义实例
export class FunctionDefinitionProvider implements DefinitionProvider {
  private attrRangeList: Range[] = []

  public async provideDefinition(
    document: TextDocument,
    position: Position
  ): Promise<Definition | undefined> {
    const range = document.getWordRangeAtPosition(position)
    if (!range) {
      return
    }
    const ast = parse5(document.getText(), {
      sourceCodeLocationInfo: true
    })
    this.findNodeWithAttribute(ast)
    if (!this.attrRangeList.some(item => item.contains(range))) {
      return
    }
    const functionNameText = document.getText(range)
    commands.executeCommand('editor.actions.findWithArgs', {
      searchString: functionNameText,
      isCaseSensitive: true,
      matchWholeWord: true
    })
    const definition: Location[] = []
    // 获取script中的函数开始位置
    function getJsFunctionStart(script: { text: string; startLine: number }) {
      const { text, startLine } = script
      const ast = parse(text, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
      })
      function getNodeStart(node: FunctionExpression) {
        if (node.loc) {
          const { line, column } = node.loc.start
          const scriptFunctionNameRange = document.getWordRangeAtPosition(
            new Position(startLine + line - 2, column)
          )
          if (
            scriptFunctionNameRange &&
            document.getText(scriptFunctionNameRange) === functionNameText
          ) {
            definition.push(
              new Location(
                Uri.file(document.uri.path),
                scriptFunctionNameRange.start
              )
            )
          }
        }
      }
      simple(ast, {
        FunctionExpression: node => getNodeStart(node)
      })
    }
    getScriptTextAndStartLine(ast).map(getJsFunctionStart)
    return definition
  }
  // 获取@属性的范围
  private findNodeWithAttribute(node: Node) {
    if (isElement(node)) {
      const attrs = node.sourceCodeLocation?.attrs
      for (const key in attrs) {
        // 不用hasOwnProperty，因为attrs是Record类型，不会有原型链上的额外属性
        if (key.startsWith('@')) {
          const location = attrs[key]
          this.attrRangeList.push(
            new Range(
              location.startLine - 1,
              location.startCol,
              location.endLine - 1,
              location.endCol
            )
          )
        }
      }
    }
    if (hasChildNodes(node)) {
      for (const childNode of node.childNodes) {
        this.findNodeWithAttribute(childNode)
      }
    }
    if (isTemplate(node)) {
      for (const childNode of node.content.childNodes) {
        this.findNodeWithAttribute(childNode)
      }
    }
  }
}
// 获取script的内容和起始行
export function getScriptTextAndStartLine(
  node: Document
): { text: string; startLine: number }[] {
  const scriptList: { text: string; startLine: number }[] = []
  const htmlNode = node.childNodes[0]
  if (!isElement(htmlNode)) {
    return []
  }
  const headNode = htmlNode.childNodes[0]
  if (!isElement(headNode)) {
    return []
  }
  for (const childNode of headNode.childNodes) {
    if (childNode.nodeName === 'script') {
      const textNode = childNode.childNodes[0]
      if (!isTextNode(textNode) || !textNode.sourceCodeLocation) {
        continue
      }
      scriptList.push({
        text: textNode.value,
        startLine: textNode.sourceCodeLocation.startLine
      })
    }
  }
  return scriptList
}
function isElement(node: Node): node is Element {
  return (node as Element).attrs !== undefined
}
function isTemplate(node: Node): node is Template {
  return (node as Template).content !== undefined
}
function isTextNode(node: Node): node is TextNode {
  return (node as TextNode).value !== undefined
}
function hasChildNodes(
  node: Node
): node is Element | Document | DocumentFragment {
  return (
    (node as Element | Document | DocumentFragment).childNodes !== undefined
  )
}
