//methods
const packagePrefab = object => {
  return loadImage(object.image)
  .then(image => {return {data: object.data, image: image}})
}

//exports
export const loadJSON = url => {
  return fetch(url).then(response => response.json());
}

export const loadText = url => {
  return fetch(url).then(response => response.text());
}

export const loadImage = url => {
  return new Promise(function(resolve, reject) {
    let image = new Image( );
    image.onload = event => {resolve(image)};
    image.onerror = event => {reject(event)};
    image.src = `/assets/images/${url}.png`;
  });
}

export const loadPrefab = req => {
  return loadJSON(`/codebase/prefabs/${req}.json`).then(packagePrefab)
}
