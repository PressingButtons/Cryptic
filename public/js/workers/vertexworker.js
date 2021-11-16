self.importScripts('/public/js/gl-matrix.js');

const VERTEX_LENGTH = 24,
      BUFFER_INSTANCE_LENGTH = 10;
      LE = true,
      STAGE_WIDTH = 800,
      STAGE_HEIGHT = 450,
      mat4 = glMatrix.mat4,
      vec4 = glMatrix.vec4;

let createView = (buffer, offset) => {
  return {
    wid: buffer[offset + 0],
    hgt: buffer[offset + 1],
    x: buffer[offset + 2],
    y: buffer[offset + 3],
    rx: buffer[offset + 4],
    ry: buffer[offset + 5],
    rz: buffer[offset + 6],
    dx: buffer[offset + 7],
    dy: buffer[offset + 8]
  }
}

self.onmessage = msg => {
  let buffers = createBuffers(msg.data);
  postMessage(buffers, [buffers])
}

const createBuffers = (buffer) => {
  let bufferData = new Int16Array(buffer);
  const numInstances = bufferData.length/BUFFER_INSTANCE_LENGTH;
  let outBuffer = new Float32Array(numInstances * VERTEX_LENGTH)
  for(let i = 0; i < numInstances; i++ ) {
    const offset = i * BUFFER_INSTANCE_LENGTH;
    const view = createView(bufferData, offset)
    //create matrix centered at origin
    let matrix = mat4.fromTranslation(mat4.create(), [STAGE_WIDTH/2, STAGE_HEIGHT/2, 0]);
    //rotate matrix according to object
    mat4.rotateX(matrix, matrix, view.rx);
    mat4.rotateY(matrix, matrix, view.ry);
    mat4.rotateZ(matrix, matrix, view.rz);
    //move matrix in respect to center of object
    mat4.translate(matrix, matrix, [-view.wid/2, -view.hgt/2, 0]);
    //anchor current translation (origin)
    let p1 = vec4.transformMat4(vec4.create(), [0, 0, 0, 1], matrix),
        p2 = vec4.transformMat4(vec4.create(), [view.wid, view.hgt, 0, 1], matrix);
    //transform back to object original position
    let xOrigin = -STAGE_WIDTH/2 + view.wid/2 + view.x,
        yOrigin = -STAGE_HEIGHT/2 + view.hgt/2 + view.y;
    p1 = vec4.add(p1, p1, [xOrigin, yOrigin, 0, 0]).slice(0, 2);
    p2 = vec4.add(p2, p2, [xOrigin, yOrigin, 0, 0]).slice(0, 2);
    //create frame coordinates
    let f1 = [view.dx, view.dy],
        f2 = [view.dx + view.wid, view.dy + view.hgt];
    //f1 = [0, 0];
    //f2 = [1, 1]
    let vertex = createVertex(p1, p2, f1, f2);
    outBuffer.set(vertex, i * VERTEX_LENGTH);
  }
  return outBuffer.buffer;
}

const createVertex = (p1, p2, f1, f2) => {
  return [
    p1[0], p1[1], f1[0], f1[1],
    p2[0], p1[1], f2[0], f1[1],
    p1[0], p2[1], f1[0], f2[1],
    p1[0], p2[1], f1[0], f2[1],
    p2[0], p2[1], f2[0], f2[1],
    p2[0], p1[1], f2[0], f1[1]
  ]
}
