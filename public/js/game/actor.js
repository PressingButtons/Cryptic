import GameObject from './gameobject.js';

const Actor = function(width, height, spec, frameData) {
  GameObject.call(this, width, height);
  this.data = new Int16Array(32);
  this.setSpecs(spec);
  this.resetStates( );
}

Actor.prototype = Object.create(GameObject.prototype);
Actor.prototype.constructor = Actor;

Object.defineProperties(Actor.prototype, {
  setSpecs: {
    value: function(specs) {
      this.health = specs.health || 1000;
      this.walkSpeed = specs.walkSpeed || 5;
      this.runSpeed = specs.walkSpeed || this.walkSpeed * 2;
      this.dashSpeed = specs.dashSpeed || (this.walkSpeed * 2.5) | 0
      this.airDashspeed = specs.airDashspeed || this.dashSpeed;
      this.jumpPower = specs.jumpPower || 10;
      this.jumps = specs.jumps || 1;
      //setting values
      this.healthValue = this.health;
    }
  },
  resetStates: {
    value: function( ) {
      this.data.set([0,0,0,0,0,0,0,0,0,0,0,0,0], 15);
    }
  },
  //specs
  health: {value: this.data[0]},
  spirit: {value: this.data[1]},
  walkSpeed: {value: this.data[2]},
  dashSpeed: {value: this.data[3]},
  runSpeed: {value: this.data[4},
  airDashspeed: {value: this.data[5]},
  jumpPower: {value: this.data[6]},
  jumps: {value: this.data[7]},
  //active values
  healthValue: {value: this.data[8]},
  spiritValue: {value: this.data[9]},
  xpseed: {value: this.data[10]},
  yspeed: {value: this.data[11]},
  blockDirection: {value: this.data[12]},
  jumpCount: {value: this.data[13]},
  stunCount: {value: this.data[14]},
  //states
  attacking: {value: this.data[15]},
  blocking: {value: this.data[16]},
  stunned: {value: this.data[17]},
  crouching: {value: this.data[18]},
  downed: {value: this.data[19]},
  jumping: {value: this.data[20]},
  dashing: {value: this.data[21]},
  walking: {value: this.data[22]},
  running: {value: this.data[23]},
  onLand: {value: this.data[24]},
  onWallLeft: {value: this.data[25]},
  onWallRight: {value: this.data[26]},
})

export default Actor;
