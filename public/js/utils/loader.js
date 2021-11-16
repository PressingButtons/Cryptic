import * as utils from '../utils/common.js';
import GameObject from '../game/gameobject.js';


const createTextures = (images, cache) => {
  for(const key in images) {
    cache.createTexture(images[key]);
  }
  return cache.queryCache();
}

const loadStage = (json, name, cache) => {
  const obj = json.stages;
  if(!obj[name]) throw `Error - Scene ${name} does not exist`;
  const urls = obj[name].map(x => '/public/images/' + x.url);
  return utils.loadImages(urls).then(images => {
    let textures = createTextures(images, cache);
    let layers = [];
    for(let i = 0; i < textures.length; i++) {
      let texture = cache.getTexture(textures[i]);
      let layer = new GameObject(texture.width, texture.height);
      layer.texture = textures[i];
      layer.px = obj[name][i].px;
      layer.py = obj[name][i].py;
      layers.push(layer);
    }
    return layers;
  })
}

const onSFXFetch = obj => {
  let textures = [];
  for(let sfx in obj.sfx) {

  }
}

//exports
export const loadScene = (name, cache) => {
  return utils.fetchJSONs(['/public/data/stages.json'])
  .then(obj => loadStage(obj, name, cache))
}

export const loadSFX = cache => {
  return utils.fetchJSONs(['/public/data/sfx.json'])
  .then(obj => onSFXFetch(obj));
}

export const loadActors = (actors, cache) => {
  actors.push
  return utils.fetchJSONs([''])
}
