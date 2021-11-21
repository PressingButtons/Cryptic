import * as loader from '../utils/loader.js';

let world;

const createWorld = objects => {
  world = new World( );
  initActors(objects[0]);
  initScene(objects[1));
}

const setGameCache = objects => {
  catalogActors(objects[0]);
  catalogScene(objects[1]);
}

const catalogActors = objects => {
  for(let name in objects) {
    let object = objects[name]
    gameCache.data[name] = object.data;
    gameCache.texture[name] = createTexture(object.texture);
  }
}

const catalogScene = sceneData => {
  gameCache = {name: sceneData.name}
  //gameCache.
}

//exports
export const init = canvas => {
  let promises = [loadConfig( ), Graphics.init(canvas)];
  return Promise.all(promises);
}

export const compile = (actors, level) => {
  return loader.loadAssets(actors, level).then(createWorld)
}
