import * as Entities from './actors/entitylib.js';
import {loadImage} from './loader.js';

let definitions;
let textures;

const cacheTexture = (image, gl) => {
  let texture = createTexture(image, gl);
  let id = image.src.substring(image.src.lastIndexOf('/') + 1).split('.')[0];
  textures[id] = {texture: texture, dimensions: [image.width, image.height]};
}

const cacheTextures = (images, gl) => {
  textures = { };
  for(const image of images) cacheTexture(image, gl);
}

const createTexture = (image, gl) => {
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

const getURLs = defs => {
  let urls = [];
  for(let name in defs) urls.push(defs[name].image);
  return urls;
}

const loadTextures = (defs, gl) => {
  let promises = getURLs(defs).map(x => loadImage(x));
  return Promise.all(promises).then(images => cacheTextures(images, gl));
}

export const init = (defs, gl) => {
  definitions = defs;
  return loadTextures(defs, gl);
}

export const spawn = function(request) {
  request = request.split('.');
  const type = request[0], name = request[1];
  return new Entities[type][name](definitions[name]) || null;
}
