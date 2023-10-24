export const itemTypeList = [
  {
    type: 'text',
    name: '文本',
    width: 'width="200"',
    formatter: '',
    editableContentType: ['ElementUI', 'input'], // 级联选择器用数组
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'longText',
    name: '长文本',
    width: 'min-width="200"',
    formatter: '',
    editableContentType: ['ElementUI', 'input'],
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'enum',
    name: '枚举',
    width: 'width="100"',
    align: 'align="center"',
    formatter: '',
    editableContentType: ['ElementUI', 'select'],
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'number',
    name: '数值',
    width: ':width="uiSetting.table.number"',
    formatter: ' | currency',
    editableContentType: ['common', 'bs-amount-input'],
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'amount',
    name: '金额',
    width: ':width="uiSetting.table.amount"',
    align: 'align="right"',
    formatter: ' | currency(2)',
    editableContentType: ['common', 'bs-amount-input'],
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'date',
    name: '时间日期',
    width: ':width="uiSetting.table.dateTime"',
    align: 'align="center"',
    formatter: ` | dateTime('YYYY-MM-DD HH:mm:ss')`,
    editableContentType: ['ElementUI', 'date-picker'],
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  }
]
