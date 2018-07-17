/* global Module */

/* Magic Mirror
 * Module: MMM-Leap-Motion
 *
 * By Peter Schmalfeldt
 * MIT Licensed.
 */

Module.register('MMM-Leap-Motion', {
  requiresVersion: '2.1.0',

  defaults: {
    watchGestureUp: true,
    watchGestureDown: true,
    watchGestureLeft: true,
    watchGestureRight: true,
    watchGestureForward: true,
    watchGestureBack: true,
    watchGestureClockwise: true,
    watchGestureCounterClockwise: true,
    orientation: 'up'
  },

  currentPage: 0,

  lastGesture: '',

  gesture: 'LEAP_MOTION_HAND_MISSING',

  start: function () {
    this.sendSocketNotification('LEAP_MOTION_INIT', this.config);
  },

  getStyles: function() {
    return ['MMM-Leap-Motion.css'];
  },

	getDom: function() {
    var wrapper = document.createElement('div');

    wrapper.id = 'leap-motion-indicator';
    wrapper.className = this.gesture.toLowerCase();

    return wrapper;
	},

  updateStatus: function () {
    document.getElementById('leap-motion-indicator').className = this.gesture.toLowerCase();
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'LEAP_MOTION_GESTURE' && typeof payload === 'string' && payload !== this.lastGesture) {
      this.sendNotification(payload);
      this.lastGesture = this.gesture;
      this.gesture = payload;
      this.updateStatus();
    }
  }
});
