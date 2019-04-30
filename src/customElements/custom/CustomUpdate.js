import inherits from 'inherits'
import { pick, assign } from 'min-dash'

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor'
import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections'

export default function CustomUpdater (eventBus, modeling, bpmnjs) {
  CommandInterceptor.call(this, eventBus)

  function updateCustomElement (e) {
    const context = e.context
    const shape = context.shape
    const { businessObject } = shape

    if (!isCustom(shape)) {
      return
    }
    const parent = shape.parent
    const customElements = bpmnjs._customElements

    if (!parent) {
      collectionRemove(customElements, businessObject)
    } else {
      collectionAdd(customElements, businessObject)
    }
    assign(businessObject, pick(shape, ['x', 'y']))
  }
  function updateCustomConnection (e) {
    const context = e.context
    const { connection } = context
    const { source, target, businessObject, parent } = connection

    const customElements = bpmnjs._customElements

    if (!parent) {
      collectionRemove(customElements, businessObject)
    } else {
      collectionAdd(customElements, businessObject)
    }

    assign(businessObject, {
      waypoints: copyWaypoints(connection)
    })

    if (source && target) {
      assign(businessObject, {
        source: source.id,
        target: target.id
      })
    }
  }
  this.executed([
    'shape.create',
    'shape.move',
    'shape.delete'
  ], ifCustomElement(updateCustomElement))

  this.reverted([
    'shape.create',
    'shape.move',
    'shape.delete'
  ], ifCustomElement(updateCustomElement))
}

inherits(CustomUpdater, CommandInterceptor)
CustomUpdater.$inject = ['eventBus', 'modeling', 'bpmnjs']

function isCustom (element) {
  return element && /custom:/.test(element.type)
}

function copyWaypoints (connection) {
  return connection.waypoints.map(p => ({ x: p.x, y: p.y }))
}

function ifCustomElement (fn) {
  return function (event) {
    const context = event.context
    const element = context.shape || context.connection

    if (isCustom(element)) {
      fn(event)
    }
  }
}
