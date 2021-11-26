const worker = new Worker('/codebase/workers/vertexworker.js');

let intervalID = 0;
let bufferData;

const onWorkerMessage = msg => {
  bufferData = {
    position: new Float32Array(msg.data[0]),
    texture:  new Float32Array(msg.data[1])
  }
}

const sendData = objects => {
  if(objects.length == 0) return;
  const length = objects[0].vertexData.length;
  let data = new Int16Array(objects.length * length);
  for(let i = 0; i < objects.length; i++) {
    if(!objects[i]) continue;
    data.set(objects[i].vertexData, i * length);
  }
  worker.postMessage(data.buffer, [data.buffer]);
}

export const execute = objects => {
  intervalID = setInterval(sendData,  10, objects);
}

export const stop = ( ) => {
  clearInterval(intervalID);
}

export const getBufferData = ( ) => { return bufferData; }

worker.onmessage = onWorkerMessage;
