import Physics from './physics.js';

const cleanLayers = layers => {
  for(const layer of layers) {
    for(const entry of layer) {
      if(entry == null) layer.splice(layer.indexOf(entry), 1);
    }
  }
}

const World = function(width, height) {
  this.width = width;
  this.height = height;
  this.floor = height - 50;
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
    actors: {value: this.layers[3]},
    particles2:  {value: this.layers[4]},
    foregrounds: {value: this.layers[5]},
  })
}

World.prototype.getObjects = function( ) {
  return [].concat.apply([], this.layers);
}

World.prototype.getDisplayVertex = function( ) {
  let objects = this.getObjects( );
  return objects.map(obj => obj.vertexData.slice(0))
}

World.prototype.update = function(dt) {
  //Physics.update(dt, this.gameobjects);
  cleanLayers(this.layers);
}

World.prototype.addActor = function(actor) {
  this.actors.push(actor);
}

export default World;
