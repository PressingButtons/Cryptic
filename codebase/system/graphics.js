import generateShader from '../utils/generateShader.js';
import * as Error from '../utils/error.js';
//globals
const instanceLength = 12;
let gl, shaders, positionBuffer, textureBuffer, shader, activeProgram;
//methods
const clear = (color = [0, 0, 0, 1]) => {
  confirmGL( );
  gl.clearColor(color[0], color[1], color[2], color[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const compileShader = requests => {
  return generateShader(gl, requests)
  .then(shaderPrograms => {shaders = shaderPrograms});
}

const confirmGL = ( ) => {
  if(!gl) throw Error.generate('Webgl context not defined.');
}

const invokeAttribute = (attribute, size, stride, offset, byteLength = Float32Array.BYTES_PER_ELEMENT) => {
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride * byteLength, offset * byteLength);
}

const setBufferData = (buffer, bufferData) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
}

const setPositionBuffer = bufferData => {
  setBufferData(positionBuffer, bufferData);
  invokeAttribute(shader.attributes.position, 2, 0, 0);
}

const setTextureBuffer = bufferData => {
  setBufferData(textureBuffer, bufferData)
  invokeAttribute(shader.attributes.textureCoord, 2, 0, 0);
}

const setTexture = textureData => {
  gl.bindTexture(gl.TEXTURE_2D, textureData.texture);
  gl.uniform2fv(shader.uniforms.textureSize, textureData.dimensions);
}
//exports
export const init = (canvas, ...shaderRequests) => {
  gl = canvas.getContext('webgl', {premultipliedAlpha: false});
  positionBuffer = gl.createBuffer( );
  textureBuffer = gl.createBuffer( );
  return compileShader(shaderRequests);
}

export const createTexture = image => {
  confirmGL();
  let texture = gl.createTexture( );
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // set parameter to render image at any size
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //upload image to the texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return {texture: texture, dimensions: [image.width, image.height]};
}

export const drawTexture = (posBuffer, textureBuffer, texture, perspective, color = [1, 1, 1, 1]) => {
  confirmGL( );
  useProgram('texture');
  setPositionBuffer(posBuffer);
  setTextureBuffer(textureBuffer);
  setTexture(texture);
  gl.uniform4fv(shader.uniforms.color, color);
  gl.uniformMatrix4fv(shader.uniforms.matrix, false, perspective);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export const drawShape = (posBuffer, perspective, color = [1, 1, 1, 1], vertexCount = 6) => {
  confirmGL( );
  useProgram('shape');
  setPositionBuffer(posBuffer);
  gl.uniform4fv(shader.uniforms.color, color);
  gl.uniformMatrix4fv(shader.uniforms.matrix, false, perspective);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}

export const drawObject = (index, object, bufferData, perspective) => {
  if(object == null) return;
  const start = index * instanceLength;
  const end = start + instanceLength;
  let positionData = bufferData.position.slice(start, end);
  let textureData  = bufferData.texture.slice(start, end);
  if(object.texture == null) drawShape(positionData, perspective, object.rgba);
  else drawTexture(positionData, textureData, object.texture, perspective, object.rgba);
}

export const drawObjects = (bufferData, perspective, ...objects) => {
  if(!bufferData) return;
  confirmGL();
  reset( );
  objects = [].concat.apply([], objects);
  for(let i = 0; i < objects.length; i++) {
    drawObject(i, objects[i], bufferData, perspective);
  }
}

export const useProgram = request => {
  shader = shaders[request];
  if(shader && activeProgram != request) {
  gl.useProgram(shader.program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  //gl.enable(gl.DEPTH_TEST);
  activeProgram = request;
  }
}

export const reset = ( ) => {
  confirmGL( );
  clear( );
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

export {gl, shaders}
