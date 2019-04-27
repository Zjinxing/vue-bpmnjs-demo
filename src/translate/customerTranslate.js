import translations from './translation'

export default function customTranslate (template, replacements) {
  replacements = replacements || {}

  template = translations[template] || template
  return template.replace(/{([^}]+)}/g, (_, key) => replacements[key] || `{${key}}`)
}
