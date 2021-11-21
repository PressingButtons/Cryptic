const createLayout = ( ) => {
  return {
    active: false, source: null,
    0 : {action: "", active: false, disabled: false},
    1 : {action: "", active: false, disabled: false},
    2 : {action: "", active: false, disabled: false},
    3 : {action: "", active: false, disabled: false},
    4 : {action: "", active: false, disabled: false},
    5 : {action: "", active: false, disabled: false},
    6 : {action: "", active: false, disabled: false},
    7 : {action: "", active: false, disabled: false},
    8 : {action: "", active: false, disabled: false},
    9 : {action: "", active: false, disabled: false},
    10: {action: "", active: false, disabled: false},
    11: {action: "", active: false, disabled: false},
    12: {action: "", active: false, disabled: false},
    13: {action: "", active: false, disabled: false},
    14: {action: "", active: false, disabled: false},
    15: {action: "", active: false, disabled: false},
    16: {action: "", active: false, disabled: false},
  }
}

const keyboardMap = {

}

const controllers = {keyboard: createLayout(), 0: createLayout( ), 1: createLayout( ), 2: createLayout( ), 3: createLayout( )}

const loadScheme = (index, scheme) => {
  for(var btn in scheme) {
    controllers[index][btn].key = scheme[btn];
  }
}

const readInput = (index, source) => {
  controllers[index].source = source;
}

const onGameInput = customEvent => {
  let data = event.detail;
  if(data.type == 'keyboard') updateKeyboardController(controllers.keyboard, data);
  else updateGameController(controllers[data.index], data);
}

const updateKeyboardController = (controller, event) => {
  if(!controller.active) return;
  if(!controller[event.value].active) return;
  let buttonIndex = keyboardMap[event.key];
  controller[buttonIndex].active = event.pressed;
}

const updateGameController = (controller, event) => {

}

document.addEventListener('gameinput', onGameInput);
