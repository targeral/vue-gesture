<script>
  import props from './props'
  import { PRESS, DIRECTION_ALL, DIRECTION_VERTICAL, DIRECTION_HORIZONTAL } from './config'
  import {
    calcRotation, assign,
    getEventName, now,
    calcMutliFingerStatus, calcMoveStatus,
    shouldTriggerSwipe, shouldTriggerDirection,
    getDirection, getDirectionEventName
  } from './util'

  const directionMap = {
    all: DIRECTION_ALL,
    vertical: DIRECTION_VERTICAL,
    horizontal: DIRECTION_HORIZONTAL
  }

  export default {
    name: 'gesture',
    render () {
      console.log(this.$slots.default[0])
      if (!this.$slots.default || this.$slots.default.length !== 1) {
        throw new Error('slots number is not one.')
      }
      const touchAction = this.getTouchAction()
      const on = {
        click: this._test,
        touchstart: this._handleTouchStart,
        touchmove: this._handleTouchMove,
        touchcancel: this._handleTouchCancel,
        touchend: this._handleTouchEnd
      }
      assign(
        this.$slots.default[0].data,
        {
          on,
          style: {
            ...this.$slots.default[0].data.style,
            touchAction
          }
        }
      )
      return this.$slots.default[0]
    },
    data () {
      return {
        gesture: null,
        pressTimer: null,
        event: null,
        directionSetting: null
      }
    },
    props: {
      direction: props.direction,
      enableRotate: {
        type: Boolean,
        default: false
      },
      enablePinch: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      _test () {
        console.log('test')
      },
      triggerCombineEvent (mainEventName, eventStatus) {
        this.$emit(mainEventName, this.gesture)
        this.triggerSubEvent(mainEventName, eventStatus)
      },
      triggerSubEvent (mainEventName, eventStatus) {
        if (eventStatus) {
          const subEventName = getEventName(mainEventName, eventStatus)
          this.$emit(subEventName, this.gesture)
        }
      },
      triggerPinchEvent (mainEventName, eventStatus) {
        const { scale } = this.gesture
        if (eventStatus === 'move' && typeof scale === 'number') {
          if (scale > 1) {
            this.$emit('onPinchOut', this.gesture)
          }
          if (scale < 1) {
            this.$emit('onPinchIn', this.gesture)
          }
        }
        this.triggerCombineEvent(mainEventName, eventStatus)
      },
      initPressTimer () {
        this.cleanPressTimer()
        this.pressTimer = setTimeout(() => {
          this.setGestureState({
            press: true
          })
          this.$emit('onPress', this.getGestureState())
        }, PRESS.time)
      },
      cleanPressTimer () {
        this.pressTimer && clearTimeout(this.pressTimer)
      },
      setGestureState (params) {
        if (!this.gesture) {
          this.gesture = {}
        }
        this.gesture = {
          ...this.gesture,
          ...params
        }
      },
      getGestureState () {
        if (!this.gesture) {
          return this.gesture
        } else {
          // shallow copy
          return {
            ...this.gesture
          }
        }
      },
      cleanGestureState () {
        delete this.gesture
      },
      getTouches (e) {
        // 类数组转化为数组
        return Array.prototype.slice.call(e.touches).map(item => ({
          x: item.screenX,
          y: item.screenY
        }))
      },
      triggerUserCb (status, e) {
        const eventName = getEventName('onTouch', status)
        this.$emit(eventName, e)
      },
      getTouchAction () {
        // https://developer.mozilla.org/zh-CN/docs/Web/CSS/touch-action
        const { enablePinch, enableRotate, directionSetting } = this
        if (enablePinch || enableRotate || directionSetting === DIRECTION_ALL) {
          return 'pan-x pan-y'
        }
        if (directionSetting === DIRECTION_VERTICAL) {
          return 'pan-x'
        }
        if (directionSetting === DIRECTION_HORIZONTAL) {
          return 'pan-y'
        }
        return 'auto'
      },
      _handleTouchStart (e) {
        console.log('touchstart')
        this.triggerUserCb('start', e)
        this.event = e
        if (e.touches.length > 1) {
          e.preventDefault()
        }
        this.initGestureStatus(e)
        this.initPressTimer()
        this.checkIfMultiTouchStart()
      },
      initGestureStatus (e) {
        this.cleanGestureState()
        // store the gesture start state
        const startTouches = this.getTouches(e)
        const startTime = now()
        const startMutliFingerStatus = calcMutliFingerStatus(startTouches)
        this.setGestureState({
          startTime,
          startTouches,
          startMutliFingerStatus,
          /* copy for next time touch move cala convenient */
          time: startTime,
          touches: startTouches,
          mutliFingerStatus: startMutliFingerStatus
        })
      },
      checkIfMultiTouchStart () {
        const { enablePinch, enableRotate } = this
        const { touches } = this.gesture
        if (touches.length > 1 && (enablePinch || enableRotate)) {
          if (enablePinch) {
            const startMutliFingerStatus = calcMutliFingerStatus(touches)
            this.setGestureState({
              startMutliFingerStatus,

              /* init pinch status */
              pinch: true,
              scale: 1
            })
            this.triggerCombineEvent('onPinch', 'start')
          }
          if (enableRotate) {
            this.setGestureState({
              /* init rotate status */
              rotate: true,
              rotation: 0
            })
            this.triggerCombineEvent('onRotate', 'start')
          }
        }
      },
      _handleTouchMove (e) {
        this.triggerUserCb('move', e)
        this.event = e
        if (!this.gesture) {
          // sometimes weird happen: touchstart -> touchmove..touchmove.. --> touchend --> touchmove --> touchend
          // so we need to skip the unnormal event cycle after touchend
          return
        }

        // not a long press
        this.cleanPressTimer()

        this.updateGestureStatus(e)
        this.checkIfSingleTouchMove()
        this.checkIfMultiTouchMove()
      },
      checkIfMultiTouchMove () {
        const { pinch, rotate, touches, startMutliFingerStatus, mutliFingerStatus } = this.gesture
        if (!pinch && !rotate) {
          return
        }
        if (touches.length < 2) {
          this.setGestureState({
            pinch: false,
            rotate: false
          })
          pinch && this.triggerCombineEvent('onPinch', 'cancel')
          rotate && this.triggerCombineEvent('onRotate', 'cancel')
          return
        }

        if (pinch) {
          const scale = mutliFingerStatus.z / startMutliFingerStatus.z
          this.setGestureState({
            scale
          })
          this.triggerPinchEvent('onPinch', 'move')
        }
        if (rotate) {
          const rotation = calcRotation(startMutliFingerStatus, mutliFingerStatus)
          this.setGestureState({
            rotation
          })
          this.triggerCombineEvent('onRotate', 'move')
        }
      },
      allowGesture () {
        return shouldTriggerDirection(this.gesture.direction, this.directionSetting)
      },
      checkIfSingleTouchMove () {
        const { pan, touches, moveStatus } = this.gesture
        if (touches.length > 1) {
          this.setGestureState({
            pan: false
          })
          pan && this.triggerCombineEvent('onPan', 'cancel')
          return
        }
        if (moveStatus) {
          const { x, y } = moveStatus
          const direction = getDirection(x, y)
          this.setGestureState({
            direction
          })
          const eventName = getDirectionEventName(direction)
          if (!this.allowGesture()) {
            return
          }
          if (!pan) {
            this.triggerCombineEvent('onPan', 'start')
            this.setGestureState({
              pan: true
            })
          } else {
            this.triggerCombineEvent('onPan', eventName)
            this.triggerSubEvent('onPan', 'move')
          }
        }
      },
      checkIfMultiTouchEnd (status) {
        const { pinch, rotate } = this.gesture
        if (pinch) {
          this.triggerCombineEvent('onPinch', status)
        }
        if (rotate) {
          this.triggerCombineEvent('onRotate', status)
        }
      },
      updateGestureStatus (e) {
        const time = now()
        this.setGestureState({
          time
        })
        if (!e.touches || !e.touches.length) {
          return
        }
        const { startTime, startTouches, pinch, rotate } = this.gesture
        const touches = this.getTouches(e)
        const moveStatus = calcMoveStatus(startTouches, touches, time - startTime)
        let mutliFingerStatus
        if (pinch || rotate) {
          mutliFingerStatus = calcMutliFingerStatus(touches)
        }

        this.setGestureState({
          /* update status snapshot */
          touches,
          mutliFingerStatus,
          /* update duration status */
          moveStatus
        })
      },
      _handleTouchEnd (e) {
        console.log('touchend')
        this.triggerUserCb('end', e)
        this.event = e
        if (!this.gesture) {
          return
        }
        this.cleanPressTimer()
        this.updateGestureStatus(e)
        this.doSingleTouchEnd('end')
        this.checkIfMultiTouchEnd('end')
      },
      _handleTouchCancel (e) {
        this.triggerUserCb('cancel', e)
        this.event = e
        // Todo: wait to test cancel case
        if (!this.gesture) {
          return
        }
        this.cleanPressTimer()
        this.updateGestureStatus(e)
        this.doSingleTouchEnd('cancel')
        this.checkIfMultiTouchEnd('cancel')
      },
      triggerAllowEvent (type, status) {
        if (this.allowGesture()) {
          this.triggerCombineEvent(type, status)
        } else {
          this.triggerSubEvent(type, status)
        }
      },
      doSingleTouchEnd (status) {
        const { moveStatus, pinch, rotate, press, pan, direction } = this.gesture

        if (pinch || rotate) {
          return
        }
        if (moveStatus) {
          const { z, velocity } = moveStatus
          // swipe的行为是和点之间的距离和速率有关吧
          const swipe = shouldTriggerSwipe(z, velocity)
          this.setGestureState({
            swipe
          })
          if (pan) {
            // pan need end, it's a process
            // sometimes, start with pan left, but end with pan right....
            // 就是说在这个过程会有pan事件的触发，但是有时候开始是向左的，但是结束时候向右，O__O "…
            this.triggerAllowEvent('onPan', status)
          }
          if (swipe) {
            const directionEvName = getDirectionEventName(direction)
            // swipe just need a direction, it`s a endpoint
            this.triggerAllowEvent('onSwipe', directionEvName)
            return
          }
        }

        if (press) {
          this.$emit('onPressUp')
          return
        }
        this.$emit('onTap')
      }
    },
    beforeCreate () {
      console.log('before create')
    },
    created () {
      console.log('created')
      this.directionSetting = directionMap[this.direction]
    },
    beforeMount () {
      console.log('before mount')
    },
    mounted () {
      console.log('mounted', this)
    },
    errorCaptured () {
      return false
    },
    beforeDestroy () {
      this.cleanPressTimer()
    }
  }
</script>