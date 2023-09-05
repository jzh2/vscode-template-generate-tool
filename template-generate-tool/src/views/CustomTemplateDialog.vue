<template>
  <el-dialog
    width="700px"
    title="自定义模板"
    :close-on-click-modal="false"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-form :model="formData" label-width="70px">
      <el-form-item label="所属类型">
        <el-cascader
          v-model="formData.type"
          :options="typeList"
          :props="{ expandTrigger: 'hover' }"
          @change="changeType"
        />
      </el-form-item>
      <el-form-item label="模板名">
        <el-input v-model="formData.label" />
      </el-form-item>
      <el-form-item label="开始">
        <i class="el-icon-info"></i>
        填写rules则固定值，不填则由系统设置添加
        <codemirror
          class="start"
          v-model="formData.start"
          :placeholder="placeholder.start"
          :options="cmOptions"
        />
      </el-form-item>
      <el-form-item label="循环项">
        <i class="el-icon-info"></i>
        $prop,$label,$component必填
        <template v-if="formData.type[0] === 'table'">
          <div>$align可填，填写则由系统设置添加，不填则不会添加</div>
          <div>$width可填，填写则固定值，不填则由系统设置添加</div>
        </template>
        <codemirror
          class="loop"
          v-model="formData.loop"
          :placeholder="placeholder.loop"
          :options="cmOptions"
        />
      </el-form-item>
      <el-form-item label="结尾">
        <i class="el-icon-info"></i>
        按需填写，不会修改
        <codemirror
          class="end"
          v-model="formData.end"
          :placeholder="placeholder.end"
          :options="cmOptions"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onSave()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { typeList as formTypeList } from './constant/FormTypeList'
import { typeList as tableTypeList } from './constant/TableTypeList'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue'
import 'codemirror/addon/display/placeholder'
const typeList = [
  {
    value: 'form',
    label: '表单',
    children: [
      {
        value: 'search',
        label: '搜索'
      },
      {
        value: 'write',
        label: '填写'
      }
    ]
  },
  {
    value: 'table',
    label: '表格',
    children: [
      {
        value: 'common',
        label: '普通'
      },
      {
        value: 'editable',
        label: '可编辑'
      }
    ]
  }
]

export default {
  name: 'CustomTemplateDialog',
  components: {
    codemirror
  },
  props: {
    dialog: Object,
    darkMode: Boolean
  },
  data() {
    return {
      formTypeList,
      tableTypeList,
      typeList,
      dialogFormVisible: false,
      formData: {
        label: '',
        type: [],
        start: '',
        loop: '',
        end: ''
      },
      placeholder: {
        start: '',
        loop: '',
        end: ''
      },
      selectedValue: [],
      previousValue: []
    }
  },
  computed: {
    cmOptions() {
      return {
        tabSize: 2,
        lineNumbers: true,
        mode: 'vue',
        theme: this.darkMode ? 'base16-dark' : 'default'
      }
    }
  },
  created() {
    const { type, value } = this.dialog.data
    this.formData.type = type
    if (value) {
      this.formData = JSON.parse(
        localStorage.getItem(
          `@bs/template-generate-tool/${this.formData.type[0]}CustomTemplate`
        )
      ).find(item => item.value === value)
    } else {
      this.changeType(type)
    }
  },
  methods: {
    changeType(newValue) {
      this.previousValue = this.selectedValue
      this.selectedValue = newValue
      const type0Changed = this.previousValue[0] !== this.formData.type[0]
      let defaultLabel = ''
      switch (this.formData.type[1]) {
        // TODO placeholder不会实时更新
        case 'search':
          this.placeholder = {
            start: this.formTypeList[0].children[0].start,
            loop: this.formTypeList[0].children[0].loop,
            end: this.formTypeList[0].children[0].end
          }
          defaultLabel = '搜索表单模板'
          break
        case 'write':
          this.placeholder = {
            start: this.formTypeList[1].children[0].start,
            loop: this.formTypeList[1].children[0].loop,
            end: this.formTypeList[1].children[0].end
          }
          defaultLabel = '填写表单模板'
          break
        case 'common':
          this.placeholder = {
            start: this.tableTypeList[0].children[0].start,
            loop: this.tableTypeList[0].children[0].loop,
            end: this.tableTypeList[0].children[0].end
          }
          defaultLabel = '普通表格模板'
          break
        case 'editable':
          this.placeholder = {
            start: this.tableTypeList[1].children[0].start,
            loop: this.tableTypeList[1].children[0].loop,
            end: this.tableTypeList[1].children[0].end
          }
          defaultLabel = '可编辑表格模板'
          break
        default:
          break
      }
      if (type0Changed) {
        this.formData.start = this.placeholder.start
        this.formData.loop = this.placeholder.loop
        this.formData.end = this.placeholder.end
        this.formData.label = defaultLabel
      } else {
        this.formData.start = this.formData.start ?? this.placeholder.start
        this.formData.loop = this.formData.loop ?? this.placeholder.loop
        this.formData.end = this.formData.end ?? this.placeholder.end
        this.formData.label = this.formData.label ?? defaultLabel
      }
    },
    onSave() {
      const customTemplate =
        JSON.parse(
          localStorage.getItem(
            `@bs/template-generate-tool/${this.formData.type[0]}CustomTemplate`
          )
        ) || []
      const index = customTemplate.findIndex(
        item => item.value === this.formData.value
      )
      if (index === -1) {
        customTemplate.push({
          ...this.formData,
          value: new Date()
        })
      } else {
        customTemplate[index] = this.formData
      }
      localStorage.setItem(
        `@bs/template-generate-tool/${this.formData.type[0]}CustomTemplate`,
        JSON.stringify(customTemplate)
      )
      this.$emit('changeTemplate')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .start {
    .CodeMirror {
      height: 200px;
    }
  }
  .loop {
    .CodeMirror {
      height: 200px;
    }
  }
  .end {
    .CodeMirror {
      height: 300px;
    }
  }
  .CodeMirror pre.CodeMirror-placeholder {
    color: #999;
  }
}
</style>
