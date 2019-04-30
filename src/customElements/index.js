import Modeler from 'bpmn-js/lib/Modeler'
import CustomModule from './custom'
import { assign } from 'min-dash'

export default class CustomModeler extends Modeler {
  constructor (options) {
    super(options)
    this._customElements = []
  }

  _addCustommShape (customElement) {
    this._customElements.push(customElement)
    const canvas = this.get('canvas')
    const elementFactory = this.get('elementFactory')
    const customAttrs = assign({ businessObject: customElement }, customElement)
    const customShape = elementFactory.create('shape', customAttrs)
    return canvas.addShape(customShape)
  }
}

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [CustomModule]
)
