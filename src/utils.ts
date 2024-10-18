import { Uri, workspace } from 'vscode'
import { join } from 'path'
import { existsSync } from 'fs'

// 项目文件夹，从内到外找到含义package.json的文件夹
export function getProject(uri: Uri) {
  const folderPathList = uri.fsPath.split('\\')
  for (let i = folderPathList.length - 1; i >= 0; i--) {
    const folderPath = folderPathList.slice(0, i + 1).join('\\')
    if (existsSync(join(folderPath, 'package.json'))) {
      return {
        projectPath: folderPath,
        projectName: folderPathList[i]
      }
    }
  }
  return {
    projectPath: uri.fsPath,
    projectName: folderPathList[folderPathList.length - 1]
  }
}
// 项目所有相关文件夹，自身、工作区、父级
export function getRelatedProjectPaths(uri: Uri) {
  const { projectPath, projectName } = getProject(uri)
  const possibleProjectPaths = [projectPath]
  const relatedProjectMap =
    workspace
      .getConfiguration()
      .get<Record<string, string>>(
        `vscode-template-generate-tool.relatedProjectMap`
      ) || {}
  const relatedProjectName = relatedProjectMap[projectName]
  if (relatedProjectName) {
    // 工作区文件夹
    const relatedProjectFolder = workspace.workspaceFolders?.find(
      item => item.name === relatedProjectName
    )?.uri.fsPath
    if (relatedProjectFolder) {
      possibleProjectPaths.push(relatedProjectFolder)
    }
    // 当前项目所有父文件夹
    const folderPathList = projectPath.split('\\')
    for (let i = folderPathList.length - 1; i >= 0; i--) {
      const folderPath = folderPathList.slice(0, i + 1).join('\\')
      const filePath = join(folderPath, relatedProjectName)
      if (existsSync(filePath)) {
        possibleProjectPaths.push(filePath)
      }
      if (
        workspace.workspaceFolders?.find(item =>
          uri.fsPath.includes(item.uri.fsPath)
        )?.uri.fsPath === folderPath
      ) {
        // 到工作区第一级为止
        break
      }
    }
  }
  return possibleProjectPaths
}
