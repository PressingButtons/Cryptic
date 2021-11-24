import generateShader from '../utils/generateShader.js';
import * as Error from '../utils/error.js';
//globals
let gl, shaders, buffer, shader;
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

const setBufferData = bufferData => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
}

const setShapeBufferData = bufferData => {
  setBufferData(bufferData);
  invokeAttribute(shader.attributes.position, 2, 0, 0);
}

const setTextureBufferData = bufferData => {
  setBufferData(bufferData)
  invokeAttribute(shader.attributes.position, 2, 4, 0);
  invokeAttribute(shader.attributes.textureCoord, 2, 4, 2);
}

const setTexture = textureData => {
  gl.bindTexture(gl.TEXTURE_2D, textureData.texture);
  gl.uniform2fv(shader.uniforms.textureSize, textureData.dimensions);
}
//exports
export const init = (canvas, ...shaderRequests) => {
  gl = canvas.getContext('webgl', {premultipliedAlpha: false});
  buffer = gl.createBuffer( );
  return compileShader(shaderRequests);
}

export const drawTexture = (bufferData, texture, perspective, color = [1, 1, 1, 1]) => {
  confirmGL( );
  setTextureBufferData(bufferData);
  setTexture(texture);
  gl.uniform4fv(shader.uniforms.color, color);
  gl.uniformMatrix4fv(shader.uniforms.matrix, false, perspective);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export const drawShape = (bufferData, perspective, color = [1, 1, 1, 1], vertexCount = 6) => {
  confirmGL( );
  setShapeBufferData(bufferData);
  gl.uniform4fv(shader.uniforms.color, color);
  gl.uniformMatrix4fv(shader.uniforms.matrix, false, perspective);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}

export const useProgram = request => {
  shader = shaders[request];
  if(shader) gl.useProgram(shader.program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  //gl.enable(gl.DEPTH_TEST);
}

export const reset = ( ) => {
  confirmGL( );
  clear( );
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

export {gl, shaders}
