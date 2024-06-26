export const typeList = [
  {
    value: 'search',
    label: '搜索',
    children: [
      {
        value: 'default',
        label: '默认',
        start: `<el-form ref="searchForm" inline :model="search" @submit.native.prevent>\n`,
        loop: `  <el-form-item prop="$prop" label="$label">$component\t</el-form-item>\n`,
        end: `  <el-form-item>
    <el-button type="primary" @click="onQuery()">筛选</el-button>
    <el-button
      @click="
        $refs.searchForm.resetFields()
        onQuery()
      "
    >
      重置
    </el-button>
  </el-form-item>
</el-form>`
      },
      {
        value: 'operation',
        label: '运营',
        start: `<el-form ref="searchForm" inline :model="search" @submit.native.prevent>\n`,
        loop: `  <el-form-item prop="$prop" label="$label">$component\t</el-form-item>\n`,
        end: `  <el-form-item>
    <el-button
      type="primary"
      :icon="uiSetting.icon.search"
      @click="onQuery()"
    >
      查询
    </el-button>
    <el-button
      :icon="uiSetting.icon.reset"
      @click="
        $refs.searchForm.resetFields()
        onQuery()
      "
    >
      重置
    </el-button>
  </el-form-item>
</el-form>`
      },
      {
        value: 'tax',
        label: '税务',
        start: `<el-form ref="searchForm" :model="search" label-width="calc(8em + 12px)" @submit.native.prevent>
  <form-item-wrapper
    @query="onQuery"
    @reset="
      $refs.searchForm.resetFields()
      onQuery()
    "
  >\n`,
        loop: `  <el-form-item prop="$prop">
    <tooltip-label slot="label" label="$label" />$component  </el-form-item>\n`,
        end: `  </form-item-wrapper>
</el-form>`
      }
    ]
  },
  {
    value: 'write',
    label: '填写',
    children: [
      {
        value: 'default',
        label: '默认(两列)',
        start: `<el-form
  ref="form"
  label-width="85px"
  :model="formData"
  :disabled="isViewMode"
>
  <el-row :gutter="50">\n`,
        loop: `    <el-col :span="12">
    <el-form-item label="$label" prop="$prop">$component\t\t</el-form-item>
    </el-col>\n`,
        end: `  </el-row>
</el-form>`
      },
      {
        value: 'noRowCol',
        label: '不含row/col(一列)',
        start: `<el-form
  ref="form"
  label-width="85px"
  :model="formData"
  :disabled="isViewMode"
>\n`,
        loop: `  <el-form-item label="$label" prop="$prop">$component\t</el-form-item>\n`,
        end: `</el-form>`
      },
      {
        value: 'bsExtForm2',
        label: 'bs-ext-form(两列)',
        start: `<bs-ext-form
  ref="form"
  label-width="85px"
  :model="formData"
  :disabled="isViewMode"
>\n`,
        loop: `  <bs-ext-form-item label="$label" prop="$prop" :span="12">$component\t</bs-ext-form-item>\n`,
        end: `</bs-ext-form>`
      },
      {
        value: 'bsExtForm1',
        label: 'bs-ext-form(一列)',
        start: `<bs-ext-form
  ref="form"
  label-width="85px"
  :model="formData"
  :disabled="isViewMode"
>\n`,
        loop: `  <bs-ext-form-item label="$label" prop="$prop">$component\t</bs-ext-form-item>\n`,
        end: `</bs-ext-form>`
      }
    ]
  }
]
