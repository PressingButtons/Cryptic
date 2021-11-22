const loadData = url => {
  return fetch(`/public/data/${url}.json`).then(response => response.json());
}

const loadImage = url => {
  return new Promise(function(resolve, reject) {
    let image = new Image( );
    image.onload = event => {resolve(image)};
    image.onerror = event => {reject(event)};
    image.src = `public/images/${url}.png`;
  });
}

const loadAsset = (name, pkg = {}) => {
  if(pkg[name]) return pkg;
  return loadData(name)
  .then(obj => loadImageAndCatalogActor(obj, pkg))
  .then(pName => loadSubAsset(pName, pkg))
}


const loadImageAndCatalogActor = (obj, pkg) => {
  let promises = obj.images.map(i => loadImage(i))
  return Promise.all(promises)
  .then(images => {
    pkg[obj.data.name] = {data: obj.data, images: images};
    return obj.data.name;
  })
}

const loadSubAsset = (name, pkg) => {
  if(!pkg[name].data.requirements || pkg[name].data.requirements.length == 0) return pkg;
  let promises = pkg[name].data.requirements.map(x => loadAsset(x, pkg));
  return Promise.all(promises)
}

const loadAssets = (func, ...names) => {
  let list = new Set(names), pkg = {};
  let promises = [...list].map(name => loadAsset(name, pkg));
  return Promise.all(promises).then(( ) => generateCache(func, pkg));
}

const generateCache = (createTexture, objects) => {
  let pkg = {objects: {}, textures: {}}
  for(let entry in objects) {
    pkg.objects[entry] = objects[entry].data;
    for(const img of objects[entry].images) {
      let name = img.src.substring(img.src.lastIndexOf('/') + 1).split('.')[0];
      pkg.textures[name] = createTexture(img);
    }
  }
  return pkg;
}

//exports
export {loadAssets, loadData, loadImage}
