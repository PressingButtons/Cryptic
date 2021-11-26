import * as System from '/codebase/system/system.js';
import * as Loader from '/codebase/utils/load.js';
import GameObject from '/codebase/objects/gameobject.js';


const main = function( ) {
  System.Graphics.init(document.getElementById('canvas'), 'texture', 'shape').then(test);
}

const test = ( ) => {
  console.log('so far so good');

  let canvas = System.Graphics.gl.canvas;

  let textureData;

  let textureObject = new GameObject(128, 128);

  textureObject.drawX = 128;

  let boxObject = new GameObject(128, 128);

  boxObject.rgba = [0.3, 1, 1, 1];

  let bufferData;

  let camera = new System.Camera( );

  camera.setDimensions(canvas.width, canvas.height);
  System.Graphics.useProgram('shape');

  let perspective = camera.getProjection();



  textureObject.x = 200;

  document.addEventListener('keydown', event => {
    if(event.key == 'd')  {
      if(textureObject.ry == 0)
        textureObject.x += 5;
      textureObject.ry = 0;
    }
    if(event.key == 'a') {
      if(textureObject.ry == 180)
        textureObject.x -= 5;
      textureObject.ry = 180;
    }
    if(event.key == 'w') textureObject.y -= 5;
    if(event.key == 's') textureObject.y += 5;
  })

  const render = ( ) => {
    bufferData = System.DisplayBuffer.getBufferData( );
    if(bufferData != null) {
      System.Graphics.drawObjects(bufferData, perspective, textureObject, boxObject);
    }
    /*
    System.Graphics.reset( );
    System.Graphics.useProgram('texture');
    System.Graphics.drawTexture(bufferData.position.slice(0, 12), bufferData.texture.slice(0, 12), textureData, perspective, textureObject.rgba);
    System.Graphics.useProgram('shape');
    System.Graphics.drawShape(bufferData.position.slice(12, 24), perspective, boxObject.rgba);
    */
    requestAnimationFrame(render);
  }

  Loader.loadImage('game/vasjua').then(result => {
    textureData = System.Graphics.createTexture(result);
    textureObject.texture = textureData;
    render( );
  });

  /*

  const sendMessage = ( ) => {
    let buffer = new Int16Array(textureObject.vertexData.length * 2);
    buffer.set(textureObject.vertexData);
    buffer.set(boxObject.vertexData, textureObject.vertexData.length);
    worker.postMessage(buffer.buffer, [buffer.buffer]);
  }

  worker.onmessage = msg => {
    bufferData =  {
      position: new Float32Array(msg.data[0]),
      texture: new Float32Array(msg.data[1])
    }
    sendMessage( );
  }

  sendMessage( );
  */

  System.DisplayBuffer.execute([textureObject, boxObject])

  setTimeout(( ) => {boxObject = null}, 5000)

}

export default main;
