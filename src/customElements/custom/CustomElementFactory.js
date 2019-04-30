import BpmnElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import { DEFAULT_LABEL_SIZE } from 'bpmn-js/lib/util/LabelUtil'
import { assign } from 'min-dash'
import { inherits } from 'util'

export default function CustomElementFactory (bpmnFactory, moddle) {
  BpmnElementFactory.call(this, bpmnFactory, moddle)
  const self = this

  this.create = function (elementType, attrs) {
    const type = attrs.type
    if (elementType === 'label') {
      return self.baseCreate(elementType, assign({ type: 'label' }, DEFAULT_LABEL_SIZE, attrs))
    }
    if (/^custom:/.test(type)) {
      if (!attrs.businessObject) {
        attrs.businessObject = {
          type: type
        }

        if (attrs.id) {
          assign(attrs.businessObject, {
            id: attrs.id
          })
        }
      }

      // add width and height if shape
      if (!/:connection$/.test(type)) {
        assign(attrs, self._getCustomElementSize(type))
      }

      // we mimic the ModdleElement API to allow interoperability with
      // other components, i.e. the Modeler and Properties Panel

      if (!('$model' in attrs.businessObject)) {
        Object.defineProperty(attrs.businessObject, '$model', {
          value: moddle
        })
      }

      if (!('$instanceOf' in attrs.businessObject)) {
        // ensures we can use ModelUtil#is for type checks
        Object.defineProperty(attrs.businessObject, '$instanceOf', {
          value: function (type) {
            return this.type === type
          }
        })
      }

      if (!('get' in attrs.businessObject)) {
        Object.defineProperty(attrs.businessObject, 'get', {
          value: function (key) {
            return this[key]
          }
        })
      }

      if (!('set' in attrs.businessObject)) {
        Object.defineProperty(attrs.businessObject, 'set', {
          value: function (key, value) {
            return this[key] = value // eslint-disable-line
          }
        })
      }

      // END minic ModdleElement API

      return self.baseCreate(elementType, attrs)
    }
    return self.createBpmnElement(elementType, attrs)
  }
}

inherits(CustomElementFactory, BpmnElementFactory)

CustomElementFactory.$inject = [
  'bpmnFactory',
  'moddle'
]

CustomElementFactory.prototype._getCustomElementSize = function (type) {
  const shapes = {
    __default: { width: 100, height: 80 },
    'custom:triangle': { width: 40, height: 40 },
    'custom:circle': { width: 140, height: 140 },
  }

  return shapes[type] || shapes.__default
}
