export const itemTypeList = [
  {
    type: 'text',
    name: '文本',
    width: 'width="200"',
    enableCustomContent: false,
    formatter: '',
    enableEditableContent: false,
    editableContentType: ['ElementUI', 'input'], // 级联选择器用数组
    enableRules: false,
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
    enableCustomContent: false,
    formatter: '',
    enableEditableContent: false,
    editableContentType: ['ElementUI', 'input'],
    enableRules: false,
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
    enableCustomContent: true,
    formatter: '',
    enableEditableContent: false,
    editableContentType: ['ElementUI', 'select'],
    enableRules: false,
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
    enableCustomContent: true,
    formatter: ' | currency',
    enableEditableContent: false,
    editableContentType: ['common', 'bs-amount-input'],
    enableRules: false,
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
    enableCustomContent: true,
    formatter: ' | currency(2)',
    enableEditableContent: false,
    editableContentType: ['common', 'bs-amount-input'],
    enableRules: false,
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
    enableCustomContent: false,
    formatter: ` | dateTime('YYYY-MM-DD HH:mm:ss')`,
    enableEditableContent: false,
    editableContentType: ['ElementUI', 'date-picker'],
    enableRules: false,
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  }
]
