let activeProgram = 'standard'

//methods
const clear = (gl, color = [0, 0, 0, 1]) => {
  gl.clearColor(color[0], color[1], color[2], color[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const setViewport = gl => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

const selectProgram = (type, gl, shaders) => {
  if(!type || !shaders.hasOwnProperty(type)) type = 'standard';
  if(type != activeProgram || !gl.getParameter(gl.CURRENT_PROGRAM)) {
    gl.useProgram(shaders[type].program);
  }
  return type;
}

const invokeAttribute = (gl, attribute, size, stride, offset, byte_length = Float32Array.BYTES_PER_ELEMENT) => {
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride * byte_length, offset * byte_length);
}

const drawBuffer = { };

drawBuffer.standard = (glShader, shaderType, perspective, bufferData, object, cache) => {
  const gl = glShader.gl;
  const shader = glShader.shaders[shaderType];
  const textureObj = cache.getTexture(object.texture);
  //console.log('context ', gl,'\nshader ', shader, '\npersepctive ',perspective, '\nbuffer data ',bufferData, '\nobject ',object, '\ncache ',cache)
  let buffer = gl.createBuffer( );
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  gl.bindTexture(gl.TEXTURE_2D, textureObj.texture);
  let color = object.rgba;
  gl.uniform4f(shader.uniforms.color, color[0], color[1], color[2], color[3]);
  gl.uniform2f(shader.uniforms.textureSize, textureObj.width, textureObj.height);
  gl.uniformMatrix4fv(shader.uniforms.matrix, false, perspective);
  invokeAttribute(gl, shader.attributes.position, 2, 4, 0);
  invokeAttribute(gl, shader.attributes.textureCoord, 2, 4, 2);
  console.log(perspective);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

//export
export default function render(glShader, perspective, objects, bufferData, cache, bgColor, vertexSize = 24){
  clear(glShader.gl, bgColor);
  setViewport(glShader.gl);
  const instances = objects.length;
  for(let i = 0; i < instances; i++) {
    const object = objects[i];
    let start = i * vertexSize;
    let end = start + vertexSize;
    let shaderType = selectProgram(object.renderType, glShader.gl, glShader.shaders);
    drawBuffer[shaderType](glShader, shaderType, perspective, bufferData.subarray(start, end), object, cache);
  }
}
