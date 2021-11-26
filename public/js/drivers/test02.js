import * as System from '/codebase/system/system.js';
import * as Loader from '/codebase/utils/load.js';
import Person from '/codebase/objects/person.js';
import * as UIController from '/codebase/system/uicontroller.js';
import * as GameInput from '/codebase/events/gameinput.js';
import * as Debug from '/public/js/utils/debug.js';

GameInput.init( );

const main = ( ) => {
  System.Graphics.init(document.getElementById('canvas'), 'texture', 'shape').then(test);
}

const test = ( ) => {

  const objects = [];
  const numObjects = 3;

  const displaybuffer = System.DisplayBuffer;

  displaybuffer.execute(objects)

  const camera = new System.Camera( );

  let lastTime;

  const dir = {
    left: false,
    right: false,
    up: false,
    down: false
  }

  const map = {
    12: "d1",
    13: "d2",
    14: "d3",
    15: "d4",
    4:  "l1",
    5:  "r1"
  }

  let left = false, right = false;

  let cnt = new UIController.UIController( );

  cnt.bind(UIController.GAMEPAD0, map);

  const speedForce = 4;
  const jumpForce = 6;
  let jumping = false;
  let force = 0;
  let jumpCount = 3;
  let jumps = jumpCount;
  let up = false;

  const jumpObject = (object) => {
    object.floating = false;
    object.speed_y = -force;
    object.onland = false;
    jumping = false;
  }

  const readController = controller => {
    const target = objects[0];
    if(!target) return;
    if(target.onland) {
      jumps = jumpCount;
    }
    if(!controller.buttons.d1.active && target.jumpAcc) {
      target.jumpAcc = false;
    }
    if(controller.buttons.d1.active) {
      if(target.onland) {
        if(!target.jumpAcc) {
          target.speed_y = -jumpForce;
          target.jumpAcc = true;
          jumps--;
        }
        if(!controller.buttons.d3.active && !controller.buttons.d4.active) target.speed_x = 0;
      }
      else {
        if(!target.jumpAcc && jumps > 0 && !up) {
          target.speed_y = -jumpForce;
          jumps --;
          if(!controller.buttons.d3.active && !controller.buttons.d4.active || controller.buttons.d3.active && controller.buttons.d4.active) target.speed_x = 0;
          if(controller.buttons.d3.active && !controller.buttons.d4.active) target.speed_x = -speedForce;
          if(!controller.buttons.d3.active && controller.buttons.d4.active) target.speed_x = speedForce;
        }
      }
      up = true;
    } else {
      up = false;
    }
    if(controller.buttons.d2.active) target.speed_y = 10;
    if(controller.buttons.d3.active && target.onland) {
      target.speed_x = -speedForce;
      target.ry = 180;
    }
    if(controller.buttons.d4.active && target.onland) {
      target.speed_x = speedForce;
      target.ry = 0;
    }
  }

  const updateObjects = (objects, dt) => {
    for(const object of objects) {
      object.update(dt);
      System.Physics.applyPhysics(object, objects, dt);
    }
  }

  const run = currentTime => {
    if(!lastTime) lastTime = currentTime;
    let dt = (currentTime - lastTime) * 0.0001;
    $('.debug').html('');
    readController(cnt);
    updateObjects(objects, dt);
    //psuedoPhysics(objects, dt)
    camera.setDimensions(canvas.width, canvas.height);
    System.Graphics.drawObjects(displaybuffer.getBufferData(), camera.getProjection(), objects);
    reportObjects(objects);
    lastTime = currentTime;
    requestAnimationFrame(run);
  }

  Loader.loadImage('entities/dummy')
  .then(image => {
    createObjects(objects, numObjects, System.Graphics.createTexture(image));
  })
  .then(run);
}

const createObjects = (objects, num, textureData) => {
  for(let i = 0; i < num; i++) {
    objects.push(new Person(128, 128, [45, 29, 38, 83]));
    objects[i].x = Math.random( ) * 1000;
    objects[i].texture = textureData;
    objects[i].onland = false;
    objects[i].speed_y = 3;
  }
}

const psuedoPhysics = (objects, dt, gravity = 180) => {
  const FLOOR = 700;
  for(const object of objects) {
    object.y += object.speed_y;
    object.x += object.speed_x;
    object.speed_y += (gravity * dt) || 0;
    for(const next of objects) {
      if(next == object) continue;
      collideBodies(object, next);
    }
    //
    if(object.bottom >= FLOOR) {
      object.speed_y = 0;
      object.bottom = FLOOR;
      if(object.speed_x > 0) object.speed_x --;
      else if(object.speed_x < 0) object.speed_x++;
      object.onland = true;
    } else {
      object.onland = false;
    }
  }
}

const collideBodies = (a, b) => {
  if(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)) return;
  let cw = a.right - b.left;
  let ch = a.bottom - b.top;
  let centerX = b.left + cw/2;
  let centerY = b.top + ch/2;
  if(a.left < b.left) {
    a.right = centerX - 1;
    b.left = centerX + 1;
  } else {
    b.right = centerX - 1;
    a.left = centerX + 1;
  }
  //a.bottom = centerY;
  //b.top = centerY;
}

const reportObjects = objects => {
  for(let i = 0; i < objects.length; i++) {
    Debug.reportProperty(i, objects[i], 'x', 'y', 'speed_x', 'speed_y');
  }
}

export default main;
