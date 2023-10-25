<template>
  <div class="form-generator">
    <el-backtop :right="100" :bottom="100" />
    <el-collapse v-model="activeNames">
      <el-collapse-item title="全局设置" name="1">
        <div style="text-align: right; margin-bottom: 5px">
          <el-button type="success" @click="ocr()">识别剪贴板</el-button>
          <el-button type="success" @click="useAnotherList()">
            使用上次表格数据
          </el-button>
        </div>
        <el-form label-width="100px" :inline="true">
          <el-row>
            <el-col :span="24">
              <el-form-item label="表单项数">
                <change-count
                  :simple-mode="globalSettings.simpleMode"
                  :item-count="itemCount"
                  @changeCount="count => changeCount(count)"
                  @resetList="resetList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表单类型">
                <el-cascader
                  v-model="dataType"
                  :options="typeList"
                  :props="{ expandTrigger: 'hover' }"
                  @change="calcStr()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开启规则">
                <el-switch v-model="enableRules" @change="calcStr()" />
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
              </el-row>
              <el-row>
                <el-col
                  v-if="
                    ['bsSelect', 'bsRadio', 'bsCheckbox'].includes(item.type)
                  "
                  :span="4"
                >
                  <el-form-item label="接口数据源">
                    <el-switch v-model="item.options.enableInterface" />
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="
                    ['elSelect', 'elRadio', 'elCheckbox'].includes(item.type)
                  "
                  :span="4"
                >
                  <el-form-item label="选项for循环">
                    <el-switch v-model="item.options.enableLoopOptions" />
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="
                    (['bsSelect', 'bsRadio', 'bsCheckbox'].includes(
                      item.type
                    ) &&
                      !item.options.enableInterface) ||
                    ['elSelect', 'elRadio', 'elCheckbox'].includes(item.type)
                  "
                  :span="20"
                >
                  <el-table
                    border
                    stripe
                    style="width: 100%; margin-left: 50px"
                    :data="item.options.optionList"
                  >
                    <el-table-column
                      type="index"
                      align="center"
                      width="55"
                      label="序号"
                    />
                    <el-table-column
                      v-slot="{ row }"
                      label="名称"
                      align="center"
                      min-width="100"
                    >
                      <el-input v-model="row.label" />
                    </el-table-column>
                    <el-table-column
                      v-slot="{ row }"
                      label="数值"
                      align="center"
                      min-width="100"
                    >
                      <el-input v-model="row.value" />
                    </el-table-column>
                    <el-table-column
                      key="operation"
                      fixed="right"
                      align="center"
                      :resizable="false"
                      width="85"
                      label="操作"
                    >
                      <template #header>
                        <el-link
                          type="success"
                          :underline="false"
                          @click="handleAdd(index)"
                        >
                          增加一行
                        </el-link>
                      </template>
                      <template #default="{ $index }">
                        <el-link
                          type="primary"
                          :underline="false"
                          @click.stop="
                            handleDelete(item.options.optionList, $index)
                          "
                        >
                          删除
                        </el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row v-if="enableRules">
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
              仅复制form-item
            </el-button>
          </template>
        </copy-codemirror>
        <div class="code-mirrors">
          <copy-codemirror
            title="data数据"
            :str="dataStr"
            mode="javascript"
            :dark-mode="globalSettings.darkMode"
          />
          <copy-codemirror
            title="options数据"
            :str="optionsStr"
            mode="javascript"
            :dark-mode="globalSettings.darkMode"
          />
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
import { typeList } from './constant/FormTypeList'
import { itemTypeList } from './constant/FormItemTypeList'
import { componentTemplate, ruleTemplate } from './constant/FormTemplates'
import { defaultGlobalSettings } from './constant/defaultGlobalSettings'
import DraggableList from '../views/components/DraggableList'
import CopyCodemirror from '../views/components/CopyCodemirror'
import ChangeCount from '../views/components/ChangeCount'
const defaultType = 'search'
const dataListStorage = '@bs/template-generate-tool/formList'
const anotherDataListStorage = '@bs/template-generate-tool/tableList'
const customTemplateStorage = '@bs/template-generate-tool/formCustomTemplate'

