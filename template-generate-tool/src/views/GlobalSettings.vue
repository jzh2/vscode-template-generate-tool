<template>
  <el-form
    ref="form"
    :model="globalSettings"
    :rules="rules"
    label-width="160px"
  >
    <el-form-item label="简单模式" prop="simpleMode">
      <el-switch
        v-model="globalSettings.simpleMode"
        @change="changeSettings()"
      />
    </el-form-item>
    <el-form-item label="暗黑模式" prop="darkMode">
      <el-switch v-model="globalSettings.darkMode" @change="changeSettings()" />
    </el-form-item>
    <el-form-item label="默认表单类型">
      <el-cascader
        v-model="globalSettings.formType"
        :options="formTypeList"
        :props="{ expandTrigger: 'hover' }"
        @change="changeSettings()"
      >
        <template slot-scope="{ data }">
          <span>{{ data.label }}</span>
          <span v-if="data.type" style="float: right">
            <i
              class="el-icon-edit"
              @click.stop="editCustomTemplate(data.value, 'form', data.type)"
            ></i>
            <i
              class="el-icon-close"
              @click.stop="removeCustomTemplate(data.value, 'form')"
            ></i>
          </span>
        </template>
      </el-cascader>
      <el-button type="text" @click="newCustomTemplate('form')">
        自定义模板
      </el-button>
    </el-form-item>
    <el-form-item label="默认表格类型">
      <el-cascader
        v-model="globalSettings.tableType"
        :options="tableTypeList"
        :props="{ expandTrigger: 'hover' }"
        @change="changeSettings()"
      >
        <template slot-scope="{ data }">
          <span>{{ data.label }}</span>
          <span v-if="data.type" style="float: right">
            <i
              class="el-icon-edit"
              @click.stop="editCustomTemplate(data.value, 'table', data.type)"
            ></i>
            <i
              class="el-icon-close"
              @click.stop="removeCustomTemplate(data.value, 'table')"
            ></i>
          </span>
        </template>
      </el-cascader>
      <el-button type="text" @click="newCustomTemplate('table')">
        自定义模板
      </el-button>
    </el-form-item>
    <!-- <el-form-item label="OCR" prop="enableOCR">
      <el-switch
        v-model="globalSettings.enableOCR"
        @change="changeSettings()"
      />
      <el-button type="text" @click="openOCRDoc()">
        百度文字识别key地址
      </el-button>
    </el-form-item>
    <template v-if="globalSettings.enableOCR">
      <el-form-item label="百度OCR API Key" prop="apiKey">
        <el-input v-model="globalSettings.apiKey" @change="changeSettings()" />
      </el-form-item>
      <el-form-item label="百度OCR Secret Key" prop="secretKey">
        <el-input
          v-model="globalSettings.secretKey"
          @change="changeSettings()"
        />
      </el-form-item>
    </template> -->
    <el-form-item label="翻译" prop="enableAutoTranslate">
      <el-switch
        v-model="globalSettings.enableAutoTranslate"
        @change="changeSettings()"
      />
      <el-button type="text" @click="openTranslateDoc()">
        百度翻译key地址
      </el-button>
    </el-form-item>
    <template v-if="globalSettings.enableAutoTranslate">
      <el-form-item label="百度翻译APP ID" prop="translateAppid">
        <el-input
          v-model="globalSettings.translateAppid"
          @change="changeSettings()"
        />
      </el-form-item>
      <el-form-item label="百度翻译密钥" prop="translateKey">
        <el-input
          v-model="globalSettings.translateKey"
          @change="changeSettings()"
        />
      </el-form-item>
    </template>
    <el-form-item label="打开文件">
      <el-button @click="openFile('src/views/index.js')">打开组件库</el-button>
      <el-button @click="openFile('src/mock/menu.js')">打开菜单</el-button>
      <el-button @click="openFile('src/router/routes.js')">打开路由</el-button>
    </el-form-item>
    <el-form-item label="打开文件夹">
      <div>
        <el-button
          @click="
            openFolder('node_modules/@bs/module-demo-collection/src/demo')
          "
        >
          打开页面demo
        </el-button>
        <el-button @click="openFolder('node_modules/@bs')">
          打开@bs依赖
        </el-button>
        <el-button @click="openFolder('node_modules/nontax-saas-ui')">
          打开nontax依赖
        </el-button>
      </div>
      <div>
        <el-button @click="openFolder('node_modules/@bs/vue-asset/mixin')">
          打开mixin
        </el-button>
        <el-button @click="openFolder('node_modules/@bs/vue-asset/plugin')">
          打开plugin
        </el-button>
        <el-button @click="openFolder('node_modules/@bs/utils/src')">
          打开utils
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="resetForm()">重置</el-button>
    </el-form-item>
    <CustomTemplateDialog
      v-if="customTemplateDialog.show"
      :visible.sync="customTemplateDialog.show"
      :dialog="customTemplateDialog"
      :dark-mode="globalSettings.darkMode"
      @changeTemplate="$emit('changeTemplate')"
    />
  </el-form>
</template>

<script>
import { deepClone } from '../utils/object'
import { vscode } from '../utils/vscode'
import { typeList as formTypeList } from './constant/FormTypeList'
import { typeList as tableTypeList } from './constant/TableTypeList'
import { defaultGlobalSettings } from './constant/defaultGlobalSettings'
import CustomTemplateDialog from './CustomTemplateDialog'

