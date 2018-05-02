# vue-gesture
Support gesture for vue component. Refer to rc-gesture.

## Features



## Install

```bash
npm install --save euv-gesture
```

## Usage

``` html
<template>
    <Gesture
        @onTap="onTap($event)"
    >
        <div>container</div>
    </Gesture>
</template>
<script>
import Gesture from 'euv-gesture'
export default {
    methods: {
        onTap(gestureStatus) {
            console.log(gestureStatus)
        }
    },
    components: {
        Gesture
    }
}
</script>
```


## API

所有回调函数的参数`$event`实际上是一个`gestureStatus`，它包含了你需要的所有信息。具体信息查看[这里](#gesture)

### props:

#### common props
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>direction</td>
          <td>string</td>
          <th>`all`</th>
          <td>control the allowed gesture direction, could be `['all', 'vertical', 'horizontal']`</td>
      </tr>
</table>

#### Tap & Press
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onTap</td>
          <td>function</td>
          <th></th>
          <td>single tap callback</td>
      </tr>
      <tr>
          <td>onPress</td>
          <td>function</td>
          <th></th>
          <td>long tap callback</td>
      </tr>
      <tr>
          <td>onPressOut</td>
          <td>function</td>
          <th></th>
          <td>long tap end callback</td>
      </tr>
</table>

#### Swipe
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onSwipe</td>
          <td>function</td>
          <th></th>
          <td>swipe callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onSwipeLeft</td>
          <td>function</td>
          <th></th>
          <td>swipe left callback</td>
      </tr>
      <tr>
          <td>onSwipeRight</td>
          <td>function</td>
          <th></th>
          <td>swipe right callback</td>
      </tr>
      <tr>
          <td>onSwipeTop</td>
          <td>function</td>
          <th></th>
          <td>swipe top callback</td>
      </tr>
      <tr>
          <td>onSwipeBottom</td>
          <td>function</td>
          <th></th>
          <td>swipe bottom callback</td>
      </tr>
    </tbody>
</table>

#### Pan
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onPan</td>
          <td>function</td>
          <th></th>
          <td>pan callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onPanStart</td>
          <td>function</td>
          <th></th>
          <td>drag start callback</td>
      </tr>
      <tr>
          <td>onPanMove</td>
          <td>function</td>
          <th></th>
          <td>drag move callback</td>
      </tr>
      <tr>
          <td>onPanEnd</td>
          <td>function</td>
          <th></th>
          <td>drag end callback</td>
      </tr>
      <tr>
          <td>onPanCancel</td>
          <td>function</td>
          <th></th>
          <td>drag cancel callback</td>
      </tr>
      <tr>
          <td>onPanLeft</td>
          <td>function</td>
          <th></th>
          <td>pan left callback</td>
      </tr>
      <tr>
          <td>onPanRight</td>
          <td>function</td>
          <th></th>
          <td>pan right callback</td>
      </tr>
      <tr>
          <td>onPanTop</td>
          <td>function</td>
          <th></th>
          <td>pan top callback</td>
      </tr>
      <tr>
          <td>onPanBottom</td>
          <td>function</td>
          <th></th>
          <td>pan bottom callback</td>
      </tr>
    </tbody>
</table>

#### Pinch

pinch gesture is not enabled by default, you must set `enablePinch = true or enablePinch` in component:

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onPinch</td>
          <td>function</td>
          <th></th>
          <td>pinch callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onPinchStart</td>
          <td>function</td>
          <th></th>
          <td>pinch start callback</td>
      </tr>
      <tr>
          <td>onPinchMove</td>
          <td>function</td>
          <th></th>
          <td>pinch move callback</td>
      </tr>
      <tr>
          <td>onPinchEnd</td>
          <td>function</td>
          <th></th>
          <td>pinch end callback</td>
      </tr>
      <tr>
          <td>onPanCancel</td>
          <td>function</td>
          <th></th>
          <td>pinch cancel callback</td>
      </tr>
      <tr>
          <td>onPinchIn</td>
          <td>function</td>
          <th></th>
          <td>pinch in callback</td>
      </tr>
      <tr>
          <td>onPinchOut</td>
          <td>function</td>
          <th></th>
          <td>pinch out callback</td>
      </tr>
    </tbody>
</table>


#### Rotate

pinch gesture is not enabled by default, you must set `props.enableRotate = true` at first;

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>onRotate</td>
          <td>function</td>
          <th></th>
          <td>rotate callback, will triggered at the same time of all of below callback</td>
      </tr>
      <tr>
          <td>onRotateStart</td>
          <td>function</td>
          <th></th>
          <td>rotate start callback</td>
      </tr>
      <tr>
          <td>onRotateMove</td>
          <td>function</td>
          <th></th>
          <td>rotate move callback</td>
      </tr>
      <tr>
          <td>onRotateEnd</td>
          <td>function</td>
          <th></th>
          <td>rotate end callback</td>
      </tr>
      <tr>
          <td>onRotateCancel</td>
          <td>function</td>
          <th></th>
          <td>rotate cancel callback</td>
      </tr>
    </tbody>
</table>

## gesture

```tsx
// http://hammerjs.github.io/api/#event-object
export interface IGestureStauts {
    /* start status snapshot */
    startTime: number;
    startTouches: Finger[];

    startMutliFingerStatus?: MultiFingerStatus[];

    /* now status snapshot */
    time: number;
    touches: Finger[];

    mutliFingerStatus?: MultiFingerStatus[];

    /* delta status from touchstart to now, just for singe finger */
    moveStatus?: SingeFingerMoveStatus;

    /* whether is a long tap */
    press?: boolean;

    /* whether is a swipe*/
    swipe?: boolean;
    direction?: number;

    /* whether is in pinch process */
    pinch?: boolean;
    scale?: number;

    /* whether is in rotate process */
    rotate?: boolean;
    rotation?: number; // Rotation (in deg) that has been done when multi-touch. 0 on a single touch.
};
```

## Development

```
npm install
npm start
```