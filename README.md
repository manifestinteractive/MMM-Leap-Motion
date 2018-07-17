# MMM-Leap-Motion

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Add [Leap Motion](https://www.leapmotion.com) support to Magic Mirror.

![screenshot](https://peter.build/magic-mirror/mmm-nest-leap-motion.gif)

**IMPORTANT: This ONLY works with the Native Leap Motion App**

You will not be able to use this with the Raspberry Pi, or any other hardware that does not have the [Native Leap Motion App](https://www.leapmotion.com/setup/desktop) running in the background.  Your Magic Mirror computer will need to be powerful enough to meet the [Minimum Requirements](https://support.leapmotion.com/hc/en-us/articles/223783668-What-are-the-system-requirements-) to run the Leap Motion Controller.

## Features

- [X] Visual Indicator when your hand is detected, letting you know you can make a gesture
- [X] Visual Representation of Gestures on Screen
- [X] Supports Swipe Gestures:  Up, Down, Left, Right, Forward & Back
- [X] Supports Circle Gestures:  Clockwise, Counter Clockwise
- [X] Ability to limit which gestures you want to watch for

## Installation

Make sure you have the Leap Motion Controller software running in the background, and then perform the following:

```bash
cd /home/pi/MagicMirror
git clone https://github.com/manifestinteractive/MMM-Leap-Motion ./modules/MMM-Leap-Motion
cd ./modules/MMM-Leap-Motion
npm install
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-Leap-Motion'
      position: 'top_bar',
      config: {
        watchGestureUp: true,
        watchGestureDown: true,
        watchGestureLeft: true,
        watchGestureRight: true,
        watchGestureForward: true,
        watchGestureBack: true,
        watchGestureClockwise: true,
        watchGestureCounterClockwise: true,
        orientation: 'up'
      }
    }
  ]
}
```

## Notifications

You can watch for Leap Motion Gestures in your modules via:

```js
notificationReceived: function(notification) {
  if (notification === 'LEAP_MOTION_HAND_DETECTED') {
    // Do something cool
  }
}
```

Here are all the notifications this module will send:

Notification                            | Description
----------------------------------------|----------------------------------------------------------------
`LEAP_MOTION_HAND_DETECTED`             | When a hand is detected, letting you know you can make a gesture
`LEAP_MOTION_HAND_MISSING`              | Hand is no longer detected, no gestures will work
`LEAP_MOTION_SWIPE_UP`                  | Swipe Up Detected
`LEAP_MOTION_SWIPE_DOWN`                | Swipe Down Detected
`LEAP_MOTION_SWIPE_LEFT`                | Swipe Left Detected
`LEAP_MOTION_SWIPE_RIGHT`               | Swipe Right Detected
`LEAP_MOTION_SWIPE_FORWARD`             | Swipe Forward Detected
`LEAP_MOTION_SWIPE_BACK`                | Swipe Back Detected
`LEAP_MOTION_GESTURE_CLOCKWISE`         | Palm of Hand made Clockwise Rotation
`LEAP_MOTION_GESTURE_COUNTER_CLOCKWISE` | Palm of Hand made Counter Clockwise Rotation

## Configuration options

Option                         | Type      | Default | Description
-------------------------------|-----------|---------|--------------------------------------------------------------
`watchGestureUp`               | `boolean` | `true`  | Watch Swipe Up Gestures
`watchGestureDown`             | `boolean` | `true`  | Watch Swipe Down Gestures
`watchGestureLeft`             | `boolean` | `true`  | Watch Swipe Left Gestures
`watchGestureRight`            | `boolean` | `true`  | Watch Swipe Right Gestures
`watchGestureForward`          | `boolean` | `true`  | Watch Swipe Forward Gestures
`watchGestureBack`             | `boolean` | `true`  | Watch Swipe Back Gestures
`watchGestureClockwise`        | `boolean` | `true`  | Watch Swipe Clockwise Gestures
`watchGestureCounterClockwise` | `boolean` | `true`  | Watch Swipe Counter Clockwise Gestures
`orientation`                  | `string`  | `up`    | Orientation of Leap Motion Controller: `up` = glass facing ceiling, `forward` = glass facing wall

NOTE:  The `orientation` automatically changes the up, down, forward & back to more intuitive.  In order to make this work correctly, make sure the Leap Motion logo on the back of the controller is facing the top of the device, otherwise you're going to have a hard time.


## Integration with MMM-Page-Selector

I integrated this module with the [MMM-Page-Selector](https://github.com/Veldrovive/MMM-Page-Selector) file by adding the following code to the end of the `notificationReceived` function in the MMM-Page-Selector.js file.

```js
if (notification === 'LEAP_MOTION_SWIPE_LEFT') {
  let indexOfPage = Object.keys(self.pages).indexOf(self.page);

  indexOfPage = indexOfPage + 1;

  if (indexOfPage >= Object.keys(self.pages).length) {
    indexOfPage = 0;
  }

  self.sendSocketNotification('RELAY_PAGE_SELECT', Object.keys(self.pages)[indexOfPage]);
} else if (notification === 'LEAP_MOTION_SWIPE_RIGHT') {
  let indexOfPage = Object.keys(self.pages).indexOf(self.page);

  indexOfPage = indexOfPage - 1;

  if (indexOfPage < 0) {
    indexOfPage = (Object.keys(self.pages).length - 1);
  }

  self.sendSocketNotification('RELAY_PAGE_SELECT', Object.keys(self.pages)[indexOfPage]);
}
```
