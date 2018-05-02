<template>
  <div class="demo">
    <!-- <section class="demo-container">
      <v-row class="grid-row">
        <v-col class="grid-col" :span="12">col-12</v-col>
        <v-col class="grid-col" :span="12">col-12</v-col>
      </v-row>
      <v-row class="grid-row">
        <v-col class="grid-col" :span="8">col-8</v-col>
        <v-col class="grid-col" :span="8">col-8</v-col>
        <v-col class="grid-col" :span="8">col-8</v-col>
      </v-row>
      <v-row class="grid-row">
        <v-col class="grid-col" :span="6">col-6</v-col>
        <v-col class="grid-col" :span="6">col-6</v-col>
        <v-col class="grid-col" :span="6">col-6</v-col>
        <v-col class="grid-col" :span="6">col-6</v-col>
      </v-row>
    </section> -->
    <Gesture
      direction="all"
      enablePinch
      enableRotate
      @onTap="log"
      @onPress="log('onPress', $event)"
      @onPressUp="log('onPressUp', $event)"
      @onSwipe="log('onSwipe', $event)"
      @onSwipeLeft="log('onSwipeLeft', $event)"
      @onSwipeRight="log('onSwipeRight', $event)"
      @onSwipeUp="log('onSwipeUp', $event)"
      @onSwipeDown="log('onSwipeDown', $event)"
      @onPinch="log('onPinch', $event)"
      @onPinchStart="log('onPinchStart', $event)"
      @onPinchMove="log('onPinchMove', $event)"
      @onPinchEnd="log('onPinchEnd', $event)"
      @onPinchCancel="log('onPinchCancel', $event)"
      @onPinchIn="log('onPinchIn', $event)"
      @onPinchOut="log('onPinchOut', $event)"
      @onRotate="log('onRotate', $event)"
      @onRotateStart="log('onRotateStart', $event)"
      @onRotateMove="log('onRotateMove', $event)"
      @onRotateEnd="log('onRotateEnd', $event)"
      @onRotateCancel="log('onRotateCancel', $event)"
      @onPan="log('onPan', $event)"
      @onPanStart="log('onPanStart', $event)"
      @onPanMove="log('onPanMove', $event)"
      @onPanEnd="log('onPanEnd', $event)"
      @onPanCancel="log('onPanCancel', $event)"
      @onPanLeft="log('onPanLeft', $event)"
      @onPanRight="log('onPanRight', $event)"
      @onPanUp="log('onPanUp', $event)"
      @onPanDown="log('onPanDown', $event)"
    >
      <div :style="style">1</div>
    </Gesture>
  </div>
</template>

<script>
import VRow from '@components/row'
import VCol from '@components/col'
import { Gesture } from '@components'

export default {
  name: 'demo',
  data () {
    return {
      transform: null,
      baseStyle: {
        width: '100px',
        height: '100px',
        background: 'red'
      }
    }
  },
  computed: {
    style () {
      let transform = this.transform
      return {
        transform,
        ...this.baseStyle
      }
    }
  },
  methods: {
    test () {
      console.log('touch start')
    },
    log (type, ...args) {
      console.log(args)
      window.requestAnimationFrame(() => {
        this.doTransform(type, ...args)
      })
    },
    doTransform (type, ...args) {
      if (type === 'onPinch') {
        const { scale } = args[0]
        this._scale = scale
      }
      if (type === 'onRotate') {
        const { rotation } = args[0]
        this._rotation = rotation
      }
      if (type === 'onPan') {
        const { x, y } = args[0].moveStatus
        this._x = x
        this._y = y
      }
      if (type === 'onPanEnd' || type === 'onPanCancel') {
        // const { x, y } = args[0].moveStatus
        this._x = 0
        this._y = 0
      }
      let transform = []
      this._scale && transform.push(`scale(${this._scale})`)
      this._rotation && transform.push(`rotate(${this._rotation}deg)`)
      typeof this._x === 'number' && transform.push(`translateX(${this._x}px)`)
      typeof this._y === 'number' && transform.push(`translateY(${this._y}px)`)
      transform = transform.join(' ')
      this.transform = transform
    }
  },
  components: {
    VRow,
    VCol,
    Gesture
  }
}
</script>

<style lang="less">
.demo-container {
  position: relative;
  text-align: left;
  padding: 42px 20px 50px;
}
.grid-row {
  margin: 8px 0;
  &-flex {
    padding: 8px 0;
    background-color: #f5f5f5;
  }
}
.grid-col {
  background-color: #00a0e9;
  color: #fff;
  padding: 16px 0;
  &:nth-child(odd) {
    background-color: rgba(0,160,233,.7)
  }
}
</style>
