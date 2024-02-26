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
import {
  parse,
  FunctionDeclaration,
  AnonymousFunctionDeclaration,
  FunctionExpression,
  ArrowFunctionExpression,
  MethodDefinition
} from 'acorn'
import { simple } from 'acorn-walk'

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
    const copyFunctionKinds = workspace
      .getConfiguration()
      .get<Array<string>>(
        `vscode-template-generate-tool.copyFunctionKinds`
      ) || [
      'FunctionDeclaration', // 通过function关键字定义的函数
      'FunctionExpression', // 将函数赋值给变量或者作为参数传递的函数
      'ArrowFunctionExpression', // 箭头函数
      'MethodDefinition' // 在对象或类中定义的函数
    ]
    function getJsMethodRange(text: string, scriptStart: number) {
      const ast = parse(text, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
      })
      function getNodeRange(
        node:
          | FunctionDeclaration
          | AnonymousFunctionDeclaration
          | FunctionExpression
          | ArrowFunctionExpression
          | MethodDefinition
      ) {
        if (!copyFunctionKinds.some(item => node.type === item)) {
          return
        }
        if (node.loc) {
          const { start, end } = node.loc
          ranges.push(
            new Range(
              scriptStart + start.line - 2,
              start.column,
              scriptStart + end.line - 2,
              end.column
            )
          )
        }
      }
      simple(ast, {
        FunctionDeclaration: node => getNodeRange(node),
        FunctionExpression: node => getNodeRange(node),
        ArrowFunctionExpression: node => getNodeRange(node),
        MethodDefinition: node => getNodeRange(node)
      })
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
      default:
        break
    }
    return ranges
  }
}