export default {
  name: 'FormGenerator',
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
      componentTemplate,
      // 设置
      globalSettings: defaultGlobalSettings,
      access_token: '',
      dataType: [],
      enableRules: false,
      activeNames: ['1', '2', '3'],
      // 数据
      itemCount: 0,
      dataList: [],
      // 结果
      htmlStr: '',
      loopStr: '',
      dataStr: '',
      optionsStr: '',
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
        this.dataType = this.globalSettings.formType
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
      const { label, prop, enableRules } = item
      const t = deepClone(
        this.itemTypeList.find(item2 => item2.type === item.type)
      )
      this.$set(this.dataList, index, {
        ...t,
        label,
        prop,
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
        type = 'bsSelect'
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
    // 选项表格
    handleAdd(index) {
      this.dataList[index].options.optionList.push({
        label: '',
        value: ''
      })
    },
    handleDelete(rows, index) {
      rows.splice(index, 1)
    },

    // 结果
    calcStr() {
      this.calcHtmlStr()
      this.calcDataStr()
      this.calcOptionsStr()
      this.calcRulesStr()
    },
    calcHtmlStr() {
      const { enableRules, isDefaultType, typeList, dataType, dataList } = this
      const template = typeList[
        dataType[0] === defaultType ? 0 : 1
      ].children.find(item => item.value === dataType[1])
      let htmlStr = template.start
      // 模板不含rules且开启规则时手动添加
      if (!htmlStr.includes(':rules=') && enableRules) {
        htmlStr = htmlStr.replace(
          ':model=',
          (isDefaultType
            ? ':rules="rules"'
            : ':rules="isViewMode ? null : rules"') +
            (htmlStr.includes('  ') ? '\n\t' : ' ') + // 简单判断是否换行
            ':model='
        )
      }
      let loopStr = ''
      dataList.forEach((item, index) => {
        const { type, componentName, attributeList, options } = item
        const label = item.label || `label${index + 1}`
        const prop = item.prop || `prop${index + 1}`
        let component = this.componentTemplate
        let attributes = ''
        attributeList.forEach(item => {
          attributes += `\n\t\t\t${item}`
        })
        const inputType = ['text', 'longText', 'number', 'amount'].includes(
          type
        )
        const selectType = ['elSelect', 'bsSelect', 'date'].includes(type)
        let placeholder = ''
        if (inputType) {
          placeholder += isDefaultType
            ? '\n\t\t\tplaceholder="请输入"'
            : `\n\t\t\t:placeholder="isViewMode ? '' : '请输入'"`
        } else if (selectType) {
          placeholder += isDefaultType
            ? '\n\t\t\tplaceholder="请选择"'
            : `\n\t\t\t:placeholder="isViewMode ? '' : '请选择'"`
        }
        // options
        const bsOptionType = ['bsSelect', 'bsRadio', 'bsCheckbox'].includes(
          type
        )
        const elOptionType = ['elSelect', 'elRadio', 'elCheckbox'].includes(
          type
        )
        let optionsContent = ''
        if (bsOptionType) {
          if (options.enableInterface) {
            attributes += `\n\t\t\tapi-config="applicationList"\n\t\t\t:option-config="{value: 'code', label: 'name'}"`
          } else {
            attributes += `\n\t\t\t:data="${prop}List"`
          }
        }
        if (elOptionType) {
          if (options.enableLoopOptions) {
            optionsContent = `\n\t\t\t${options.defaultStatement}`
          } else {
            optionsContent += ''
            options.optionList?.forEach(item2 => {
              if (type === 'elSelect') {
                optionsContent += `\n\t\t\t<${options.componentName} label="${item2.label}" value="${item2.value}" />`
              } else {
                optionsContent += `\n\t\t\t<${options.componentName} label="${item2.value}">${item2.label}</${options.componentName}>`
              }
            })
          }
          optionsContent += '\n\t\t'
        }
        // 替换
        component = component
          .replace('$componentName', componentName)
          .replace('$formDataNameStr', isDefaultType ? 'search' : 'formData')
          .replace('$prop', prop)
          .replace('$attributes', attributes)
          .replace('$placeholder', placeholder)
          .replace('$optionsContent', optionsContent)
          .replace('></$componentName>', '/>')
          .replace('$componentName', componentName)
        loopStr += template.loop
          .replace('$prop', prop)
          .replace('$label', label)
          .replace('$component', component)
      })
      htmlStr += loopStr
      htmlStr += template.end
      this.loopStr = loopStr
      this.htmlStr = htmlStr
    },
    calcDataStr() {
      const { isDefaultType, dataList } = this
      let dataStr = `${isDefaultType ? 'search' : 'formData'}: {`
      dataList.forEach((item, index) => {
        const { type } = item
        const prop = item.prop || `prop${index + 1}`
        dataStr += `\n\t${prop}: `
        if (type === 'date') {
          dataStr += `dayjs().format('YYYY-MM-DD'),`
        } else if (['bsCheckbox', 'elCheckbox'].includes(type)) {
          dataStr += '[],'
        } else {
          dataStr += 'null,'
        }
      })
      dataStr += '\n}'
      this.dataStr = dataStr
    },
    calcOptionsStr() {
      const { dataList } = this
      let optionsStr = ''
      dataList.forEach((item, index) => {
        const { type, options } = item
        const prop = item.prop || `prop${index + 1}`
        const bsOptionType = ['bsSelect', 'bsRadio', 'bsCheckbox'].includes(
          type
        )
        const elOptionType = ['elSelect', 'elRadio', 'elCheckbox'].includes(
          type
        )
        if (bsOptionType || elOptionType) {
          if (!(bsOptionType && options.enableInterface)) {
            if (optionsStr) {
              optionsStr += ',\n'
            }
            optionsStr += `${prop}List: [`
            options.optionList?.forEach(item2 => {
              optionsStr += `\n\t{label: "${item2.label}", value: "${item2.value}"},`
            })
            optionsStr += '\n]'
          }
        }
      })
      this.optionsStr = optionsStr
    },
    calcRulesStr() {
      const { enableRules, dataList } = this
      if (!enableRules) {
        this.rulesStr = ''
        return
      }
      let rulesStr = 'rules: {'
      dataList.forEach((item, index) => {
        const { enableRules } = item
        if (enableRules) {
          const { rules } = item
          let ruleStr = this.ruleTemplate
          const label = item.label || `label${index + 1}`
          const prop = item.prop || `prop${index + 1}`
          const required = rules.required ? '\n\t\trequired: true,' : ''
          const trigger = `\n\t\ttrigger: '${rules.trigger}'`
          const message = rules.message
            ? `,\n\t\tmessage: this.$t('validator.required', { name: '${label}' })`
            : ''
          const validator = rules.validator
            ? `,\n\t\tvalidator: (rule, value, callback) => {\n\t\t\tif (value) {\n\t\t\t\tcallback(new Error('请输入正确的内容'))\n\t\t\t} else {\n\t\t\t\tcallback()\n\t\t\t}\n\t\t}`
            : ''
          ruleStr = ruleStr
            .replace('$prop', prop)
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
  }
}
</script>

<style lang="scss" scoped>
.form-generator {
  .code-mirrors {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    * {
      margin: 0 5px;
      width: 33%;
    }
  }
}
</style>
