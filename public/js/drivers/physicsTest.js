import * as UIController from '../system/uicontroller.js';
import * as GameInput from '../utils/events/gameinput.js';
import * as Loader from '../utils/loader.js'
import * as Graphics from '../system/graphics.js'
import * as Spawner from '../game/spawner.js';

const keyboardBinds = {
  "w": "d1",
  "s": "d2",
  "a": "d3",
  "d": "d4"
}

const gamepadBinds = {
  0: "d1",
  1: "d2",
  3: "d3",
  4: "d4"
}

let r = false;

const controllers = [];

const worker = new Worker('/public/js/workers/vertexworker.js');


let dummy, spawner, cache;

let vertexData;

const main = ( ) => {
  Graphics.init($('#canvas')[0]).then(onInit);
}

const onInit = ( ) => {
  let kc = new UIController.UIController( );
  kc.bind(UIController.KEYBOARD, keyboardBinds);
  let gc = new UIController.UIController( );
  gc.bind(UIController.GAMEPAD0, gamepadBinds);
  controllers.push(kc, gc);
  readInput( );
  GameInput.init( );
  Loader.loadAssets(Graphics.createTexture, 'actors/dummy').then(onAssetsLoaded);
}

const onAssetsLoaded = assets => {
  spawner = Spawner.create(assets.objects);
  cache = assets.textures;
  dummy = spawner.spawn('dummy');
  sendVertexData();
}

const reportControllers = ( ) => {
  for(let i = 0; i < controllers.length; i++) {
    let container = document.createElement('div');
    let controller = controllers[i];
    for(let key in controller.buttons) {
      let button = controller.buttons[key];
      let entry = document.createElement('p');
      $(entry).html(`Controller[${i}].source[${controller.sourceIndex}].Button[${key}] - ${button.active}`);
      $(container).append(entry);
    }
    $('.debug').append(container);
  }
}

const reportDummy = (obj, index) => {
  if(!obj) return
  let container = document.createElement('div');
  let reportList = ["x", "y"];
  reportList.forEach(item => {
    let p = document.createElement('p');
    $(p).html(`Dummy.${item}[${obj[item]}]`);
    $(container.append(p));
  })
  $('.debug').append(container);
}

const readController = (controller, target) => {
  if(controller.buttons.d1.active) target.y--;
  if(controller.buttons.d2.active) target.y++;
  if(controller.buttons.d3.active) target.x--;
  if(controller.buttons.d4.active) target.x++;
}

const readInput = timestamp => {
  $('.debug').html('');
  readController(controllers[0], dummy);
  reportControllers( );
  reportDummy(dummy, 0);
  draw( );
  requestAnimationFrame(readInput);
}

const draw = ( ) => {
  Graphics.clear( );
  if(!dummy) return;
  let data = new Float32Array(vertexData);
  Graphics.drawVertexAndTexture(data, cache.dummy)
}

const sendVertexData = ( ) => {
  if(!dummy) return;
  let buffer = dummy.vertexData.slice().buffer;
  worker.postMessage(buffer, [buffer])
}

const onWorkerMessage = event => {
  vertexData = event.data;
  sendVertexData( );
}

worker.onmessage = onWorkerMessage;

export default main;
