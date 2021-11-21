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

const loadActor = (actorName, pkg = { }) => {
  if(pkg[actorName]) return pkg;
  return loadData(`actors/${actorName}`)
  .then( data => loadImageAndPackageActor(data, pkg))
  .then( name => loadSubActors(name, pkg));
}


const loadImageAndPackageActor = (data, pkg) => {
  return loadImage(data.image).then( image => {
    pkg[data.name] = {data: data, texture: image};
    return data.name;
  })
}

const loadSubActors = (name, pkg) => {
  if(!pkg[name].data.requirements || pkg[name].data.requirements.length == 0) return pkg;
  let promises = pkg[name].data.requirements.map(x => loadActor(x, pkg));
  return Promise.all(promises)
}

const loadActors = actorReq => {
  let promises = actorReq.map( ar => loadActor(ar));
  return Promise.all(promises);//.then(combineActorPackages);
}

const combineActorPackages = results => {
  let pkgs = [].concat.apply([], results);
  if(pkgs.length > 1) {
    for(var i = 1; i < pkgs.length; i++) {
      Object.assign(pkgs[0], pkgs[i]);
    }
  }
  return pkgs[0];
}

const loadScene = sceneReq => {
  return loadData(`scenes/${sceneReq}`)
  .then(data => {
    let promises = data.layers.map(layer => loadImage(layer.url));
    return Promise.all(promises).then( images => {
      data.textures = images;
      return data;
    })
  })
}

const loadAssets = (actorRequest, sceneRequest) => {
  actorRequest = [...new Set(actorRequest)];
  return Promise.all([loadActors(actorRequest), loadScene(sceneRequest)]);
}

//exports
export {loadAssets, loadScene, loadActors, loadData}
