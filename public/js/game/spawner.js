import * as Actors from './actors/actorlib.js';

const spawn = function(request) {
  let actor = new Actors[request](this.defs[request]) || null;
  return actor;
}

const create = defs => {
  return {defs: defs, spawn: spawn}
}
