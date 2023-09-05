export const componentTemplate = `
    <$componentName
      v-model="$formDataNameStr.$prop"$attributes$placeholder
    >$optionsContent</$componentName>
`

export const ruleTemplate = `\n  $prop: [{$required$trigger$message$validator\n\t}],`
