import * as System from '/codebase/system/system.js';
import * as Loader from '/codebase/utils/load.js';
import GameObject from '/codebase/objects/gameobject.js';

const worker = new Worker('/codebase/workers/vertexworker.js');

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

  const createTexture = (gl, image) => {
    let texture = gl.createTexture( );
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // set parameter to render image at any size
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //upload image to the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  }

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
    if(!bufferData) return;
    System.Graphics.reset( );
    System.Graphics.useProgram('texture');
    System.Graphics.drawTexture(bufferData.slice(0, 24), textureData, perspective, textureObject.rgba);
    System.Graphics.drawTexture(bufferData.slice(24, 48), textureData, perspective, boxObject.rgba);
    requestAnimationFrame(render);
  }

  Loader.loadImage('game/vasjua').then(result => {
    textureData = {texture: createTexture(System.Graphics.gl, result), dimensions: [result.width, result.height]}
    render( );
  });


  const sendMessage = ( ) => {
    let buffer = new Int16Array(textureObject.vertexData.length * 2);
    buffer.set(textureObject.vertexData);
    buffer.set(boxObject.vertexData, textureObject.vertexData.length);
    worker.postMessage(buffer.buffer, [buffer.buffer]);
  }

  worker.onmessage = msg => {
    bufferData = new Float32Array(msg.data);
    sendMessage( );
  }

  sendMessage( );

}

export default main;
