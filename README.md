# 模板代码生成工具

快速配置 prop 和 label，生成 el-form 和 el-table 代码

### 省流

快捷键

- ctrl+数字键区 0-8(Mac: cmd+alt+主键盘区 0-8)
  分别打开侧边栏表单，侧面板表单、表格、api，前端文档、组件库、样式工具类，浏览器，设置

功能

- 设置页面可以打开常用文件、依赖和模板文件夹
- 可手动配置生成代码模板
- paging-grid 等单页面代码片段，created，computed 等生命周期代码片段

问题和 bug

- 侧边栏表单需要手动打开激活一次才能用快捷键:joy:
- api 识图暂时不可用，可用第三方软件识别成文字复制后，识别剪切板
- 切换暗黑模式，codemirror 会错位，重新打开可以恢复
- 有时候打开空白，右下角提示“加载 Web 视图时出错”。可能是 vscode 问题，需要将所有 vscode 窗口关闭重启。

## 一、模板生成

侧边栏点击图标，在侧边栏打开模板代码生成工具。
快捷键 <kbd>Ctrl</kbd> + <kbd>数字键区 0</kbd>
Mac <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>主键盘区 0</kbd>
必须手动打开激活一次才能用快捷键打开
其他快捷键可以直接用

或者右键模板生成 - 表单生成/表格生成/API 生成，在侧边窗口打开模板代码生成工具。
快捷键 <kbd>Ctrl</kbd> + <kbd>数字键区 1/2/3</kbd>
Mac <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>主键盘区 1/2/3</kbd>

### 通用

#### 表单/表格类型

修改生成 html 数据的模板，可在设置中自定义。

#### 识别剪切板

识别剪切板中的文字或图片，文字以/s 分割，图片需要注册百度 api 使用。可以用其他软件识别文字后复制。

#### 使用上次表单/表格数据

点击按钮可以获取另一个页面保存的数据，填入 prop 和 label。用于表格数据填入详情的填写表单，以及剪贴板识别错页面的情况。

#### 复制

- 点击复制按钮复制全部
- 仅复制 form-item/table-column 不会复制开头结尾的 form/table 标签以及筛选重置/操作列
- 代码编辑器内拖动复制选中的内容
- 单击行复制一行

### 表格

#### 自定义内容

启用自定义内容后，可以对数据进行处理，比如金额和时间。在可编辑表格状态下，启用可编辑内容，选择嵌入表格的组件类型，包括 el 和 bs 的各种输入框和选择器。组件属性复制后自行修改，可以跳转到该组件的参考文档。

### API

- baseUrl、baseUrl2 和 url 必须由 n 个(/[0-9a-zA-Z])组成，如/a/b

- method 由 method 前缀加上 url 的大驼峰组成

- 修改 baseUrl 会自动修改 method 前缀，从而修改每一项的 method
  baseUrl->methodPrefix->method

- 修改一项的 url 会自动修改该项的 method
  url->method

### 设置

快捷键 <kbd>Ctrl</kbd> + <kbd>数字键区 8</kbd>
Mac <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>主键盘区 8</kbd>

#### 简单模式

开启后表单/表格项数不显示 radio，表单项/列类型以 select 显示，不显示去翻译按钮。

#### 打开文件/文件夹

文件夹会在新窗口打开，用于查看依赖，不会添加到“最近打开的文件”。

只能打开当前工作区第一个项目的文件/文件夹，暂时无法打开多根工作区(Multi-root workspaces)其他项目。

https://code.visualstudio.com/api/references/vscode-api#WorkspaceFolder
A workspace folder is one of potentially many roots opened by the editor. All workspace folders are equal which means there is no notion of an active or primary workspace folder.
工作区文件夹是编辑器打开的可能众多根之一。所有工作区文件夹都是相等的，这意味着没有活动或主工作区文件夹的概念。

## 二、模板片段

输入前缀后，描述为 vscode-template-generate-tool 的即为插件创建的代码片段。

- html

  - embedded-card
  - template
  - placeholder

- javascript

  - console.log()关键词 <kbd>l</kbd><kbd>l</kbd> 或 console
    - 自带的 log，输入第二次会将 log 作为短语，影响判断
  - async

  | Vue api 类型 | 关键词                            |
  | ------------ | --------------------------------- |
  | 数据         | data/props/computed/methods/watch |
  | 生命周期钩子 | created/mounted                   |
  | 资源         | components                        |
  | 组合         | mixins                            |

- vue
  - vue
  - style
  - 模板文档 paging-grid/simple-grid/simple-search-grid/edit-grid/form-dialog

## 三、文档

右键文档 - 前端文档/前端组件库/样式工具类，在第一个窗口打开对应文档。
快捷键 <kbd>Ctrl</kbd> + <kbd>数字键区 4/5/6</kbd>
Mac <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>主键盘区 4/5/6</kbd>

## 四、浏览器

右键文档 - 新建浏览器页签，在第一个窗口打开一个页签，输入网站，网站可以收藏。用于对照接口文档。
快捷键 <kbd>Ctrl</kbd> + <kbd>数字键区 7</kbd>
Mac <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>主键盘区 7</kbd>

## 五、百度 API 注册

注册后会打电话

### OCR

https://console.bce.baidu.com/ai/#/ai/ocr/overview/index

![百度OCR](images/百度OCR.png)

步骤 1 领取通用文字识别（标准版）。

![领取OCR资源](images/领取OCR资源.png)

步骤 2 创建应用，仅需勾选通用文字识别（标准版），归属个人，描述随便填个试用，完成创建。

![创建OCR应用1](images/创建OCR应用1.png)

![创建OCR应用2](images/创建OCR应用2.png)

然后到 https://console.bce.baidu.com/ai/#/ai/ocr/app/list 获取 API Key 和 Secret Key。

![OCR应用列表](images/OCR应用列表.png)

### 翻译

http://api.fanyi.baidu.com/doc/21 应该仅需标准版。完成步骤 124 后，到管理控制台-开发者信息获取 APP ID 和密钥。

![百度翻译](images/百度翻译.png)

![百度翻译密钥](images/百度翻译密钥.png)
