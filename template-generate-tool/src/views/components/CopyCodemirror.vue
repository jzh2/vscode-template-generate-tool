<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 5px"
    >
      {{ title }}
      <div style="display: flex">
        <slot name="button"></slot>
        <el-button type="success" @click="$copy(code)">复制</el-button>
      </div>
    </div>
    <codemirror
      ref="codemirror"
      style="min-height: 100px; max-height: 400px"
      v-model="code"
      :options="{
        tabSize: 2,
        lineNumbers: true,
        readOnly: true,
        mode,
        theme: darkMode ? 'base16-dark' : 'default',
        autoRefresh: true,
        foldGutter: true,
        gutters: ['CodeMirror-foldgutter']
      }"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/xml-fold'

import { getEventPath } from '../../utils/dom'

export default {
  name: 'CopyCodemirror',
  data() {
    return {
      code: ''
    }
  },
  components: {
    codemirror
  },
  props: {
    title: String,
    str: String,
    mode: String,
    darkMode: Boolean
  },
  watch: {
    str: {
      immediate: true,
      handler() {
        this.code = this.str
      }
    },
    darkMode: {
      handler() {
        // TODO 切换暗黑模式后codemirror错位
        this.$refs.codemirror.refresh()
      }
    }
  },
  mounted() {
    this.$refs.codemirror.$el.addEventListener('mousedown', () =>
      this.handleCodemirrorMouseDown('codemirror')
    )
    document.body.addEventListener('mousedown', e => {
      try {
        this.handleBodyMouseDown(e)
      } catch (e) {
        console.log(e)
      }
    })
  },
  destroyed() {
    document.body.removeEventListener('mousedown', e => {
      this.handleBodyMouseDown(e)
    })
  },
  methods: {
    // 内部按下开始监听，松开执行复制
    handleCodemirrorMouseDown() {
      const el = document.body
      const fn = event => {
        this.handleCopy(event.target)
        el.removeEventListener('mouseup', fn)
      }
      el.addEventListener('mouseup', fn)
    },
    // 执行复制
    handleCopy(element) {
      const cmInstance = this.$refs.codemirror.codemirror
      const selection = cmInstance.getSelection()
      const isNotEditArea = [
        'CodeMirror-gutter',
        'CodeMirror-linenumber',
        'CodeMirror-foldgutter-folded',
        'CodeMirror-foldgutter-open',
        'CodeMirror-vscrollbar'
      ].some(className => element.classList.contains(className))
      console.log(element.classList)
      if (selection) {
        // 选中区域复制区域
        this.$copy(selection)
      } else if (!isNotEditArea) {
        // 点击复制当前行
        const { line: lineNumber } = cmInstance.getCursor()
        const line = cmInstance.getLine(lineNumber)
        if (line) {
          this.$copy(line)
          cmInstance.setSelection(
            {
              line: lineNumber,
              ch: line.length
            },
            {
              line: lineNumber,
              ch: 0
            }
          )
        }
      }
    },
    // 复制后点击外部取消选中
    handleBodyMouseDown(e) {
      if (getEventPath(e).some(el => this.$refs.codemirror?.$el === el)) {
        return
      }
      this.$refs.codemirror.codemirror.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 0,
          ch: 0
        },
        { scroll: false }
      )
    }
  }
}
</script>
