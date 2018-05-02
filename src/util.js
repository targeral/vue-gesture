import { SWIPE, DIRECTION_NONE, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_DOWN } from './config'

/**
 * @description 计算两个点之间的距离，可用于计算pinch的scale
 * @param {Number} x
 * @param {Number} y
 */
function _calcTriangleDistance (x, y) {
  return Math.sqrt(x * x + y * y)
}
/**
 * @description 计算相对于x轴正方向的角度，可用于计算两次手势之间的夹角
 * @param {*} x
 * @param {*} y
 */
function _calcAngle (x, y) {
  // https://blog.csdn.net/pecke/article/details/41014069
  const radian = Math.atan2(y, x)
  // 弧度转化为角度：弧度 * 180 / Math.PI
  return 180 / (Math.PI / radian)
}

export function assign (target, ...other) {
  return (target = Object.assign(target, ...other))
}

export function getEventName (prefix, status) {
  return prefix + status[0].toUpperCase() + status.slice(1)
}

export function shouldTriggerSwipe (delta, velocity) {
  return Math.abs(delta) >= SWIPE.threshold && Math.abs(velocity) > SWIPE.velocity
}

export function shouldTriggerDirection (direction, directionSetting) {
  console.log('directionSetting & direction', directionSetting & direction)
  if (directionSetting & direction) {
    return true
  }
  return false
}

export function now () {
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now
  return Date.now()
}

export function calcMutliFingerStatus (touches) {
  if (touches.length < 2) {
    return
  }
  const { x: x1, y: y1 } = touches[0]
  const { x: x2, y: y2 } = touches[1]
  const deltaX = x2 - x1
  const deltaY = y2 - y1
  return {
    x: deltaX,
    y: deltaY,
    z: _calcTriangleDistance(deltaX, deltaY),
    angle: _calcAngle(deltaX, deltaY)
  }
}

export function calcMoveStatus (startTouches, touches, time) {
  const { x: x1, y: y1 } = startTouches[0]
  const { x: x2, y: y2 } = touches[0]
  const deltaX = x2 - x1
  const deltaY = y2 - y1
  const deltaZ = _calcTriangleDistance(deltaX, deltaY)
  return {
    x: deltaX,
    y: deltaY,
    z: deltaZ,
    time,
    velocity: deltaZ / time,
    angle: _calcAngle(deltaX, deltaY)
  }
}

export function calcRotation (startMutliFingerStatus, mutliFingerStatus) {
  const { angle: startAngle } = startMutliFingerStatus
  const { angle } = mutliFingerStatus
  // 这里好像是逆时针是角度是正值，不知道为什么这么规定的
  return angle - startAngle
}

/**
 * @private
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
export function getDirection (x, y) {
  if (x === y) {
    return DIRECTION_NONE
  }

  if (Math.abs(x) >= Math.abs(y)) {
    return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT
  }
  // 没有理解这里，为什么y<0的时候是UP
  return y < 0 ? DIRECTION_UP : DIRECTION_DOWN
}

export function getDirectionEventName (direction) {
  let name
  switch (direction) {
    case DIRECTION_NONE:
      break
    case DIRECTION_LEFT:
      name = 'left'
      break
    case DIRECTION_RIGHT:
      name = 'right'
      break
    case DIRECTION_UP:
      name = 'up'
      break
    case DIRECTION_DOWN:
      name = 'down'
      break
    default:
  }
  return name
}
