import * as GameObjectLib from './gameobject.js';

const DisplayBuffer = function(instanceLength) {
  const buffer = new Int16Array(instanceLength * GameObjectLib.vertexLength);
  let   elementsUsed = 0;

  const clear = ( ) => {
    buffer.fill(0);
    elementsUsed = 0;
  }

  const write = (...gameobjects) => {
    gameobjects = [].concat.apply([], gameobjects);
    for(let i = 0; i < gameobjects.length; i++) {
      if(!gamobjects[i] instanceof GameObjectLib.GameObject) throw `Error - Display Buffer can only take GameObjects.\nCannot write ${typeof gameobjects[i]} into DisplayBuffer`;
      const g = gameobjects[i];
      buffer.set(g.vertexData, elementsUsed);
      elementsUsed += GameObjectLib.vertexLength;
    }
  }

  return {
    clear: clear,
    write: write,
    get usedBufferData( ) {
      return buffer.slice(0, elementsUsed);
    },
    get bytesUsed( ) {
      return elementsUsed * buffer.BYTES_PER_ELEMENT;
    },
    get getNumInstances( ) {
      return elementsUsed/GameObjectLib.vertexLength;
    }
  }

}
