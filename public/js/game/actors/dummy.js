import Actor from './actor.js';

const Dummy = function(obj) {
  Actor.call(this, obj)
}

Dummy.prototype = Object.create(Actor.prototype);
Dummy.prototype.constructor = Dummy;

export default Dummy;
