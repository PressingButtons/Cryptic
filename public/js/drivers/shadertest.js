import glCreate from '../utils/glShader.js';
import {loadImages} from '../utils/common.js';

const onCreate = glShader => {

  const createTexture = image => {
    let gl = glShader.gl;
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // set parameter to render image at any size
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //upload image to the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    let name = image.src.substring(image.src.lastIndexOf('/') + 1).split('.')[0];
    return {name: name, texture: texture, width: image.width, height: image.height};
  }

  const createTextures = (images) => {
    let cache = { };
    for(const entry in images) {
      let image = images[entry];
      let textureData = createTexture(image);
      cache[entry] = textureData;
    }
    return cache;
  }

  const createBuffer = (w, h) => {
    const gl = glShader.gl;
    let buffer = gl.createBuffer( );
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0, 0, 0, 0.5, 0.6, 0.3, 1,
      w, 0, w, 0, 0.5, 0.6, 0.3, 1,
      0, h, 0, h, 0.5, 0.6, 0.3, 1,
      0, h, 0, h, 0.5, 0.6, 0.3, 1,
      w, h, w, h, 0.5, 0.6, 0.3, 1,
      w, 0, w, 0, 0.5, 0.6, 0.3, 1
    ]), gl.STATIC_DRAW);
    return buffer;
  }

  const createBuffers = textures => {
    let buffers = {};
    for(let key in textures) {
      let buffer = createBuffer(textures[key].width, textures[key].height);
      buffers[textures[key].name] = buffer;
    }
    return buffers;
  }

  const clear = color => {
    const gl = glShader.gl;
    color = color ? color : [0, 0, 0, 1];
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  const setResolution = (width, height) => {
    const shader = glShader.shaders.standard;
    const gl = glShader.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(shader.uniforms.resolution, width || gl.canvas.width, height || gl.canvas.height);
  }

  const invokeAttribute = (gl, attribute, size, stride, offset, byte_length = Float32Array.BYTES_PER_ELEMENT) => {
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride * byte_length, offset * byte_length);
  }

  const drawBuffer = (texture, buffer) => {
    const gl = glShader.gl;
    const shader = glShader.shaders.standard;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);
    gl.uniform2f(shader.uniforms.textureSize, texture.width, texture.height);
    invokeAttribute(gl, shader.attributes.position, 2, 8, 0);
    invokeAttribute(gl, shader.attributes.textureCoord, 2, 8, 2);
    invokeAttribute(gl, shader.attributes.color, 4, 8, 4);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  const draw = (textures, buffers) => {
    clear( );
    glShader.gl.useProgram(glShader.shaders.standard.program);
    setResolution(1440, 810);
    for(var key in textures) {
      drawBuffer(textures[key], buffers[key]);
    }
  }

  const onImagesLoaded = images => {
    let textures = createTextures(images);
    let buffers = createBuffers(textures);
    const update = ( ) => {
      draw(textures, buffers);
      requestAnimationFrame(update);
    }
    update();
  }

  loadImages(['/public/images/skybox_test.png' ,'/public/images/background_test.png', '/public/images/inground_test.png'])
  .then(onImagesLoaded);
}

const onError = err => {
  throw err;
}

export default function main( ) {
  glCreate(document.getElementById('canvas')).then(onCreate).catch(onError);
}
