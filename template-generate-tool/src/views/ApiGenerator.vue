<template>
  <div class="api-generator" style="height: 100%">
    <el-backtop :right="100" :bottom="100" />
    <el-collapse v-model="activeNames">
      <el-collapse-item title="全局设置" name="1">
        <el-form label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="api项数">
                <change-count
                  :simple-mode="globalSettings.simpleMode"
                  :item-count="itemCount"
                  @changeCount="count => changeCount(count)"
                  @resetList="resetList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  <div
                    style="cursor: pointer"
                    @click="globalFillClipboardText('baseUrl')"
                  >
                    baseUrl
                  </div>
                </template>
                <el-input
                  v-model="baseUrl"
                  clearable
                  @change="checkUrl(baseUrl), changeBaseUrl()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  <div
                    style="cursor: pointer"
                    @click="globalFillClipboardText('baseUrl2')"
                  >
                    baseUrl2
                  </div>
                </template>
                <el-input
                  v-model="baseUrl2"
                  clearable
                  @change="checkUrl(baseUrl2), calcStr()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  <div
                    style="cursor: pointer"
                    @click="globalFillClipboardText('methodPrefix')"
                  >
                    methodPrefix
                  </div>
                </template>
                <el-input
                  v-model="methodPrefix"
                  clearable
                  @change="changeMethodPrefix()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  <div
                    style="cursor: pointer"
                    @click="globalFillClipboardText('category')"
                  >
                    category
                  </div>
                </template>
                <el-input v-model="category" clearable @change="calcStr()" />
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
            <el-form ref="form" label-width="100px" :model="item">
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="`api${index + 1}类型`">
                    <el-select
                      v-if="globalSettings.simpleMode"
                      v-model="item.type"
                    >
                      <el-option
                        v-for="item2 in typeList"
                        :key="item2"
                        :label="item2"
                        :value="item2"
                      />
                    </el-select>
                    <el-radio-group v-else v-model="item.type">
                      <el-radio-button
                        v-for="item2 in typeList"
                        :key="item2"
                        :label="item2"
                      >
                        {{ item2 }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-button type="success" @click="getClipboard(item)">
                    识别剪切板
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用baseUrl">
                    <el-select
                      v-model="item.useBaseUrl"
                      placeholder="请选择"
                      style="width: 100%"
                      @change="calcStr()"
                    >
                      <el-option label="不使用" :value="0" />
                      <el-option label="使用baseUrl" :value="1" />
                      <el-option label="使用baseUrl2" :value="2" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template #label>
                      <div
                        style="cursor: pointer"
                        @click="fillClipboardText('name', index)"
                      >
                        name
                      </div>
                    </template>
                    <el-input v-model.trim="item.name" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template #label>
                      <div
                        style="cursor: pointer"
                        @click="fillClipboardText('url', index)"
                      >
                        url
                      </div>
                    </template>
                    <el-input
                      v-model="item.url"
                      clearable
                      @change="checkUrl(item.url), changeUrl(item)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template #label>
                      <div
                        style="cursor: pointer"
                        @click="fillClipboardText('method', index)"
                      >
                        method
                      </div>
                    </template>
                    <el-input v-model="item.method" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </draggable-list>
      </el-collapse-item>
      <el-collapse-item title="生成代码" name="3">
        <copy-codemirror
          title="api数据"
          :str="dataStr"
          mode="javascript"
          :dark-mode="globalSettings.darkMode"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import DraggableList from '../views/components/DraggableList'
import CopyCodemirror from '../views/components/CopyCodemirror'
import ChangeCount from '../views/components/ChangeCount'
import { defaultGlobalSettings } from './constant/defaultGlobalSettings'

const typeList = ['get', 'post', 'delete', 'put']
export default {
  name: 'ApiGenerator',
  components: {
    DraggableList,
    CopyCodemirror,
    ChangeCount
  },
  mixins: [],
  data() {
    return {
      // 常量
      typeList,
      // 设置
      globalSettings: defaultGlobalSettings,
      activeNames: ['1', '2', '3'],
      // 全局
      baseUrl: '',
      baseUrl2: '',
      methodPrefix: '',
      category: '',
      // 数据项
      itemCount: 0,
      dataList: [],
      // 结果
      dataStr: ''
    }
  },
  watch: {
    dataList: {
      deep: true,
      handler() {
        this.calcStr()
      }
    }
  },
  created() {
    this.getSettings()
    const dataList = JSON.parse(
      sessionStorage.getItem('@bs/template-generate-tool/apiList')
    )
    if (dataList) {
      this.dataList = dataList.list
      this.itemCount = this.dataList.length
    } else {
      this.addItem(0)
    }
    this.calcStr()
  },
  methods: {
    // 全局
    getSettings() {
      const globalSettings = localStorage.getItem(
        '@bs/template-generate-tool/globalSettings'
      )
      if (globalSettings) {
        this.globalSettings = JSON.parse(globalSettings)
      }
    },
    changeCount(count) {
      this.itemCount = count
      const diff = count - this.dataList.length
      if (diff < 0) {
        this.$confirm2
          .warning('确定删除多余项吗？')
          .then(() => {
            this.dataList.splice(diff, -diff)
          })
          .catch(() => {
            this.itemCount = this.dataList.length
          })
      } else {
        for (let i = 0; i < diff; i++) {
          this.dataList.push(this.newItem())
        }
        this.itemCount = this.dataList.length
      }
    },
    resetList() {
      this.$confirm2
        .warning('确定重置吗？')
        .then(() => {
          this.itemCount = 0
          this.dataList = []
          this.addItem(0)
        })
        .catch(() => {})
    },

    // 数据项
    newItem() {
      return {
        type: this.typeList[1],
        useBaseUrl: 1,
        name: '',
        url: '',
        method: ''
      }
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
    async getClipboard(item) {
      const clipboardItems = await navigator.clipboard.read()
      if (!clipboardItems[0]) {
        this.$tip.warning('请复制要识别的文字')
        return
      }
      if (clipboardItems[0].types[0] !== 'text/plain') {
        this.$tip.warning('复制内容格式有误')
        return
      }
      const text = await navigator.clipboard.readText()
      const texts = text.trim().split(/\s+/)
      texts.forEach(item2 => {
        if (/^(post|get|delete|put)$/i.test(item2)) {
          item.type = item2.toLowerCase()
        } else if (/^(\/[0-9a-zA-Z{}-]+)*$/.test(item2)) {
          if (this.baseUrl && item2.startsWith(this.baseUrl + '/')) {
            item.url = item2.replace(this.baseUrl, '')
            item.useBaseUrl = 1
          } else if (this.baseUrl2 && item2.startsWith(this.baseUrl2 + '/')) {
            item.url = item2.replace(this.baseUrl2, '')
            item.useBaseUrl = 2
          } else {
            item.url = item2
            item.useBaseUrl = 0
          }
          this.changeUrl(item)
        } else {
          item.name = item2
        }
      })
    },
    toCamelCase(url, toUpper = true) {
      if (!url) {
        return ''
      }
      let upperCamelCase = ''
      const words = url.split(/[/-]/)
      words.forEach((word, index) => {
        if (!index) {
          return
        }
        if (index === 1) {
          if (toUpper) {
            upperCamelCase += word[0].toUpperCase() + word.slice(1)
          } else {
            upperCamelCase += word
          }
          return
        }
        upperCamelCase += word[0].toUpperCase() + word.slice(1)
      })
      return upperCamelCase
    },
    changeBaseUrl() {
      this.methodPrefix = this.toCamelCase(this.baseUrl, false)
      this.changeMethodPrefix()
    },
    changeMethodPrefix() {
      this.dataList.forEach(item => {
        this.changeUrl(item)
      })
    },
    changeUrl(item) {
      item.method = this.methodPrefix + this.toCamelCase(item.url)
      this.calcStr()
    },
    checkUrl(url) {
      if (/^(\/[0-9a-zA-Z{}-]+)*$/.test(url)) {
        return true
      } else {
        this.$tip.warning('url格式不正确')
        return false
      }
    },
    // 全局设置填入剪切板文字
    async globalFillClipboardText(type) {
      const clipboardItems = await navigator.clipboard.read()
      if (!clipboardItems[0]) {
        this.$tip.warning('请复制要输入的文字')
        return
      }
      if (clipboardItems[0].types[0] === 'text/plain') {
        const text = await navigator.clipboard.readText()
        this[type] = text
        if (type === 'baseUrl') {
          this.checkUrl(text)
          this.changeBaseUrl()
        } else if (type === 'baseUrl2') {
          this.checkUrl(text)
          this.calcStr()
        } else if (type === 'methodPrefix') {
          this.changeMethodPrefix()
        } else if (type === 'category') {
          this.calcStr()
        }
      } else {
        this.$tip.warning('请复制文字')
      }
    },
    // 数据项填入剪切板文字
    async fillClipboardText(type, index) {
      const clipboardItems = await navigator.clipboard.read()
      if (!clipboardItems[0]) {
        this.$tip.warning('请复制要输入的文字')
        return
      }
      if (clipboardItems[0].types[0] === 'text/plain') {
        const text = await navigator.clipboard.readText()
        this.dataList[index][type] = text
        if (type === 'url') {
          if (this.checkUrl(text)) {
            if (this.baseUrl && text.startsWith(this.baseUrl + '/')) {
              this.dataList[index].url = text.replace(this.baseUrl, '')
              this.dataList[index].useBaseUrl = 1
            } else if (this.baseUrl2 && text.startsWith(this.baseUrl2 + '/')) {
              this.dataList[index].url = text.replace(this.baseUrl2, '')
              this.dataList[index].useBaseUrl = 2
            } else {
              this.dataList[index].url = text
              this.dataList[index].useBaseUrl = 0
            }
            this.changeUrl(this.dataList[index])
          }
        }
      } else {
        this.$tip.warning('请复制文字')
      }
    },

    // 结果
    calcStr() {
      let dataStr = ''
      dataStr += `export const category = '${this.category}'`
      dataStr += `\nconst baseUrl = '${this.baseUrl}'`
      if (this.baseUrl2) {
        dataStr += `\nconst baseUrl2 = '${this.baseUrl2}'`
      }
      dataStr += '\n\nexport default ['
      const length = this.dataList.length
      this.dataList.forEach((item, index) => {
        dataStr += '\n  {'
        dataStr += `\n    name: '${item.name}',`
        dataStr += `\n    method: '${item.method}',`
        if (item.useBaseUrl === 0) {
          dataStr += `\n    url: '${item.url}',`
        } else {
          dataStr += `\n    url: \`${
            item.useBaseUrl === 1 ? `\${baseUrl}` : `\${baseUrl2}`
          }${item.url}\`,`
        }
        dataStr += `\n    type: '${item.type}'`
        dataStr += '\n  }'
        if (index + 1 !== length) {
          dataStr += ','
        }
      })
      dataStr += '\n]\n'
      this.dataStr = dataStr
      sessionStorage.setItem(
        '@bs/template-generate-tool/apiList',
        JSON.stringify({
          list: this.dataList
        })
      )
    }
  }
}
</script>
