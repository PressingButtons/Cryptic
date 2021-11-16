import GameObject from './gameobject.js';

const DisplayList = function( ) {
  let objects = [];

  const addObject = function(gameobject) {
    if(!gameobject instanceof GameObject) throw "Error (DisplayList.addObject) - cannot add object to displayList, object is not instance of [GameObject].";
    objects.push(gameobject);
  }

  const removeObject = function(gameobject) {
    objects.splice(objects.indexOf(gameobject, 1));
  }

  const swap = function(a, b) {
    let ia = objects.indexOf(a);
    if(ia < 0) throw "Error (DisplayList.swap) - cannot swap primary object, object is not in display list.";
    let ib = objects.indexOf(b);
    if(ib < 0) throw "Error (DisplayList.swap) - cannot swap secondary object, object is not in display list.";
    objects.splice(ia, 1, b);
    objects.splice(ib, 1, a);
  }

  const getDisplayData = ( ) => {
    let bufferData = [].concat.apply([], objects.map(x => x.vertexData));
    console.log(bufferData);
    return bufferData;
  }
}
