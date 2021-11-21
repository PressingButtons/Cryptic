import DisplayBuffer from './displayBuffer.js';
import Physics from './physics.js';

const World = function( ) {
  this.displayBuffer = new DisplayBuffer(1024);
  this.cache = { };
  this.layers = [
    null, //skybox
    [], //backgrounds
    [], //particles1
    [], //gameobjects
    [], //particles2
    [], //foreground
  ];

  Object.defineProperties(this, {
    skybox: {value: this.layers[0]},
    backgrounds: {value: this.layers[1]},
    particles1:  {value: this.layers[2]},
    gameobjects: {value: this.layers[3]},
    particles2:  {value: this.layers[4]},
    foregrounds: {value: this.layers[5]},
  })
}

World.prototype.getDisplayData = function( ) {
  let objects = [].concat.apply([], this.layers);
  this.displayBuffer.clear( );
  this.displayBuffer.write(objects);
  return this.displayBuffer.usedBufferData;
}

World.prototype.update = function(dt) {
  //Physics.update(dt, this.gameobjects);
}
