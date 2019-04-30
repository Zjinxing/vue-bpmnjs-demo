import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import inherits from 'inherits'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

export default function CustomRenderer (eventBus, styles) {
  BaseRenderer.call(this, eventBus, 2000)
  const computeStyle = styles.computeStyle
  this.drawTriangle = function (p, side) {
    console.log('draw triangle')
    let halfSide = side / 2
    let points
    let attrs
    points = [halfSide, 0, side, side, 0, side]
    attrs = computeStyle(attrs, {
      stroke: '#cfc',
      strokeWidth: 2,
      fill: '#fff'
    })
    const polygon = svgCreate('polygon')
    svgAttr(polygon, { points })
    svgAttr(polygon, attrs)
    svgAppend(p, polygon)
    return polygon
  }
  this.getTrianglePath = function (element) {
    console.log('trianglePath', element)
  }
  this.drawCircle = function (p, width, height) {
    console.log('Circle')
  }
  this.getCirclePath = function (shape) {
    console.log('circlePath: ', shape)
  }
  this.drawCustomConnection = function (p, element) {
    console.log('draw connection')
  }
  this.getCustomConnectionPath = function (connection) {
    console.log('connection')
  }
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles']
CustomRenderer.prototype.canRender = function (element) {
  return /^custom:/.test(element.type)
}

CustomRenderer.prototype.drawShape = function (p, element) {
  const type = element.type
  if (type === 'custom:triangle') {
    return this.drawTriangle(p, element.width)
  }
  if (type === 'custom:circle') {
    return this.drawCircle(p, element.width, element.height)
  }
}

CustomRenderer.prototype.getShapePath = function (shape) {
  const type = shape.type

  if (type === 'custom:triangle') {
    return this.getTrianglePath(shape)
  }
  if (type === 'custom:circle') {
    return this.getCirclePath(shape)
  }
}

CustomRenderer.prototype.drawConnection = function (p, element) {
  const type = element.type
  if (type === 'custom:connection') {
    return this.drawCustomConnection(p, element)
  }
}

CustomRenderer.prototype.getConnectionPath = function (connection) {
  const type = connection.type
  if (type === 'custom:connection') {
    return this.getCustomConnectionPath(connection)
  }
}

// class CustomRenderer extends BaseRenderer {}
//
// export default CustomRenderer
