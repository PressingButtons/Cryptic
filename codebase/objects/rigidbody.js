import GameObject from './gameobject.js';

const motionPropertyLength = 2

const RigidBody = function(width, height) {
  GameObject.call(this, width, height);
  this.motionData = new Int16Array(motionPropertyLength);
}

RigidBody.prototype = Object.create(GameObject.prototype);
RigidBody.prototype.constructor = RigidBody;

Object.defineProperties(RigidBody.prototype, {

  speedX: {get( ) { return this.motionData[0], set(n) {this.motionData[0] = n}}},
  speedY: {get( ) { return this.motionData[1], set(n) {this.motionData[1] = n}}},

});

export RigidBody;
