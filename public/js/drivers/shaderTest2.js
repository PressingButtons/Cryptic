import * as GameLib from '../game/gamelib.js';
let worker = new Worker('/public/js/workers/vertexworker.js');

let self = { };
self.vertexData;
self.objects;

const compileDisplayData = ( ) => {
  let data = self.objects.map(x => x.vertexData);
  let bufferData = new Int16Array(data.length * data[0].length);
  for(let i = 0; i < data.length; i++) {
    bufferData.set(data[i], i * data[0].length)
  }
  return bufferData.buffer;
}

const main = ( ) => {
  GameLib.glCreate(document.getElementById('canvas')).then(onCreate);
}

const onCreate = glShader => {
  let fov = 45 * Math.PI/180,
      aspect = glShader.gl.canvas.width/glShader.gl.canvas.height,
      zNear = .1,
      zFar = 100;
  const camera = new GameLib.Camera(document.getElementById('canvas'));
  GameLib.TextureCache.init(glShader.gl);
  const onSceneLoaded = scene => {
    worker.onmessage = onMessage;
    self.objects = scene;
    self.objects[0].rgba = [1, 0.3, 0.3, 1];
    self.objects[1].rgba = [1, 0.5, 0.5, 1];
    self.objects[2].rgba = [0, 0.7, 0.7, 1];
    sendMessage();
  }

  const sendMessage = ( ) => {
    let bufferData = compileDisplayData( );
    worker.postMessage(bufferData, [bufferData]);
  }

  const onMessage = msg => {
    self.vertexData = new Float32Array(msg.data);
    GameLib.render(glShader, camera.getProjection(), self.objects, self.vertexData, GameLib.TextureCache, [0, 0, 0, 1])
  }

  GameLib.Loader.loadScene('test', GameLib.TextureCache).then(onSceneLoaded);
}

export default main;
