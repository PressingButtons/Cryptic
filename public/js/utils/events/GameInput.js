//GLOBALS
let Gamepads = {};
//LISTENERS
const keyboardListener = event => {
  let state = event.type == "keydown";
  let event_data = {type: 'keyboard', pressed: state, key: event.key.toLowerCase(), index: -1 }
  document.dispatchEvent(new CustomEvent('gameinput', {detail: event_data}))
}

const onGamepadConnect = gamepad => {
  recordButtons(gamepad)
  document.dispatchEvent(new CustomEvent('gamecontrollerconnected', {detail: {index: gamepad.index}}));
}

const onGamepadDisconnect = index => {
  delete Gamepads[index];
  document.dispatchEvent(new CustomEvent('gamecontrollerdisconnected', {detail: {index: index}}))
}
//METHODS
const checkButtons = gamepad => {
  Gamepads[gamepad.index].buttons.forEach((button, i) => {
    if(!button.pressed && gamepad.buttons[i].pressed || button.pressed && !gamepad.buttons[i].pressed) {
      let event_data = {type: 'gamepad', pressed: gamepad.buttons[i].pressed, key: i, index: gamepad.index }
      document.dispatchEvent(new CustomEvent('gameinput', {detail: event_data}));
    }
  });
}

const confirmGamepadConnections = query => {
  for(var gamepad of query) {
    if(!Gamepads.hasOwnProperty(gamepad.index)) onGamepadConnect(gamepad);
  }
  for(var index in Gamepads) {
    if(!query[index]) onGamepadDisconnect(index);
  }
}

const queryGamepads = ( ) => {
  let query = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  confirmGamepadConnections(query);
  query.forEach(checkButtons);
  query.forEach(recordButtons);
}

const pollGamepads = timestamp => {
  queryGamepads( );
  requestAnimationFrame(pollGamepads);
}

const recordButtons = gamepad => {
  Gamepads[gamepad.index] = {buttons: []};
  Gamepads[gamepad.index]["buttons"] = gamepad.buttons.map((button,index) => {
    return {pressed: button.pressed, value: index}
  })
}
//EXPORTS
export const GAMEINPUT_EVENT = 'gameinput';
export const GAMECONTROLLER_CONNECT_EVENT = 'gamecontrollerconnected';
export const GAMECONTROLLER_DISCONNECT_EVENT = 'gamecontrollerdisconnected';

export const init = ( ) => {
  document.addEventListener('keydown', keyboardListener);
  document.addEventListener('keyup', keyboardListener);
  pollGamepads()
}
