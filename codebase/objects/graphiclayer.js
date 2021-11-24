import GameObject from './gameobject.js';

const GraphicLayer = function(width, height, texture) {
  GameObject.call(this, width, height);
  this.texture = texture;
  this.parallax = new Uint8Array([0, 0]);
}

GraphicLayer.prototype = Object.create(GameObject.prototype);
GraphicLayer.prototype.constructor = GraphicLayer;
