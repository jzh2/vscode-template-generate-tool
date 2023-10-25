export const typeList = [
  {
    value: 'common',
    label: '普通',
    children: [
      {
        value: 'default',
        label: '默认',
        start: `<el-table
  ref="table"
  v-loading="grid.loading"
  border
  stripe
  :data="grid.rows"
  :height="grid.height"
  highlight-current-row
>
  <el-table-column
    type="index"
    align="center"
    :width="uiSetting.table.index"
    label="序号"
    :index="sequence"
  />\n`,
        loop: `  <el-table-column
    prop="$prop"
    label="$label"
    align="$align"
    show-overflow-tooltip
  >$component</el-table-column>\n`,
        end: `  <el-table-column
    #default="{ row }"
    fixed="right"
    align="center"
    width="200"
    label="操作"
    class-name="func-column"
  >
    <el-link type="primary" :underline="false" @click="onView(row)">详情</el-link>
    <el-link type="primary" :underline="false" @click="onUpdate(row)">编辑</el-link>
    <el-link type="primary" :underline="false" @click="onDelete(row)">删除</el-link>
  </el-table-column>
</el-table>`
      },
      {
        value: 'selection',
        label: '多选(selection-change)',
        start: `<el-table
  ref="table"
  v-loading="grid.loading"
  border
  stripe
  :data="grid.rows"
  :height="grid.height"
  highlight-current-row
  @selection-change="val => (grid.selectedRows = val)"
>
  <el-table-column type="selection" align="center" :width="uiSetting.table.checkbox" />
  <el-table-column
    type="index"
    align="center"
    :width="uiSetting.table.index"
    label="序号"
    :index="sequence"
  />\n`,
        loop: `  <el-table-column
    prop="$prop"
    label="$label"
    align="$align"
    show-overflow-tooltip
  />\n`,
        end: `  <el-table-column
    #default="{ row }"
    fixed="right"
    align="center"
    width="200"
    label="操作"
    class-name="func-column"
  >
    <el-link type="primary" :underline="false" @click="onView(row)">详情</el-link>
    <el-link type="primary" :underline="false" @click="onUpdate(row)">编辑</el-link>
    <el-link type="primary" :underline="false" @click="onDelete(row)">删除</el-link>
  </el-table-column>
</el-table>`
      },
      {
        value: 'main',
        label: '主从表(current-change)',
        start: `<el-table
  ref="table"
  v-loading="grid.loading"
  border
  stripe
  :data="grid.rows"
  :height="grid.height"
  highlight-current-row
  @current-change="row => (grid.currentRow = row)"
>
  <el-table-column
    type="index"
    align="center"
    :width="uiSetting.table.index"
    label="序号"
    :index="sequence"
  />\n`,
        loop: `  <el-table-column
    prop="$prop"
    label="$label"
    align="$align"
    show-overflow-tooltip
  >$component</el-table-column>\n`,
        end: `  <el-table-column
    #default="{ row }"
    fixed="right"
    align="center"
    width="200"
    label="操作"
    class-name="func-column"
  >
    <el-link type="primary" :underline="false" @click="onView(row)">详情</el-link>
    <el-link type="primary" :underline="false" @click="onUpdate(row)">编辑</el-link>
    <el-link type="primary" :underline="false" @click="onDelete(row)">删除</el-link>
  </el-table-column>
</el-table>`
      },
      {
        value: 'tax',
        label: '税务',
        start: `<el-table
  ref="table"
  v-loading="grid.loading"
  :data="grid.rows"
  :height="grid.height"
  highlight-current-row
  @row-dblclick="row => onView(row)"
  @current-change="row => (grid.currentRow = row)"
  @selection-change="val => (grid.selectedRows = val)"
>
  <el-table-column type="selection" :width="uiSetting.table.checkbox" />
  <el-table-column
    type="index"
    :width="uiSetting.table.index"
    label="序号"
    :index="sequence"
  />\n`,
        loop: ` <el-table-column
    prop="$prop"
    label="$label"
    show-overflow-tooltip
  >$component</el-table-column>\n`,
        end: `  <el-table-column
    #default="{ row }"
    fixed="right"
    width="200"
    label="操作"
    class-name="func-column"
  >
    <el-link type="primary" :underline="false" @click="onView(row)">
      详情
    </el-link>
    <el-link type="primary" :underline="false" @click="onUpdate(row)">
      编辑
    </el-link>
    <el-link type="primary" :underline="false" @click="onDelete(row)">
      删除
    </el-link>
  </el-table-column>
</el-table>`
      }
    ]
  },
  {
    value: 'editable',
    label: '可编辑',
    children: [
      {
        value: 'default',
        label: '默认',
        start: `<el-form ref="form" :model="grid" :show-message="false">
<el-table
  ref="table"
  v-loading="grid.loading"
  border
  stripe
  :data="grid.rows"
  :height="grid.height"
  @row-click="row => handleRowClick(row)"
>
  <el-table-column type="index" align="center" :width="uiSetting.table.index" label="序号" />\n`,
        loop: `  <el-table-column
    prop="$prop"
    label="$label"
    show-overflow-tooltip
  >$component</el-table-column>\n`,
        end: `  <el-table-column
    v-if="mode !== 3"
    key="operation"
    fixed="right"
    align="center"
    :resizable="false"
    class-name="has-btn"
    width="100"
    label="操作"
  >
    <template #header>
      <el-button
        type="success"
        class="add-new-row"
        :icon="uiSetting.icon.addRow"
        @click="handleAdd()"
      >
        增加一行
      </el-button>
    </template>
    <template #default="{ $index }">
      <el-link type="primary" :underline="false" @click.stop="handleDelete($index)">
        删除
      </el-link>
    </template>
  </el-table-column>
</el-table>
</el-form>`
      }
    ]
  }
]
