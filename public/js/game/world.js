import {loadImages} from '../utils/loader.js';

const World = function(physics, vertexWorker, GameObject) {
  let objects = [];
  let backlayers = [], forelayers;
  let vertexId, vertexData;
  // ==================== methods
  /* PRIVATE */
  const createBufferfromObjects = ( ) => {
    let allObjects = backlayers.concat(objects).concat(forelayers || []);
    let buffer = new ArrayBuffer(allObjects.length * GameObject.VERTEX_LENGTH);
    let view = new DataView(buffer);
    for(let i = 0; i < allObjects.length; i++ ) {
      let offset = i * GameObject.VERTEX_LENGTH;
      let object = allObjects[i];
      view.setUint16(offset + 0, object.width, GameObject.LE)
      view.setUint16(offset + 2, object.height, GameObject.LE)
      view.setInt16(offset + 4, object.x, GameObject.LE)
      view.setInt16(offset + 6, object.y, GameObject.LE)
      view.setInt16(offset + 8, object.rx, GameObject.LE)
      view.setInt16(offset + 10, object.ry, GameObject.LE)
      view.setInt16(offset + 12, object.rz, GameObject.LE)
      view.setUint16(offset + 14, object.drawX, GameObject.LE)
      view.setUint16(offset + 16, object.drawY, GameObject.LE)
    }
    return buffer;
  }

  const sendMessage = ( ) => {
    let buffer = createBufferfromObjects( );
    vertexWorker.postMessage(buffer, [buffer]);
  }

  const createLayer = (image, cache, ar) => {
    let layer = new GameObject.GameObject(image.width, image.height);
    layer.ref = cache.createTexture(image);
    ar.push(layer);
  }


  const onMessage = msg => {
    vertexData = new Float32Array(msg.data);
    //vertexId = setTimeout(sendMessage, 10);
  }
  /*PUBLIC*/
  const loadLevel = (cache, details) => {
    let promises = [loadImages(details.backlayers.map(d => d.url))];
    if(details.forelayers) promises.push(loadImages(details.forelayers.map(m => m.url)));
    return Promise.all(promises).then(images => {
      for(const name in images[0]) {
        createLayer(images[0][name], cache, backlayers);
      }
      if(images.length > 1) {
        for(const name in images[1]) {
          createLayer(images[1][name], cache, forlayers);
        }
      }
    })
  }

  const updatePhysics = elapsedTime => {
    physics(objects, elapsedTime);
  }

  const runVertexUpdate = ( ) => {
    stopVertexUpdate( ); //clear any residuals
    vertexId = setTimeout(sendMessage, 10);
  }

  const stopVertexUpdate = ( ) => {
    clearTimeout(vertexId);
  }

  //exec
  vertexWorker.onmessage = onMessage;

  return {
    loadLevel: loadLevel,
    get graphicData( ) {
      let textures = backlayers.concat(objects).concat(forelayers || []).map(obj => obj.ref);
      return {vertices: vertexData, textures: textures};
    },
    updatePhysics: updatePhysics,
    runVertexUpdate: runVertexUpdate,
    stopVertexUpdate: stopVertexUpdate,
    objectByteLength: 24,
  }
}

export default World;
