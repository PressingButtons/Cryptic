//exports
export const init = canvas => {
  let promises = [loadConfig( ), Graphics.init(canvas)];
  return Promise.all(promises);
}

export const compile = (actors, level) => {
  
}
