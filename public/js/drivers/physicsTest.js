import * as UIController from '../system/uicontroller.js';
import * as GameInput from '../utils/events/gameinput.js';

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

const controllers = [];

let uic;

const main = ( ) => {
  let kc = new UIController.UIController( );
  kc.bind(UIController.KEYBOARD, keyboardBinds);
  let gc = new UIController.UIController( );
  gc.bind(UIController.GAMEPAD0, gamepadBinds);
  controllers.push(kc, gc);
  console.log(controllers);
  readInput( );
  GameInput.init( );
}

const readInput = timestamp => {
  $('.debug').html('');
  console.log(controllers[1].buttons.d1.active);
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
  requestAnimationFrame(readInput);
}


export default main;
