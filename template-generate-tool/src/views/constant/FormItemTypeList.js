export const itemTypeList = [
  {
    type: 'text',
    name: '文本',
    componentName: 'el-input',
    attributeList: ['clearable'],
    options: {},
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
    componentName: 'el-input',
    attributeList: ['show-word-limit', 'maxlength="50"', 'type="textarea"'],
    options: {},
    enableRules: false,
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'bsSelect',
    name: 'bs选择',
    componentName: 'bs-select',
    attributeList: ['clearable', 'style="width: 100%"'],
    options: {
      enableInterface: true,
      optionList: [
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    },
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  },
  {
    type: 'elSelect',
    name: 'el选择',
    componentName: 'el-select',
    attributeList: ['clearable', 'style="width: 100%"'],
    options: {
      enableLoopOptions: false,
      defaultStatement:
        '<el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value" />',
      componentName: 'el-option',
      optionList: [
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    },
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  },
  {
    type: 'date',
    name: '时间日期',
    componentName: 'el-date-picker',
    attributeList: [
      'style="width: 100%"',
      'clearable',
      'type="date"',
      'value-format="yyyy-MM-dd"',
      `:picker-options="disableDatePickerOptions(search.startDate, search.endDate, 'begin/end')"`
      // 通常会在搜索栏出现，所以直接用search
    ],
    options: {},
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  },
  {
    type: 'number',
    name: '数值',
    componentName: 'bs-amount-input',
    attributeList: [],
    options: {},
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
    componentName: 'bs-amount-input',
    attributeList: [':precision="2"'],
    options: {},
    enableRules: false,
    rules: {
      required: true,
      trigger: 'blur',
      message: true,
      validator: false
    }
  },
  {
    type: 'bsRadio',
    name: 'bs单选',
    componentName: 'bs-radio-group',
    attributeList: [],
    options: {
      enableInterface: true,
      optionList: [
        // 按照选择器的value和label
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    },
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  },
  {
    type: 'elRadio',
    name: 'el单选',
    componentName: 'el-radio-group',
    attributeList: [],
    options: {
      enableLoopOptions: false,
      defaultStatement:
        '<el-radio v-for="item in radioList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>',
      componentName: 'el-radio',
      optionList: [
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    },
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  },
  {
    type: 'bsCheckbox',
    name: 'bs多选',
    componentName: 'bs-checkbox-group',
    attributeList: [],
    options: {
      enableInterface: true,
      optionList: [
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    },
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  },
  {
    type: 'elCheckbox',
    name: 'el多选',
    componentName: 'el-checkbox-group',
    attributeList: [],
    options: {
      enableLoopOptions: false,
      defaultStatement:
        '<el-checkbox v-for="item in checkboxList" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>',
      componentName: 'el-checkbox',
      optionList: [
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    },
    enableRules: false,
    rules: {
      required: true,
      trigger: 'change',
      message: true,
      validator: false
    }
  }
]
