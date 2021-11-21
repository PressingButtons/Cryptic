import GameObject from './gameobject.js';

const Actor = function(obj) {
  GameObject.call(this, obj.width, obj.height);
  this.data = new Int16Array(32);
  this.unpack(obj);
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
  //
  currentFrame: {value: this.data[27]},
  currentAnimation: {value: null},
  elapsedFrameTime: {value: this.data[28]},
  frameIndex: {value: this.data[29]}
})

Actor.prototype.unpack = function(data) {
  this.frames = data.frames;
  this.parseAnimations(data.animations);
  this.setSpecs(data.specs);
  this.currentFrame = {index: 0, duration: 0};
}

Actor.prototype.parseAnimations = function(animations) {
  this.animations = animations;
  for(var name in animations) {
    const animation = animations[name];
    if(animation.onAnimationEnd) animation.onAnimationEnd = new Function(this, animation.onAnimationEnd);
    for(const frame of animation) {
      if(frame.onFunc) frame.onFrame = new Function(this, frame.onFrame);
    }
  }
}

Actor.prototype.animate = function(dt) {
  if(this.currentAnimation == null) { this.elapsedFrameTime = 0; return; }
  this.elapsedFrameTime += dt;
  if(this.elapsedFrameTime > this.currentFrame.duration) {
    this.elapsedFrameTime = 0;
    this.frameIndex++;
    if(this.frameIndex > this.currentAnimation.frames.length) {
      this.currentAnimation.onAnimationEnd(this);
      this.gotoAnimation(this.currentAnimation.name);
    } else {
      this.currentFrame = this.currentAnimation.frames[this.frameIndex];
      if(this.currentFrame.onFrame) this.currentFrame.onFrame(this);
    }
  }
}

Actor.prototype.gotoAnimation = function(aKey) {
  this.currentAnimation = this.animations[aKey];
  this.currentFrame = this.currentAnimation.frames[0];
  if(this.currentFrame.onFrame) this.currentFrame.onFrame(this);
  this.elapsedFrameTime = 0;
  this.frameIndex = 0;
}

Actor.prototype.update = function(dt) {
  this.animate(dt);
}

export default Actor;
