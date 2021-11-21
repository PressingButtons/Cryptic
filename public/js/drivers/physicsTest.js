import * as Game from '../game/game.js';
let worker = new Worker('/public/js/workers/vertexworker.js');

const main = ( ) => {
  //GameLib.glCreate(document.getElementById('canvas')).then(onCreate);
  onCreate(null);
}

const onCreate = glShader => {
  Game.create(['dummy', 'dummy'], 'test').then(onGameCreate);
}

const onGameCreate = ( ) => {
  Game.run( );
}

export default main;
