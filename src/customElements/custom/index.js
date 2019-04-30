import CustomPalette from './CustomPalette'
import CustomRenderer from './CustomRenderer'
import CustomElementFactory from './CustomElementFactory'

export default {
  __init__: [
    'paletteProvider',
    'customRenderer',
  ],
  paletteProvider: ['type', CustomPalette],
  customRenderer: ['type', CustomRenderer],
  elementFactory: ['type', CustomElementFactory],
}
