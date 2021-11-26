import Person from '/codebase/objects/person.js';

let bounds = [0, 0, 1000, 800];
let gravity = 200, frictional_force = 50;
let normalForce = 1;

const AABB = (a, b) => {
  if(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)) return null;
  return {
    x1: b.left > a.left ? b.left : a.left,
    y1: b.top > a.top ? b.top : a.top,
    x2: a.right < b.right ? a.right : b.right,
    y2: a.bottom < b.bottom ? b.bottom : a.bottom
  }
}

let r = false;

const moveObject = (object, dt) => {
  object.x += object.speed_x;
  object.y += object.speed_y;
  if(!object.jumpAcc) {
    object.speed_y += (gravity * dt) || 0;
  } else {
    object.speed_y += (gravity * dt)/2 || 0;
  }
}

const friction = (object, dt) => {
  if(!object.onland) return;
  if(object.speed_x > normalForce) {
    object.speed_x -= 1;
  } else if(object.speed_x < -normalForce) {
    object.speed_x += 1
  } else {
    object.speed_x = 0;
  }
}

const applyBounds = object => {
  if(object instanceof Person) boundPerson(object);
}

const boundPerson = person => {
  if(person.bottom >= bounds[3]) {
    person.bottom = bounds[3];
    person.onland = true;
    person.speed_y = person.speed_y > 0 ? 0 : person.speed_y;
  }
}


const collideObjects = (object1, object2) => {
  let collision = AABB(object1, object2);
  if(!collision) return;
  collidePersons(collision, object1, object2); //would be a check
}

const collidePersons = (collision, p1, p2) => {
  if(p1.left < p2.left) {
    p1.right = collision.x1;
    p2.left  = collision.x2;
  } else {
    p1.left  = collision.x2;
    p2.right = collision.x1
  }
}


export const setBounds = _bounds => {bounds = _bounds};

export const applyPhysics = (object, objects, dt) => {
  moveObject(object, dt);
  friction(object, dt);
  for(const sub of objects) {
    if(sub == object) continue;
    collideObjects(object, sub);
  }
  applyBounds(object);
}
