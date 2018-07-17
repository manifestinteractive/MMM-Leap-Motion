/* Magic Mirror
 * Module: MMM-Leap-Motion
 *
 * By Peter Schmalfeldt
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var Cylon = require('cylon');

module.exports = NodeHelper.create({
	socketNotificationReceived: function (notification, payload) {
    if (notification === 'LEAP_MOTION_INIT' && typeof payload === 'object') {
			var self = this;
			var config = payload;
			var lastGesture = '';
			var handPresent = false;
			var timer = null;

			Cylon.robot({
				connections: {
					leapmotion: { adaptor: 'leapmotion' }
				},

				devices: {
					leapmotion: { driver: 'leapmotion' }
				},

				work: function(device) {
					device.leapmotion.on('hand', function(payload) {
						if (!handPresent) {
							handPresent = true;
							lastGesture = 'hand_present';
							self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_HAND_DETECTED');
						}

						clearTimeout(timer);
						timer = setTimeout(function(){
							handPresent = false;
							lastGesture = 'hand_gone';
							self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_HAND_MISSING');
						}, 1000);
					});

					device.leapmotion.on('gesture', function(gesture) {
						var direction = 'no motion';

						var correctDirection = function (direction) {
							var orientation = {
								forward: {
									left: 'left',
									right: 'right',
									down: 'forward',
									up: 'back',
									forward: 'up',
									back: 'down'
								},
								up: {
									left: 'left',
									right: 'right',
									down: 'down',
									up: 'up',
									forward: 'forward',
									back: 'back'
								}
							};

							return orientation[config.orientation][direction];
						}

						if (gesture.type === 'swipe') {
							var xdiff = (gesture.startPosition[0] - gesture.position[0]);
							var ydiff = (gesture.startPosition[1] - gesture.position[1]);
							var zdiff = (gesture.startPosition[2] - gesture.position[2]);

							var movements = [
								{
									distance: Math.abs(xdiff),
									coordinate: 'x',
									type: (xdiff > 0) ? correctDirection('left') : correctDirection('right')
								},
								{
									distance: Math.abs(ydiff),
									coordinate: 'y',
									type: (ydiff > 0) ? correctDirection('down') : correctDirection('up')
								},
								{
									distance : Math.abs(zdiff),
									coordinate : 'z',
									type : (zdiff > 0) ? correctDirection('forward') : correctDirection('back')
								}
							];

							// sort movements based on furthest distance
							movements.sort(function(a, b) {
								return b['distance'] - a['distance'];
							});

							// return the movement type with the greatest change in distance
							direction = movements[0].type;

						} else if (gesture.type === 'circle') {
							direction = (gesture.normal[2] > 0) ? 'counter-clockwise' : 'clockwise';
						}

						if (lastGesture !== direction) {
							if (config.watchGestureUp && direction === 'up') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_UP');
								lastGesture = direction;
							} else if (config.watchGestureDown && direction === 'down') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_DOWN');
								lastGesture = direction;
							} else if (config.watchGestureLeft && direction === 'left') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_LEFT');
								lastGesture = direction;
							} else if (config.watchGestureRight && direction === 'right') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_RIGHT');
								lastGesture = direction;
							} else if (config.watchGestureForward && direction === 'forward') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_FORWARD');
								lastGesture = direction;
							} else if (config.watchGestureBack && direction === 'back') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_BACK');
								lastGesture = direction;
							} else if (config.watchGestureClockwise && direction === 'clockwise') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_GESTURE_CLOCKWISE');
								lastGesture = direction;
							} else if (config.watchGestureCounterClockwise && direction === 'counter-clockwise') {
								self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_GESTURE_COUNTER_CLOCKWISE');
								lastGesture = direction;
							}
						}
					});
				}
			}).start();
    }
  }
});
