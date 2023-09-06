export const componentTypeList = [
  {
    value: 'ElementUI',
    label: 'ElementUI',
    children: [
      {
        value: 'input',
        label: 'Input 输入框',
        template: '<el-input v-model="row.field" placeholder="请输入" />'
      },
      {
        value: 'select',
        label: 'Select 选择器',
        template: `<el-select v-model="row.field" style="width: 100%" placeholder="请选择">\n\t\t\t<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />\n\t\t</el-select>`
      },
      {
        value: 'date-picker',
        label: 'DatePicker 日期选择器',
        template:
          '<el-date-picker v-model="row.field" clearable type="date" style="width: 100%" placeholder="请选择" />'
      },
      {
        value: 'radio',
        label: 'Radio 单选框',
        template:
          '<el-radio-group v-model="row.field">\n\t\t\t<el-radio v-for="item in radioList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>\n\t\t</el-radio-group>'
      },
      {
        value: 'checkbox',
        label: 'Checkbox 多选框',
        template:
          '<el-checkbox-group v-model="row.field">\n\t\t\t<el-checkbox v-for="item in checkboxList" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>\n\t\t</el-checkbox-group>'
      }
    ]
  },
  {
    value: 'common',
    label: '基础组件',
    children: [
      {
        value: 'bs-select',
        label: 'BsSelect 选择器',
        template: `<bs-select v-model="row.field" :api-config="{method: 'applicationList', restful: false, data: {}, params: {}}" :option-config="{value: 'code', label: 'name'}" />`
      },
      {
        value: 'bs-amount-input',
        label: 'BsAmountInput 金额输入框',
        template:
          '<bs-amount-input v-model="row.field" placeholder="请输入" :precision="2" />'
      },
      {
        value: 'bs-tree-select',
        label: 'BsTreeSelect 下拉树',
        template: `<bs-tree-select :disabled-value-array="[350002001]" v-model="row.field" api-config="regionTreeAll" :tree-config="{ props: { label: 'regionName', value: 'regionCode' }}" />`
      },
      {
        value: 'bs-table-select',
        label: 'BsTableSelect 下拉表格',
        template: `<bs-table-select v-model="row.field" api-config="queryTableSelectData" :option-config="{ value: 'regionCode', label: 'regionName', header:[{prop:'regionCode',label: '区划编码', width: 120}]}" />`
      }
    ]
  },
  {
    value: 'business',
    label: '业务组件',
    children: [
      // 只有选择器，没有单位树、开票点树、单位开票点树
      {
        value: 'bs-agency-tree-select',
        label: 'BsAgencyTreeSelect 单位下拉树',
        template:
          '<bs-agency-tree-select show-mode="name" v-model="row.field" />'
      },
      {
        value: 'bs-place-tree-select',
        label: 'BsPlaceTreeSelect 开票点下拉树',
        template:
          '<bs-place-tree-select show-mode="name" lazy v-model="row.field" />'
      },
      {
        value: 'bs-agency-place-tree-select',
        label: 'BsAgencyPlaceTreeSelect 单位开票点下拉树',
        template:
          '<bs-agency-place-tree-select show-mode="name" @agency-click="handleAgencyClick" @place-click="handlePlaceClick" />'
      },
      {
        value: 'bs-agency-place-select',
        label: 'BsAgencyPlaceSelect 单位开票点选择器',
        template:
          '<bs-agency-place-select v-model="row.field" show-mode="name" data-scope="EFFECTIVE" />'
      },
      {
        value: 'bs-bill-select',
        label: 'BsBillSelect 票据种类选择器',
        template:
          '<bs-bill-select v-model="row.field" show-mode="name" bill-natures="NONTAX,PAY_BOOK" invoice-modes="ELECTRONIC,MACHINE,HAND" />'
      },
      {
        value: 'bs-place-effective-bill-select',
        label: 'BsPlaceEffectiveBillSelect 开票点可用票据种类选择器',
        template:
          '<bs-place-effective-bill-select v-model="row.field" show-mode="name" bill-natures="NONTAX,PAY_BOOK" invoice-modes="ELECTRONIC,MACHINE,HAND" />'
      },
      {
        value: 'bs-bill-batch-select',
        label: 'BsBillBatchSelect 票据代码选择器',
        template:
          '<bs-bill-batch-select v-model="row.field" bill-species-id="c7a53ed279484440a0b78f9109501d93" show-mode="name" />'
      },
      {
        value: 'bs-dict-select',
        label: 'BsDictSelect 数据字典选择器',
        template:
          '<bs-dict-select v-model="row.field" dict-type="PAYER_CERTIFICATE_TYPE" show-mode="codeName" />'
      },
      {
        value: 'bs-db-dict-select',
        label: 'BsDbDictSelect 数据字典选择器',
        template:
          '<bs-db-dict-select v-model="row.field" dict-type="personal_certificate" show-mode="codeName" />'
      },
      {
        value: 'bs-item-select',
        label: 'BsItemSelect 收费项目选择器',
        template:
          '<bs-item-select v-model="row.field" show-mode="name" bill-species-id="1" payment-modes="DIRECT,CONCENTRATE" funds-natures="BUDGET_MANAGEMENT,FINANCIAL_SPECIAL_MANAGEMENT" />'
      },
      {
        value: 'bs-item-grid',
        label: 'BsItemGrid 收费项目-不带标准',
        template:
          '<bs-item-grid pageable v-model="row.field" column="code,name" bill-species-id="1" payment-modes="DIRECT,CONCENTRATE" funds-natures="BUDGET_MANAGEMENT,FINANCIAL_SPECIAL_MANAGEMENT" />'
      },
      {
        value: 'bs-std-item-grid',
        label: 'BsStdItemGrid 收费项目-带标准',
        template:
          '<bs-std-item-grid column="code,name" pageable v-model="row.field" bill-species-id="1" payment-modes="DIRECT,CONCENTRATE" funds-natures="BUDGET_MANAGEMENT,FINANCIAL_SPECIAL_MANAGEMENT" />'
      },
      {
        value: 'bs-place-effective-std-item-grid',
        label: 'BsPlaceEffectiveStdItemGrid 开票点可用收费项目-带标准',
        template:
          '<bs-place-effective-std-item-grid column="code,name" pageable v-model="row.field" bill-species-id="1" payment-modes="DIRECT,CONCENTRATE" funds-natures="BUDGET_MANAGEMENT,FINANCIAL_SPECIAL_MANAGEMENT" />'
      },
      {
        value: 'bs-place-effective-item-grid',
        label: 'BsPlaceEffectiveItemGrid 开票点可用收费项目-不带标准',
        template:
          '<bs-place-effective-item-grid column="code,name" pageable v-model="row.field" bill-species-id="1" payment-modes="DIRECT,CONCENTRATE" funds-natures="BUDGET_MANAGEMENT,FINANCIAL_SPECIAL_MANAGEMENT" />'
      },
      {
        value: 'bs-item-std-grid',
        label: 'BsItemStdGrid 收费项目标准',
        template:
          '<bs-item-std-grid v-model="row.field" column="code,name" item-id-code="230020000295"/>'
      },
      {
        value: 'bs-place-effective-item-std-grid',
        label: 'BsPlaceEffectiveItemStdGrid 开票点可用收费项目标准',
        template:
          '<bs-place-effective-item-std-grid v-model="row.field" column="code,name" item-id-code="230020000295"/>'
      },
      {
        value: 'bs-receiver-account-table-select',
        label: 'BsReceiverAccountTableSelect 收款账户表格选择器组件',
        template:
          '<bs-receiver-account-table-select v-model="row.field" column="code,name,bankOpenName" column="code,name,bankOpenName" :clearable="false" :account-adapt-scope="1" :pay-book-bill-id="1" />'
      },
      {
        value: 'bs-pay-book-select',
        label: 'BsPayBookSelect 缴款书类型选择器组件',
        template:
          '<bs-pay-book-select v-model="row.field" show-mode="name" :funds-natures="fundsNatures" :account-id-code="accountIdCode" :adapt-scope="adaptScope" />'
      }
    ]
  }
]
