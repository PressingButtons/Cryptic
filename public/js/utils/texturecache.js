let cache = { }, createTexture;

export const init = gl => {
  createTexture = (image) => {
    let texture = gl.createTexture( );
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // set parameter to render image at any size
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //upload image to the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    let name = image.src.substring(image.src.lastIndexOf('/') + 1).split('.')[0];
    cache[name] = {texture: texture, width: image.width, height: image.height};
    return name;
  }
}

export {createTexture};

export const free = ( ) => {
  for(var key in cache) {
    delete cache[key]
  }
}

export const queryCache = ( ) => {
  let keys = [];
  for (let key in cache) keys.push(key);
  return keys;
}

export const getTexture = key => {
  return cache[key];
}
