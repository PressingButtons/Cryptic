import glCreate from '../utils/glshader.js'
//
const OBJECT_VERTEX_SIZE = 24;
let glShader;

const initProgram = result => {
  glShader = result
  glShader.gl.useProgram(glShader.shaders.standard.program);
}

const invokeAttribute = (gl, attribute, size, stride, offset, byte_length = Float32Array.BYTES_PER_ELEMENT) => {
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride * byte_length, offset * byte_length);
}

//drawing methods
const drawVertexAndTexture = (vertexData, textureData, color = [1, 1, 1, 1]) => {
  const gl = glShader.gl, shader = glShader.shaders.standard;
  gl.bindTexture(gl.TEXTURE_2D, textureData.texture);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexData);
  gl.invokeAttribute(gl, shader.attributes.position, 2, 8, 0);
  gl.invokeAttribute(gl, shader.attributes.textureCoord, 2, 8, 2);
  gl.invokeAttribute(gl, shader.attributes.color, 4, 8, 4);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const drawLayer = (layer, bufferData, textureCache) => {
  if(layer.texture) drawVertexAndTexture(bufferData, textureCache[layer.texture], layer.color);
  else drawObjects(layer.objects, bufferData, textureCache);
}

const drawObjects = (objects, bufferData, textureCache) => {
  for(let i = 0; i < objects.length; i++) {
    let data = bufferData.slic(i * OBJECT_VERTEX_SIZE, i * OBJECT_VERTEX_SIZE + OBJECT_VERTEX_SIZE);
    drawVertexAndTexture(data, textureCache(objects[i].texture), object.tint);
  }
}

//shou
export const init = canvas => {
  return glCreate(canvas).then(initProgram);
}

export const createTexture = image => {
  const gl = glShader.gl;
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

export const getContext = ( ) => {
  return glShader.gl || null;
}

export const drawGameWorld = world => {
  for(let i = 0; i < world.layers.length; i++) {
    const layer = world.layers[i];
    const offset = getOffset(world.layers, i);
    drawLayer(layer, world.bufferData.slice(offset, offset + layer.length * OBJECT_VERTEX_SIZE), world.textureCache);
  }
}

export const drawScene = scene => {

}