export default {
  name: 'GlobalSettings',
  components: {
    CustomTemplateDialog
  },
  data() {
    return {
      formTypeList: [],
      tableTypeList: [],
      globalSettings: defaultGlobalSettings,
      rules: {
        apiKey: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^[A-Za-z0-9]{24}$/.test(value)) {
                callback(new Error('请输入24位英文数字字符串'))
              } else {
                callback()
              }
            }
          }
        ],
        secretKey: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^[A-Za-z0-9]{32}$/.test(value)) {
                callback(new Error('请输入32位的英文数字字符串'))
              } else {
                callback()
              }
            }
          }
        ],
        translateAppid: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^[0-9]{17}$/.test(value)) {
                callback(new Error('请输入17位的数字字符串'))
              } else {
                callback()
              }
            }
          }
        ],
        translateKey: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^[A-Za-z0-9_]{20}$/.test(value)) {
                callback(new Error('请输入20位的英文数字字符串'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      customTemplateDialog: {
        data: {},
        show: false
      }
    }
  },
  watch: {
    'globalSettings.darkMode': {
      deep: true,
      immediate: true,
      handler() {
        const app = document.getElementById('app')
        if (this.globalSettings.darkMode) {
          app.classList.remove('light')
          app.classList.add('dark')
        } else {
          app.classList.remove('dark')
          app.classList.add('light')
        }
      }
    }
  },
  created() {
    this.getSettings()
    this.getTemplate()
  },
  methods: {
    getSettings() {
      const globalSettings = JSON.parse(
        localStorage.getItem('@bs/template-generate-tool/globalSettings')
      )
      if (globalSettings) {
        this.globalSettings = globalSettings
      } else {
        localStorage.setItem(
          '@bs/template-generate-tool/globalSettings',
          JSON.stringify(this.globalSettings)
        )
      }
    },
    getTemplate() {
      this.formTypeList = deepClone(formTypeList)
      const formCustomTemplate = localStorage.getItem(
        '@bs/template-generate-tool/formCustomTemplate'
      )
      if (formCustomTemplate) {
        JSON.parse(formCustomTemplate).forEach(item => {
          const typeIndex = item.type[1] === 'search' ? 0 : 1
          this.formTypeList[typeIndex].children.push(item)
        })
      }
      this.tableTypeList = deepClone(tableTypeList)
      const tableCustomTemplate = localStorage.getItem(
        '@bs/template-generate-tool/tableCustomTemplate'
      )
      if (tableCustomTemplate) {
        JSON.parse(tableCustomTemplate).forEach(item => {
          const typeIndex = item.type[1] === 'common' ? 0 : 1
          this.tableTypeList[typeIndex].children.push(item)
        })
      }
    },
    resetForm() {
      const { apiKey, secretKey, translateAppid, translateKey } =
        this.globalSettings
      if (apiKey || secretKey || translateAppid || translateKey) {
        this.$confirm2
          .warning('是否同时清除key？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            closeOnPressEscape: true,
            distinguishCancelAndClose: true
          })
          .then(() => {
            this.globalSettings = deepClone(defaultGlobalSettings)
            this.changeSettings()
          })
          .catch(action => {
            if (action === 'cancel') {
              this.globalSettings = deepClone(defaultGlobalSettings)
              this.globalSettings.apiKey = apiKey
              this.globalSettings.secretKey = secretKey
              this.globalSettings.translateAppid = translateAppid
              this.globalSettings.translateKey = translateKey
              this.changeSettings()
            }
          })
      } else {
        this.globalSettings = deepClone(defaultGlobalSettings)
        this.changeSettings()
      }
    },
    changeSettings() {
      localStorage.setItem(
        '@bs/template-generate-tool/globalSettings',
        JSON.stringify(this.globalSettings)
      )
      this.$tip.success('设置成功')
      this.$emit('changeGlobalSettings')
    },
    newCustomTemplate(type1) {
      this.customTemplateDialog = {
        data: {
          type: type1 === 'form' ? ['form', 'search'] : ['table', 'common']
        },
        show: true
      }
    },
    editCustomTemplate(value, type1, type2) {
      this.customTemplateDialog = {
        data: {
          type: [type1, type2],
          value
        },
        show: true
      }
    },
    removeCustomTemplate(value, type) {
      this.$confirm2
        .warning('确定删除模板吗？')
        .then(() => {
          const customTemplate = JSON.parse(
            localStorage.getItem(
              `@bs/template-generate-tool/${type}CustomTemplate`
            )
          )
          localStorage.setItem(
            `@bs/template-generate-tool/${type}CustomTemplate`,
            JSON.stringify(customTemplate.filter(item => item.value !== value))
          )
          this.$emit('changeTemplate')
          if (this.globalSettings.formType[1] === value) {
            this.globalSettings.formType[1] = 'default'
            this.changeSettings()
          } else if (this.globalSettings.tableType[1] === value) {
            this.globalSettings.tableType[1] = 'default'
            this.changeSettings()
          }
        })
        .catch(() => {})
    },
    openOCRDoc() {
      vscode.postMessage({
        command: 'openExternalWebsite',
        website: 'https://console.bce.baidu.com/ai/#/ai/ocr/app/list'
      })
    },
    openTranslateDoc() {
      vscode.postMessage({
        command: 'openExternalWebsite',
        website: `http://api.fanyi.baidu.com/manage/developer`
      })
    },
    openFile(file) {
      vscode.postMessage({
        command: 'openFile',
        file
      })
    },
    openFolder(folder) {
      vscode.postMessage({
        command: 'openFolder',
        folder
      })
    }
  }
}
</script>
