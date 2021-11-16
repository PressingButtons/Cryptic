import Actor from '../game/actor.js';

const frameData = {
  frames: [
    {
      x: 0, y: 0, width: 128, height: 128,
      body: {x:45, y:29, width: 38, height: 83},
      hitboxes: [],
      hurtboxes: [{x:45, y:29, width: 38, height: 83}]
    }
  ]
}

const ActorTest = function( ) {
  Actor.call(this, 128, 128, null, frameData);
}
