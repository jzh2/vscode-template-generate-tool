import {
  DefinitionProvider,
  TextDocument,
  Position,
  Definition,
  DefinitionLink,
  Uri,
  workspace,
  Location,
  RelativePattern
} from 'vscode'
import {
  bsComponents,
  bsOperationComponents,
  bsOperationComponentsMap
} from './componentsMap/bsComponents'
import { existsSync } from 'fs'
import { join } from 'path'
import { getProject, getRelatedProjectPaths } from './utils'

// 查找组件定义
export class ComponentDefinitionProvider implements DefinitionProvider {
  public async provideDefinition(
    document: TextDocument,
    position: Position
  ): Promise<Definition | DefinitionLink[] | undefined> {
    const { line, character } = position
    // 获取组件名
    const lineText = document.lineAt(line).text
    // 从光标开始，往前后搜索
    const lineText1 =
      (lineText.slice(0, character).split(/\s/).pop() ?? '').split('>').pop() ??
      ''
    const lineText2 = lineText.slice(character).split(/\s/)[0].split('>')[0]
    if (!lineText1.startsWith('<')) {
      return
    }
    const componentName =
      lineText1.slice(lineText1.indexOf('/') === 1 ? 2 : 1) + lineText2
    if (!/^[\w-]+$/.test(componentName)) {
      return
    }
    const { projectPath } = getProject(document.uri)
    if (componentName.startsWith('uv-')) {
      // 2.uv-ui
      const filePath = join(
        projectPath,
        'node_modules',
        '@climblee',
        'uv-ui',
        'components',
        componentName,
        `${componentName}.vue`
      )
      if (existsSync(filePath)) {
        return new Location(Uri.file(filePath), new Position(0, 0))
      }
      return
    }
    if (componentName.startsWith('wd-')) {
      // 3.wot-design-uni
      const filePath = join(
        projectPath,
        'node_modules',
        'wot-design-uni',
        'components',
        componentName,
        `${componentName}.vue`
      )
      if (existsSync(filePath)) {
        return new Location(Uri.file(filePath), new Position(0, 0))
      }
      return
    }
    // 4.项目内定义
    const relatedProjectPaths = getRelatedProjectPaths(document.uri)
    const newPosition = new Position(0, 0)
    const possibleLocation: Location[] = []
    const patterns = [
      `src/components/**/${componentName}/${componentName}.vue`,
      `src/components/**/${componentName}.vue`,
      `src/components/**/${componentName}/src/index.vue`,
      `src/components/**/${componentName}/index.vue`
    ]
    for (const pattern of patterns) {
      for (const fsPath of relatedProjectPaths) {
        const files = await workspace.findFiles(
          new RelativePattern(fsPath, pattern)
        )
        for (const file of files) {
          possibleLocation.push(new Location(file, newPosition))
        }
      }
    }
    if (possibleLocation.length > 0) {
      return possibleLocation
    }
    // 5.kun-peng-ui依赖
    if (
      componentName.startsWith('bs-') ||
      bsComponents.includes(componentName)
    ) {
      // Vue.use和Vue.component不是通过import导入，所以f12找不到
      for (const fsPath of relatedProjectPaths) {
        for (const item of ['common', 'layout']) {
          const filePath = join(
            fsPath,
            'node_modules',
            '@bs',
            'kun-peng-ui',
            'packages',
            item,
            componentName,
            'src',
            'index.vue'
          )
          if (existsSync(filePath)) {
            return new Location(Uri.file(filePath), newPosition)
          }
        }
      }
    }
    // 6.saas-operation-ui依赖
    const operationProjectPath = relatedProjectPaths.find(item =>
      item.endsWith('operation-frontend')
    )
    if (operationProjectPath && bsOperationComponents.includes(componentName)) {
      // Vue.use和Vue.component不是通过import导入，所以f12找不到
      const filePath = join(
        operationProjectPath,
        'node_modules',
        '@bs',
        'saas-operation-ui',
        'packages',
        'business',
        bsOperationComponentsMap[componentName] ??
          join(componentName, 'index.vue')
      )
      if (existsSync(filePath)) {
        return new Location(Uri.file(filePath), newPosition)
      }
    }
  }
}
