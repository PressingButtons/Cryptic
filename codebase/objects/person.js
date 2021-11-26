import RigidBody from './rigidbody.js';

const Person = function(width, height, body) {
  RigidBody.call(this, width, height, body);
  this.states = new Uint8Array(5);
}

Person.prototype = Object.create(RigidBody.prototype);
Person.prototype.constructor = Person;

Object.defineProperties(Person.prototype, {
  onland:   {get( ){return this.states[0]}, set(bool){this.states[0] = bool}},
  jumping:  {get( ){return this.states[1]}, set(bool){this.states[1] = bool}},
  rising:   {get( ){return this.states[2]}, set(bool){this.states[2] = bool}},
  falling:  {get( ){return this.states[3]}, set(bool){this.states[3] = bool}},
  jumpAcc: {get( ){return this.states[4]}, set(bool){this.states[4] = bool}}
});

Person.prototype.update = function(dt) {
  updateStates(this);

}

const updateStates = person => {
  if(person.onland && Math.abs(person.speed_y) > 2) {
    person.onland = false;
    person.jumping = true;
  }
  if(person.jumping) {
    if(person.speed_y < 0) {
      person.rising = true;
      person.falling = false;
    }
    else {
      person.falling = true;
      person.rising = false;
      person.jumpAcc = false;
    }
  }
  if(person.onland && person.falling) {
    person.falling = false;
    person.rising = false;
    person.jumping = false;
    //person.landing = true;
  }
}

export default Person;
