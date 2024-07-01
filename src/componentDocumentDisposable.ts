import { commands, window, env, Uri } from 'vscode'
import { elComponentsMap } from './elComponents'
import { uvComponentsTransform } from './uvComponents'
import { wdComponentsTransform } from './wdComponents'
import { bsComponents } from './bsComponents'

// 打开组件文档
export function getComponentDocumentDisposable() {
  return commands.registerCommand(
    `vscode-template-generate-tool.openComponentDocument`,
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
      const componentName =
        lineText1.slice(lineText1.indexOf('/') === 1 ? 2 : 1) + lineText2
      if (!/^[\w-]+$/.test(componentName)) {
        return
      }
      if (componentName.startsWith('el-')) {
        // 1.ElementUI
        env.openExternal(
          Uri.parse(
            'https://element.eleme.cn/#/zh-CN/component/' +
              (elComponentsMap[componentName.slice(3)] ??
                componentName.slice(3))
          )
        )
      } else if (componentName.startsWith('uv-')) {
        // 2.uv-ui
        env.openExternal(
          // 转小驼峰
          Uri.parse(
            'https://www.uvui.cn/components/' +
              (uvComponentsTransform[componentName.slice(3)] ??
                componentName
                  .slice(3)
                  .replace(/-([a-z])/g, (_match, letter) =>
                    letter.toUpperCase()
                  )) +
              '.html'
          )
        )
      } else if (componentName.startsWith('wd-')) {
        // 3.wot-design-uni
        env.openExternal(
          Uri.parse(
            'https://wot-design-uni.netlify.app/component/' +
              (wdComponentsTransform[componentName.slice(3)] ??
                componentName.slice(3)) +
              '.html'
          )
        )
      } else if (
        componentName.startsWith('bs-') ||
        bsComponents.includes(componentName)
      ) {
        // 4.kun-peng-ui和saas-operation-ui依赖
        env.openExternal(
          Uri.parse('http://172.18.166.139:31035/#/' + componentName)
        )
      }
    }
  )
}
