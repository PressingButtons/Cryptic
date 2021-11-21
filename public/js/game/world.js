import DisplayBuffer from './displayBuffer.js';
import Physics from './physics.js';
import Spawner from './spawner.js';

const World = function(actorDefs, textures) {
  this.displayBuffer = new DisplayBuffer(100);
  this.spawner = Spawner.create(actorDefs);
  this.cache = textures;
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

World.prototype.spawnActor = function(name, x = 0, y = y) {
  let actor = this.spawner.spawn(name);
  actor.x = x; actor.y = y;
  this.gameobjects.push(actor);
  return actor;
}
