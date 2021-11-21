import GameObject from './gameobject.js';

const DisplayBuffer = function(elementLength) {
  const buffer = new Int16Array(elementLength);
  let   elementsUsed = 0;

  const clear = ( ) => {
    buffer.fill(0);
    elementsUsed = 0;
  }

  const write = (...gameobjects) => {
    gameobjects = [].concat.apply([], gameobjects);
    for(let i = 0; i < gameobjects.length; i++) {
      if(!gamobjects[i] instanceof GameObject) throw `Error - Display Buffer can only take GameObjects.\nCannot write ${typeof gameobjects[i]} into DisplayBuffer`;
      const g = gameobjects[i];
      buffer.set(g.vertexData, elementsUsed);
      elementsUsed += g.vertexData.length;
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
      return elementsUsed / DATA_VERTEX;
    }
  }

}
