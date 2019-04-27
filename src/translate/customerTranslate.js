import translations from './translation'

// bpmn-js-i18n 中未列出的
const extraTranslate = {
  StartEvent: '开始事件',
  EndEvent: '结束事件',
  Task: '任务',
  DataObjectReference: '数据对象',
  DataStoreReference: '数据存储库'
}
export default function customTranslate (template, replacements) {
  replacements = replacements || {}

  template = translations[template] || template
  return template.replace(/{([^}]+)}/g, (_, key) => {
    console.log(replacements[key])

    return extraTranslate[replacements[key]] || `{${key}}`
  })
}
