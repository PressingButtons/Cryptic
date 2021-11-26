import GameObject from './gameobject.js';

const motionPropertyLength = 6

const RigidBody = function(width, height, body) {
  GameObject.call(this, width, height);
  this.speeds = new Float32Array([0,0]);
  this.body = new Uint16Array(body);
  //
  this.speed_x = this.speeds[0];
  this.speed_y = this.speeds[1];

}

RigidBody.prototype = Object.create(GameObject.prototype);
RigidBody.prototype.constructor = RigidBody;

Object.defineProperties(RigidBody.prototype, {
  speed_x: {
    get( ) {return this.speeds[0]},
    set(n) {this.speeds[0] = n}
  },
  speed_y: {
    get( ) {return this.speeds[1]},
    set(n) {this.speeds[1] = n}
  },
  //
  body_x: {
    get( ) {return this.body[0]},
    set(n) {this.body[0] = n}
  },
  body_y: {
    get( ) {return this.body[1]},
    set(n) {this.body[1] = n}
  },
  body_w: {
    get( ) {return this.body[2]},
    set(n) {this.body[2] = n}
  },
  body_h: {
    get( ) {return this.body[3]},
    set(n) {this.body[3] = n}
  },
  //
  top: {
    get( ) { return this.y + this.body_y },
    set(n) { this.y = n - this.body_y }
  },
  bottom: {
    get( )  {return this.y + this.body_y + this.body_h },
    set(n) { this.y = n - this.body_y - this.body_h }
  },
  right: {get( ) { return this.x + this.body_x + this.body_w }, set(n) { this.x = n - this.body_x - this.body_w }},
  left: {get( ) { return this.x + this.body_x }, set(n) { this.x = n - this.body_x }}

});

export default RigidBody;
