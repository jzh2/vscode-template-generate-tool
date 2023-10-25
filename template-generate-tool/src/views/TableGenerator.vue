<template>
  <div class="table-generator">
    <el-backtop :right="100" :bottom="100" />
    <el-collapse v-model="activeNames">
      <el-collapse-item title="全局设置" name="1">
        <div style="text-align: right; margin-bottom: 5px">
          <el-button type="success" @click="ocr()">识别剪贴板</el-button>
          <el-button type="success" @click="useAnotherList()">
            使用上次表单数据
          </el-button>
        </div>
        <el-form label-width="100px" :inline="true">
          <el-row>
            <el-col :span="24">
              <el-form-item label="表格列数">
                <change-count
                  :simple-mode="globalSettings.simpleMode"
                  :item-count="itemCount"
                  @changeCount="count => changeCount(count)"
                  @resetList="resetList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表格类型">
                <el-cascader
                  v-model="dataType"
                  :options="typeList"
                  :props="{ expandTrigger: 'hover' }"
                  @change="calcStr()"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="数据项设置" name="2">
        <draggable-list
          :data-list="dataList"
          @addItem="addItem"
          @removeItem="removeItem"
        >
          <template #default="{ item, index }">
            <el-form label-width="100px" :model="item">
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`第${index + 1}项类型`">
                    <el-select
                      v-if="globalSettings.simpleMode"
                      v-model="item.type"
                      @change="changeType(item, index)"
                    >
                      <el-option
                        v-for="item2 in itemTypeList"
                        :key="item2.type"
                        :value="item2.type"
                        :label="item2.name"
                      />
                    </el-select>
                    <el-radio-group
                      v-else
                      v-model="item.type"
                      @change="changeType(item, index)"
                    >
                      <el-radio-button
                        v-for="item2 in itemTypeList"
                        :key="item2.type"
                        :label="item2.type"
                      >
                        {{ item2.name }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="globalSettings.simpleMode ? 12 : 11">
                  <el-form-item label="label">
                    <el-input
                      v-model.trim="item.label"
                      :placeholder="`label${index + 1}`"
                      clearable
                      @change="changeLabel(item, index)"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="!globalSettings.simpleMode" :span="2">
                  <el-button
                    type="text"
                    style="width: 100%"
                    @click="manualTranslate(item.label)"
                  >
                    去翻译
                  </el-button>
                </el-col>
                <el-col :span="globalSettings.simpleMode ? 12 : 11">
                  <el-form-item label="prop">
                    <el-input
                      v-model="item.prop"
                      :placeholder="`prop${index + 1}`"
                      clearable
                      @change="toLowerCamelCase(item, index)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="自定义内容">
                    <el-switch
                      v-model="item.enableCustomContent"
                      @change="
                        () => {
                          if (!item.enableCustomContent) {
                            item.enableEditableContent = false
                          }
                        }
                      "
                    />
                  </el-form-item>
                </el-col>
                <template v-if="!isDefaultType">
                  <el-col :span="8">
                    <el-form-item label="可编辑内容">
                      <el-switch
                        v-model="item.enableEditableContent"
                        @change="
                          () => {
                            if (item.enableEditableContent) {
                              item.enableCustomContent = true
                            }
                          }
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <template v-if="item.enableEditableContent">
                    <el-col :span="20">
                      <el-form-item label="组件类型">
                        <el-cascader
                          v-model="item.editableContentType"
                          class="ell-cascader"
                          style="width: 100%"
                          :options="componentTypeList"
                          :props="{ expandTrigger: 'hover' }"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        type="text"
                        style="margin-bottom: 26px"
                        @click="toReference(item.editableContentType)"
                      >
                        组件参考文档
                      </el-button>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="开启规则">
                        <el-switch v-model="item.enableRules" />
                      </el-form-item>
                    </el-col>
                    <template v-if="item.enableRules">
                      <el-col :span="8">
                        <el-form-item label="required">
                          <el-switch v-model="item.rules.required" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="trigger">
                          <el-select
                            v-model="item.rules.trigger"
                            style="width: 100px"
                          >
                            <el-option label="blur" value="blur" />
                            <el-option label="change" value="change" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="message">
                          <el-switch v-model="item.rules.message" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="validator">
                          <el-switch v-model="item.rules.validator" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          type="text"
                          style="margin-bottom: 26px"
                          @click="moreRules()"
                        >
                          更多
                        </el-button>
                      </el-col>
                    </template>
                  </template>
                </template>
              </el-row>
            </el-form>
          </template>
        </draggable-list>
      </el-collapse-item>
      <el-collapse-item title="生成代码" name="3">
        <copy-codemirror
          title="html数据"
          :str="htmlStr"
          mode="vue"
          :dark-mode="globalSettings.darkMode"
        >
          <template #button>
            <el-button type="success" @click="$copy(loopStr)">
              仅复制table-column
            </el-button>
          </template>
        </copy-codemirror>
        <div class="code-mirrors">
          <copy-codemirror
            title="data数据"
            :str="dataStr"
            mode="javascript"
            :dark-mode="globalSettings.darkMode"
          >
            <template #button>
              mock
              <el-switch v-model="enableMockTableData" @change="calcStr()" />
            </template>
          </copy-codemirror>
          <copy-codemirror
            title="rules数据"
            :str="rulesStr"
            mode="javascript"
            :dark-mode="globalSettings.darkMode"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { deepClone } from '../utils/object'
import { blobToBase64 } from '../utils/file'
import { vscode } from '../utils/vscode'
import MD5 from 'md5'
import axios from 'axios'
import jsonpAdapter from 'axios-jsonp'
import { typeList } from './constant/TableTypeList'
import { itemTypeList } from './constant/TableItemTypeList'
import { ruleTemplate } from './constant/TableTemplates'
import { componentTypeList } from './constant/TableComponentTypeList'
import { defaultGlobalSettings } from './constant/defaultGlobalSettings'
import DraggableList from '../views/components/DraggableList'
import CopyCodemirror from '../views/components/CopyCodemirror'
import ChangeCount from '../views/components/ChangeCount'
const defaultType = 'common'
const dataListStorage = '@bs/template-generate-tool/tableList'
const anotherDataListStorage = '@bs/template-generate-tool/formList'
const customTemplateStorage = '@bs/template-generate-tool/tableCustomTemplate'

export default {
  name: 'TableGenerator',
  components: {
    DraggableList,
    CopyCodemirror,
    ChangeCount
  },
  mixins: [],
  data() {
    return {
      // 常量
      typeList: [],
      itemTypeList,
      ruleTemplate,
      componentTypeList,
      // 设置
      globalSettings: defaultGlobalSettings,
      access_token: '',
      dataType: [],
      enableMockTableData: false,
      activeNames: ['1', '2', '3'],
      // 数据
      itemCount: 0,
      dataList: [],
      // 结果
      htmlStr: '',
      loopStr: '',
      dataStr: '',
      mockDataStr: '',
      nonMockDataStr: '',
      rulesStr: ''
    }
  },
  computed: {
    isDefaultType() {
      return this.dataType[0] === defaultType
    }
  },
  watch: {
    dataList: {
      deep: true,
      handler(val) {
        sessionStorage.setItem(
          dataListStorage,
          JSON.stringify({
            list: val
          })
        )
        this.calcStr()
      }
    }
  },
  created() {
    this.getSettings()
    this.getTemplate()
    const dataList = JSON.parse(sessionStorage.getItem(dataListStorage))
    if (dataList) {
      this.dataList = dataList.list
      this.itemCount = this.dataList.length
    } else {
      this.addItem(0)
    }
  },
  methods: {
    // 全局
    getSettings() {
      const globalSettings = JSON.parse(
        localStorage.getItem('@bs/template-generate-tool/globalSettings')
      )
      if (globalSettings) {
        this.globalSettings = globalSettings
      }
      if (this.dataType.length === 0) {
        this.dataType = this.globalSettings.tableType
      }
    },
    getTemplate() {
      this.typeList = deepClone(typeList)
      const customTemplate = localStorage.getItem(customTemplateStorage)
      if (customTemplate) {
        JSON.parse(customTemplate).forEach(item => {
          const typeIndex = item.type[1] === defaultType ? 0 : 1
          this.typeList[typeIndex].children.push(item)
        })
      }
    },
    changeCount(count, isForce) {
      this.itemCount = count
      const diff = count - this.dataList.length
      if (diff < 0) {
        if (isForce) {
          this.dataList.splice(diff, -diff)
        } else {
          this.$confirm2
            .warning('确定删除多余项吗？')
            .then(() => {
              this.dataList.splice(diff, -diff)
            })
            .catch(() => {
              this.itemCount = this.dataList.length
            })
        }
      } else {
        for (let i = 0; i < diff; i++) {
          this.dataList.push(this.newItem())
        }
        this.itemCount = this.dataList.length
      }
    },

    // 数据项
    newItem() {
      return deepClone({
        ...this.itemTypeList[0],
        label: '',
        prop: '',
        enableCustomContent: false,
        enableEditableContent: false,
        enableRules: false
      })
    },
    addItem(index) {
      this.dataList.splice(index, 0, this.newItem())
      this.itemCount++
    },
    removeItem(index) {
      if (
        JSON.stringify(this.dataList[index]) === JSON.stringify(this.newItem())
      ) {
        this.dataList.splice(index, 1)
        this.itemCount--
        return
      }
      this.$confirm2
        .warning('确定删除吗？')
        .then(() => {
          this.dataList.splice(index, 1)
          this.itemCount--
        })
        .catch(() => {})
    },
    resetList(isForce) {
      if (isForce) {
        this.itemCount = 0
        this.dataList = []
        this.addItem(0)
        return
      }
      this.$confirm2
        .warning('确定重置吗？')
        .then(() => {
          this.itemCount = 0
          this.dataList = []
          this.addItem(0)
        })
        .catch(() => {})
    },
    changeType(item, index) {
      const { label, prop, enableEditableContent, enableRules } = item
      let { enableCustomContent } = item
      if (['enum', 'number', 'amount'].includes(item.type)) {
        enableCustomContent = true
      }
      const t = deepClone(
        this.itemTypeList.find(item2 => item2.type === item.type)
      )
      this.$set(this.dataList, index, {
        ...t,
        label,
        prop,
        enableCustomContent,
        enableEditableContent,
        enableRules
      })
    },
    // 更多校验规则
    moreRules() {
      vscode.postMessage({
        command: 'openFile',
        file: 'src/locales/zh-cn.json'
      })
    },
    // 使用自动保存的另一种数据
    useAnotherList() {
      this.$confirm2
        .warning('是否覆盖已有数据？')
        .then(() => {
          const anotherList = JSON.parse(
            sessionStorage.getItem(anotherDataListStorage)
          )
          if (anotherList) {
            this.changeCount(anotherList.list.length, true)
            anotherList.list.forEach((item, index) => {
              this.dataList[index].prop = item.prop
              this.dataList[index].label = item.label
            })
          } else {
            this.$tip.warning('无表格数据')
          }
        })
        .catch(() => {})
    },
    // 辅助填写
    // 读取剪切板
    async getClipboard() {
      const clipboardItems = await navigator.clipboard.read()
      if (!clipboardItems[0]) {
        this.$tip.warning('请复制要识别的图片或文字')
        return
      }
      if (clipboardItems[0].types[0] === 'image/png') {
        const blob = await clipboardItems[0].getType('image/png')
        const image = await blobToBase64(blob)
        return { image: image.slice(22) }
      } else if (clipboardItems[0].types[0] === 'text/plain') {
        const text = await navigator.clipboard.readText()
        return { text: text.trim().split(/\s+/) }
      } else {
        this.$tip.warning('复制内容格式有误')
      }
    },
    // 获取鉴权参数
    async getAccessToken() {
      if (this.access_token) {
        return
      }
      const { apiKey, secretKey } = this.globalSettings
      if (!apiKey || !secretKey) {
        this.$tip.warning('请在设置中输入API Key和Secret Key')
        return
      }
      try {
        const { data } = await axios.post(
          `/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
        )
        this.access_token = data.access_token
      } catch (error) {
        if (error.response.data.error) {
          this.$tip.warning(
            `调用OCR鉴权接口出错，错误码：${error.response.data.error}，错误描述：${error.response.data.error_description}`
          )
        } else {
          this.$tip.warning(error)
        }
      }
    },
    // 文字识别
    async ocr() {
      this.$confirm2
        .warning('是否覆盖已有数据？')
        .then(async () => {
          const clipboardData = await this.getClipboard()
          const { image, text } = clipboardData
          if (image) {
            await this.getAccessToken()
            const { access_token } = this
            if (!access_token) {
              return
            }
            try {
              const { data } = await axios.post(
                `/rest/2.0/ocr/v1/general_basic?access_token=${access_token}&image=${encodeURIComponent(
                  image
                )}`
              )
              if (data.words_result_num) {
                this.resetList(true)
                this.changeCount(data.words_result_num, true)
                data.words_result.forEach((item, index) => {
                  const hasAsterisk = item.words.startsWith('*')
                  if (hasAsterisk) {
                    this.dataList[index].label = item.words.slice(1)
                    this.dataList[index].enableRules = true
                    this.enableRules = true
                  } else {
                    this.dataList[index].label = item.words
                  }
                })
                this.dataList.forEach((item, index) => {
                  this.changeLabel(item, index)
                })
              } else {
                this.$tip.warning(
                  `调用OCR识别接口出错，错误码：${data.error_code}，错误描述：${data.error_msg}，详情见 https://cloud.baidu.com/doc/OCR/s/dk3h7y5vr`
                )
              }
            } catch (error) {
              this.$tip.warning(error)
            }
          } else if (text) {
            this.resetList(true)
            this.changeCount(text.length, true)
            text.forEach((item, index) => {
              const hasAsterisk = item.startsWith('*')
              if (hasAsterisk) {
                this.dataList[index].label = item.slice(1)
                this.dataList[index].enableRules = true
                this.enableRules = true
              } else {
                this.dataList[index].label = item
              }
            })
            this.dataList.forEach((item, index) => {
              this.changeLabel(item, index)
            })
          }
        })
        .catch(() => {})
    },
    // 手动翻译
    manualTranslate(zh) {
      vscode.postMessage({
        command: 'openExternalWebsite',
        website: `https://fanyi.baidu.com/#zh/en/${zh}`
      })
    },
    // 自动翻译，自动判断类型
    async changeLabel(item, index) {
      const { enableAutoTranslate, translateAppid, translateKey } =
        this.globalSettings
      if (!enableAutoTranslate || !item.label) {
        return
      }
      if (!translateAppid || !translateKey) {
        this.$tip.warning('请在设置中输入APP ID和密钥或关闭自动翻译')
        return
      }
      let { prop } = item
      try {
        const appid = translateAppid
        const key = translateKey
        const salt = new Date().getTime()
        const q = item.label
        const sign = MD5(appid + q + salt + key)
        const { data } = await axios(
          `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${q}&appid=${appid}&salt=${salt}&from=zh&to=en&sign=${sign}`,
          {
            adapter: jsonpAdapter
          }
        )
        if (data.trans_result) {
          prop = this.toLowerCamelCase(
            {
              prop: data.trans_result[0]?.dst
            },
            index
          )
        } else {
          this.$tip.warning(
            `调用翻译接口出错，错误码：${data.error_code}，错误描述：${data.error_msg}，详情见 http://api.fanyi.baidu.com/doc/21`
          )
        }
      } catch (error) {
        this.$tip.warning(error)
      }
      const { label } = item
      let type
      if (/日期|时间/.test(label)) {
        type = 'date'
      } else if (/状态|类型|是否/.test(label)) {
        type = 'enum'
      } else if (/金额|价/.test(label)) {
        type = 'amount'
      } else if (/数量|号|码|手机|电话/.test(label)) {
        type = 'number'
      }
      if (type) {
        this.changeType(
          {
            ...item,
            prop,
            type
          },
          index
        )
      }
    },
    // 转小驼峰
    toLowerCamelCase(item, index) {
      if (!item.prop) {
        return item.prop
      }
      if (!/^[A-Za-z\s][A-Za-z0-9\s]*$/.test(item.prop)) {
        this.$tip.warning(`第${index + 1}项prop格式错误`)
      }
      const words = item.prop.trim().split(/\s+/)
      let lowerCamelCase = ''
      if (words.length === 1) {
        const word = words[0]
        if (word[1] && word[1] >= 'a' && word[1] <= 'z') {
          // 第二个字符是小写才转换
          lowerCamelCase += word[0].toLowerCase()
        } else {
          lowerCamelCase += word[0]
        }
        lowerCamelCase += word.slice(1)
        item.prop = lowerCamelCase
        return lowerCamelCase
      }
      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        if (i) {
          lowerCamelCase += word[0].toUpperCase()
        } else {
          if (word[1] && word[1] >= 'a' && word[1] <= 'z') {
            // 第二个字符是小写才转换
            lowerCamelCase += word[0].toLowerCase()
          } else {
            lowerCamelCase += word[0]
          }
        }
        lowerCamelCase += word.slice(1)
      }
      item.prop = lowerCamelCase
      return lowerCamelCase
    },
    // 组件参考文档
    toReference(type) {
      if (type[0] === 'ElementUI') {
        vscode.postMessage({
          command: 'openWebsite',
          website: `https://element.eleme.cn/#/zh-CN/component/${type[1]}`
        })
      } else {
        vscode.postMessage({
          command: 'openWebsite',
          website: `http://172.18.166.134:31034/frontend-component-doc/index.html#/${type[1]}`
        })
      }
    },

    // 结果
    calcStr() {
      this.calcHtmlStr()
      this.calcDataStr()
      this.calcRulesStr()
    },
    calcHtmlStr() {
      const { typeList, dataType, dataList, componentTypeList } = this
      const template = typeList[
        dataType[0] === defaultType ? 0 : 1
      ].children.find(item => item.value === dataType[1])
      let htmlStr = template.start
      let loopStr = ''
      dataList.forEach((item, index) => {
        const {
          type,
          enableEditableContent,
          enableCustomContent,
          editableContentType,
          formatter,
          width,
          align
        } = item
        const label = item.label || `label${index + 1}`
        const prop = item.prop || `prop${index + 1}`
        // 替换
        let loop = template.loop
        if (enableEditableContent) {
          loop = loop.replace('prop=', '#default="{ row, $index }"\n\t\tprop=')
        } else if (enableCustomContent) {
          loop = loop.replace('prop=', '#default="{ row }"\n\t\tprop=')
        }
        let component = ''
        if (enableEditableContent) {
          component = componentTypeList
            .find(item2 => item2.value === editableContentType[0])
            .children.find(
              item3 => item3.value === editableContentType[1]
            ).template
          component = `\n\t\t${component.replace('field', prop)}\n\t`
        } else if (enableCustomContent) {
          if (type === 'select') {
            component += `\n\t\t<template v-if="row.${prop} === 1">1</template>`
            component += `\n\t\t<template v-else-if="row.${prop} === 2">2</template>`
            component += `\n\t\t<template v-else></template>`
          } else {
            component += `\n\t\t{{ row.${prop}${formatter} }}\n\t`
          }
        }
        loopStr += loop
          .replace('"$label"', `"$label"\n\t\t${width}`)
          .replace('$prop', prop)
          .replace('$label', label)
          .replace(
            `
    align="$align"`,
            align ? `\n\t\t${align}` : ''
          )
          .replace('$component', component)
          .replace('></el-table-column>', '/>')
      })
      htmlStr += loopStr
      htmlStr += template.end
      this.loopStr = loopStr
      this.htmlStr = htmlStr
    },
    calcDataStr() {
      const { isDefaultType, dataList } = this
      let mockDataStr = `{`
      let nonMockDataStr = isDefaultType ? '{' : `{\n\teditable: false,`
      dataList.forEach((item, index) => {
        const { type } = item
        const prop = item.prop || `prop${index + 1}`
        let mockStr = null
        switch (type) {
          case 'text':
            mockStr = `'文本字段'`
            break
          case 'date':
            mockStr = `'2020-03-28 16:24:58'`
            break
          case 'longText':
            mockStr = `'今天天气多云转小雨，不宜出门'`
            break
          default:
            mockStr = 1
            break
        }
        mockDataStr += `\n\t${prop}: ${mockStr},`
        nonMockDataStr += `\n\t${prop}: null,`
      })
      mockDataStr += '\n}'
      nonMockDataStr += '\n}'
      this.mockDataStr = mockDataStr
      this.nonMockDataStr = nonMockDataStr
      this.dataStr = this.enableMockTableData ? mockDataStr : nonMockDataStr
    },
    calcRulesStr() {
      const { isDefaultType, dataList } = this
      if (isDefaultType) {
        this.rulesStr = ''
        return
      }
      let rulesStr = 'rules: {'
      dataList.forEach((item, index) => {
        const {
          enableCustomContent,
          enableEditableContent,
          editableContentType,
          enableRules
        } = item
        if (
          enableCustomContent &&
          enableEditableContent &&
          editableContentType.length !== 0 &&
          enableRules
        ) {
          const { prop, label, rules } = item
          let ruleStr = this.ruleTemplate
          const required = rules.required ? '\n\t\trequired: true,' : ''
          const trigger = `\n\t\ttrigger: '${rules.trigger}'`
          const message = rules.message
            ? `,\n\t\tmessage: this.$t('validator.required', { name: '${
                label || `label${index + 1}`
              }' })`
            : ''
          const validator = rules.validator
            ? `,\n\t\tvalidator: (rule, value, callback) => {\n\t\t\tif (value) {\n\t\t\t\tcallback(new Error('请输入正确的内容'))\n\t\t\t} else {\n\t\t\t\tcallback()\n\t\t\t}\n\t\t}`
            : ''
          ruleStr = ruleStr
            .replace('$prop', prop || `prop${index + 1}`)
            .replace('$required', required)
            .replace('$trigger', trigger)
            .replace('$message', message)
            .replace('$validator', validator)
          rulesStr += ruleStr
        }
      })
      rulesStr += '\n}'
      this.rulesStr = rulesStr
    }
    // checkLongText() {
    //   for (let i = 0; i < this.dataList.length; i++) {
    //     if (this.dataList[i].type === 'longText') {
    //       return
    //     }
    //   }
    //   this.$tip.warning('至少一列类型为长文本')
    // }
  }
}
</script>

<style lang="scss" scoped>
.table-generator {
  .code-mirrors {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    * {
      margin: 0 5px;
      width: 50%;
    }
  }
}
</style>
