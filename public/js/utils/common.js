const fetchText = url => {
  return fetch(url).then(response => response.text());
}

export const fetchTexts = urls => {
  let promises = urls.map(url => fetchText(url));
  return Promise.all(promises).then(texts => catalogItems(urls, texts));
}

const fetchJSON = url => {
  return fetch(url).then(response => response.json());
}

export const fetchJSONs = urls => {
  let promises = urls.map(url => fetchJSON(url));
  return Promise.all(promises).then(jsons => catalogItems(urls, jsons));
}

const catalogItems = (urls, items) => {
  let results = { };
  urls.forEach((url, i) => {
    let key = url.substring(url.lastIndexOf('/') + 1).split('.')[0];
    results[key] = items[i];
  })
  return results;
}

export const loadImages = urls => {
  let promises = urls.map(url => loadImage(url));
  return Promise.all(promises).then(catalogImages);
}

const loadImage = url => {
  return new Promise(function(resolve, reject) {
    let image = new Image( );
    image.onload = event => {resolve(image)};
    image.onerror = event => {reject(event)};
    image.src = url;
  });
}

const catalogImages = images => {
  let results = {};
  for(const image of images) {
    let key = image.src.substring(image.src.lastIndexOf('/') + 1).split('.')[0];
    results[key] = image;
  }
  return results;
}
