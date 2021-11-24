import glCreate from '../utils/glshader.js'
//
const OBJECT_VERTEX_SIZE = 24;
let gl, shaders;
let buffer;

const initProgram = result => {
  gl = result.gl;
  buffer = gl.createBuffer( );
  shaders = result.shaders;
}

const invokeAttribute = (gl, attribute, size, stride, offset, byte_length = Float32Array.BYTES_PER_ELEMENT) => {
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride * byte_length, offset * byte_length);
}

//drawing methods
const clear = (color = [0, 0, 0, 1]) => {
  const gl = glShader.gl;
  gl.clearColor(color[0], color[1], color[2], color[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const drawData = (bufferData, shader, texture, color, perspective) => {
  //inject buffer data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  invokeAttribute(gl, shader.attributes.position, 2, 2, 0);
  //set texture data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, object.textureVertex, gl.STATIC_DRAW);
  invokeAttribute(gl, shader.attributes.textureCoord, 2, 2, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform2fv(shader.uniforms.textureSize, texture.dimensions);
  //set color
  gl.uniform4fv(shader.uniforms.color, color)
  //set perspective matrix
  gl.uniformMatrix4fv(shader.uniforms.matrix, false, perspective);
  //draw
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

//exports
export const drawObjects = (objects, bufferData textureCache, perspective) => {
  clear( );
  gl.useProgram(shaders.standard);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  for(let i = 0; i < objects.length; i++) {
    let objectData = bufferData.slice(i, i * OBJECT_VERTEX_SIZE + i);
    drawData(objectData, shaders.standard, textureCache[objects[i].texture], perspective);
  }
}

export const init = canvas => {
  return glCreate(canvas).then(initProgram);
}

export gl;
