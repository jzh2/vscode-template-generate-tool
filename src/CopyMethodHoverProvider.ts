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
  env
} from 'vscode'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'
import { Project } from 'ts-morph'

// 复制函数悬浮实例
export class CopyMethodHoverProvider implements HoverProvider {
  private _document!: TextDocument

  constructor(private context: ExtensionContext) {
    // 注册复制函数命令
    context.subscriptions.push(
      commands.registerCommand(
        'vscode-template-generate-tool.copyMethod',
        this.copyMethod,
        this
      )
    )
  }

  public provideHover(
    document: TextDocument,
    position: Position
  ): ProviderResult<Hover> {
    this._document = document
    let hover: Hover | undefined = undefined
    const ranges = this.getDocumentRange(document)
    ranges.map((range: Range) => {
      if (range.contains(position)) {
        const contents = new MarkdownString()
        contents.isTrusted = true
        contents.appendMarkdown(
          `[复制函数](command:vscode-template-generate-tool.copyMethod?${encodeURIComponent(
            JSON.stringify({
              range
            })
          )})`
        )
        hover = new Hover(contents, range)
      }
    })
    return hover
  }

  public async copyMethod(args: any) {
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
  private getDocumentRange(document: TextDocument) {
    const documentText = document.getText()
    const ranges: Range[] = []
    function getJsTextRange(text: string, scriptStart: number) {
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
      ) {
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
        FunctionExpression: node => getNodeRange(node)
      })
    }
    function getTsTextRange(text: string) {
      new Project()
        .createSourceFile('example.ts', text)
        .getFunctions()
        .map(item =>
          ranges.push(
            new Range(
              item.getStartLineNumber() - 1,
              0,
              item.getEndLineNumber() - 1,
              1000
            )
          )
        )
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
          getJsTextRange(match[1], scriptStart)
        }
        break
      case 'javascript':
        getJsTextRange(documentText, 1)
        break
      case 'typescript':
        getTsTextRange(documentText)
        break
      default:
        break
    }
    return ranges
  }
}
