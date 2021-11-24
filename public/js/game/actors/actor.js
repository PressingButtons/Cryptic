import GameObject from '../gameobject.js';

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
    value: function(specs = {}) {
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
  health:       {get( ) {return this.data[0]}, set(n) { this.data[0] = n}},
  spirit:       {get( ) {return this.data[1]}, set(n) { this.data[1] = n}},
  walkSpeed:    {get( ) {return this.data[2]}, set(n) { this.data[2] = n}},
  dashSpeed:    {get( ) {return this.data[3]}, set(n) { this.data[3] = n}},
  runSpeed:     {get( ) {return this.data[4]}, set(n) { this.data[4] = n}},
  airDashspeed: {get( ) {return this.data[5]}, set(n) { this.data[5] = n}},
  jumpPower:    {get( ) {return this.data[6]}, set(n) { this.data[6] = n}},
  jumps:        {get( ) {return this.data[7]}, set(n) { this.data[7] = n}},
  //active values
  healthValue: {get( ) {return this.data[8]}, set(n) { this.data[8] = n}},
  spiritValue: {get( ) {return this.data[9]}, set(n) { this.data[9] = n}},
  xpseed:      {get( ) {return this.data[10]}, set(n) { this.data[10] = n}},
  yspeed:      {get( ) {return this.data[11]}, set(n) { this.data[11] = n}},
  blockDirection: {get( ) {return this.data[12]}, set(n) { this.data[12] = n}},
  jumpCount:   {get( ) {return this.data[13]}, set(n) { this.data[13] = n}},
  stunCount:   {get( ) {return this.data[14]}, set(n) { this.data[14] = n}},
  //states
  attacking:   {get( ) {return this.data[15]}, set(n) {this.data[15] = n}},
  blocking:    {get( ) {return this.data[16]}, set(n) {this.data[16] = n}},
  stunned:     {get( ) {return this.data[17]}, set(n) {this.data[17] = n}},
  crouching:   {get( ) {return this.data[18]}, set(n) {this.data[18] = n}},
  downed:      {get( ) {return this.data[19]}, set(n) {this.data[19] = n}},
  jumping:     {get( ) {return this.data[20]}, set(n) {this.data[20] = n}},
  dashing:     {get( ) {return this.data[21]}, set(n) {this.data[21] = n}},
  walking:     {get( ) {return this.data[22]}, set(n) {this.data[22] = n}},
  running:     {get( ) {return this.data[23]}, set(n) {this.data[23] = n}},
  onLand:      {get( ) {return this.data[24]}, set(n) {this.data[24] = n}},
  onWallLeft:  {get( ) {return this.data[25]}, set(n) {this.data[25] = n}},
  onWallRight: {get( ) {return this.data[26]}, set(n) {this.data[26] = n}},
  //
  currentFrame: {get( ) {return this.data[27]}, set(n) { this.data[27] = n}},
  currentAnimation: {value: null, writeable: true},
  elapsedFrameTime: {get( ) {return this.data[28]}, set(n) { this.data[28] = n}},
  frameIndex: {get( ) {return this.data[29]}, set(n) { this.data[29] = n}}
})

Actor.prototype.unpack = function(data) {
  this.frames = data.frames;
  this.parseAnimations(data.animations);
  this.setSpecs(data.specs);
  this.currentFrame = {index: 0, duration: 0};
}

Actor.prototype.parseAnimations = function(animations) {
  this.animations = animations;
  for(var name in this.animations) {
    const animation = this.animations[name];
    if(animation.onAnimationEnd) animation.onAnimationEnd = new Function(this, animation.onAnimationEnd);
    for(const frame of animation.frames) {
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
