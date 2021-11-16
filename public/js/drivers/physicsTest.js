import * as GameLib from '../game/gamelib.js';
let worker = new Worker('/public/js/workers/vertexworker.js');

const main = ( ) => {
  GameLib.glCreate(document.getElementById('canvas')).then(onCreate);
}

const onCreate = glShader => {
  const camera = glMartix.mat4.create( );
  GameLib.TextureCache.init(glShader.gl);

  GameLib.compile(['test'], 'prototype')

}

const testEntity = function(width, height, color) {
  GameLib.GameObject.call(this, width, height);
}


export default main;
