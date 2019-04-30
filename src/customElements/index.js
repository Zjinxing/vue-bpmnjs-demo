import CustomRender from './customRenderer'
import CustomPalette from './CustomPalette'
import CustomContextPad from './CustomContextPad'

export default {
  __init__: ['customPalette', 'customRender'],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: ['type', CustomPalette],
  customRender: ['type', CustomRender]
}
