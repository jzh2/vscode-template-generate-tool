import {
  HoverProvider,
  TextDocument,
  ExtensionContext,
  commands,
  Position,
  ProviderResult,
  Hover,
  Range,
  MarkdownString,
  window,
  Selection,
  env,
  workspace
} from 'vscode'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'
import { Project, Node } from 'ts-morph'

// 复制函数悬浮实例
export class CopyMethodHoverProvider implements HoverProvider {
  private _document!: TextDocument

  constructor(private context: ExtensionContext) {
    // 注册复制函数命令
    context.subscriptions.push(
      commands.registerCommand(
        'vscode-template-generate-tool.copyFunction',
        this.copyFunction,
        this
      )
    )
  }

  public provideHover(
    document: TextDocument,
    position: Position
  ): ProviderResult<Hover> {
    this._document = document
    let hover: Hover | undefined
    const ranges = this.getMethodRange(document)
    ranges.map((range: Range) => {
      const { start } = range
      const startRange = new Range(start, new Position(start.line, 1000))
      // 只在函数开头悬停显示按钮
      if (startRange.contains(position)) {
        const contents = new MarkdownString()
        contents.isTrusted = true
        contents.appendMarkdown(
          `[复制函数](command:vscode-template-generate-tool.copyFunction?${encodeURIComponent(
            JSON.stringify({
              range
            })
          )})`
        )
        hover = new Hover(contents, startRange)
      }
    })
    return hover
  }

  public async copyFunction(args: any) {
    const { range } = args
    const editor = window.activeTextEditor
    if (editor) {
      editor.selection = new Selection(
        new Position(range[0].line, range[0].character),
        new Position(range[1].line, range[1].character)
      )
      env.clipboard.writeText(this._document.getText(editor.selection))
    }
  }

  // 寻找函数
  private getMethodRange(document: TextDocument) {
    const documentText = document.getText()
    const ranges: Range[] = []
    // 这是ts的类型名称，为了适配
    const copyFunctionKinds = workspace
      .getConfiguration()
      .get<Array<string>>(
        `vscode-template-generate-tool.copyFunctionKinds`
      ) || [
      'FunctionDeclaration', // 通过function关键字定义的函数
      'FunctionExpression', // 将函数赋值给变量或者作为参数传递的函数
      'Arrow', // 箭头函数
      'Method' // 在对象或类中定义的函数
    ]
    function getJsMethodRange(text: string, scriptStart: number) {
      const ast = acorn.parse(text, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
      })
      function getNodeRange(
        node:
          | acorn.FunctionDeclaration
          | acorn.AnonymousFunctionDeclaration
          | acorn.FunctionExpression
          | acorn.ArrowFunctionExpression
          | acorn.MethodDefinition
      ) {
        if (!copyFunctionKinds.some(item => node.type.includes(item))) {
          return
        }
        if (node.loc) {
          const { start, end } = node.loc
          ranges.push(
            new Range(
              scriptStart + start.line - 2,
              0,
              scriptStart + end.line - 2,
              1000
            )
          )
        }
      }
      walk.simple(ast, {
        FunctionDeclaration: node => getNodeRange(node),
        FunctionExpression: node => getNodeRange(node),
        ArrowFunctionExpression: node => getNodeRange(node),
        MethodDefinition: node => getNodeRange(node)
      })
    }
    function getTsMethodRange(text: string) {
      const sourceFile = new Project().createSourceFile('example.ts', text)
      function printAllChildren(node: Node) {
        // ts和js的名称不一样，因此配置里用其子字符串
        // 'FunctionDeclaration', // 通过function关键字定义的函数
        // 'FunctionExpression', // 将函数赋值给变量或者作为参数传递的函数
        // 'ArrowFunction', // 箭头函数
        // 'MethodDeclaration' // 在对象或类中定义的函数
        if (copyFunctionKinds.some(item => node.getKindName().includes(item))) {
          ranges.push(
            new Range(
              node.getStartLineNumber() - 1,
              0,
              node.getEndLineNumber() - 1,
              1000
            )
          )
        }
        node.forEachChild(printAllChildren)
      }
      printAllChildren(sourceFile)
    }
    switch (document.languageId) {
      case 'vue':
        let match: RegExpExecArray | null
        const regex = /<script[^>]*>([\s\S]+?)<\/script>/g
        while ((match = regex.exec(documentText))) {
          const scriptStart =
            documentText.slice(0, match.index).split('\n').length +
            match[0].slice(0, match[0].indexOf('>')).split('\n').length -
            1
          getJsMethodRange(match[1], scriptStart)
        }
        break
      case 'javascript':
        getJsMethodRange(documentText, 1)
        break
      case 'typescript':
        getTsMethodRange(documentText)
        break
      default:
        break
    }
    return ranges
  }
}
