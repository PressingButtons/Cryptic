const KEYBOARD = -1, GAMEPAD0 = 0, GAMEPAD1 = 1, GAMEPAD2 = 2, GAMEPAD3 = 3;

const onGameInput = function(controller, event) {
  if(controller.sourceIndex === null) controller.active = false;
  if(!controller.active) return;
  if(event.detail.index != controller.sourceIndex) return;
  const button = controller.buttons[controller.map[event.detail.key]] || null;
  if(!button) return;
  if(button.disabled) {
    button.active = false;
    return;
  }
  button.active = event.detail.pressed;
}

const controllerDefintion = {
  bind: {value: function(index, map) {
    this.map = map;
    this.sourceIndex = isNaN(index) ? parseIndex(indexOrType) : index;
    document.addEventListener('gameinput', event => {onGameInput(this, event)});
  }},
}

const parseIndex = value => {
  switch (value) {
    case 'keyboard': value = -1; break;
    case 'gamepad0': value =  0; break;
    case 'gamepad1': value =  1; break;
    case 'gamepad2': value =  2; break;
    case 'gamepad3': value =  3; break;
    default: value = null
  }
  return value;
}


const UIController = function( ) {
  this.sourceIndex = null;
  this.active = true;
  this.map;
  Object.defineProperty(this, 'buttons', { value: {
    d1: {active: false, disabled: false, action: "up"},
    d2: {active: false, disabled: false, action: "down"},
    d3: {active: false, disabled: false, action: "left"},
    d4: {active: false, disabled: false, action: "right"},
    f1: {active: false, disabled: false, action: "confirm"},
    f2: {active: false, disabled: false, action: "cancel"},
    f3: {active: false, disabled: false, action: ""},
    f4: {active: false, disabled: false, action: ""},
    l1: {active: false, disabled: false, action: ""},
    l2: {active: false, disabled: false, action: ""},
    l3: {active: false, disabled: false, action: ""},
    r1: {active: false, disabled: false, action: ""},
    r2: {active: false, disabled: false, action: ""},
    r3: {active: false, disabled: false, action: "reset"},
    m1: {active: false, disabled: false, action: "menu"},
    m2: {active: false, disabled: false, action: "option"},
    m3: {active: false, disabled: false, action: ""},
    m4: {active: false, disabled: false, action: ""}
  }});
}

Object.defineProperties(UIController.prototype, controllerDefintion);

export {UIController, KEYBOARD, GAMEPAD0, GAMEPAD1, GAMEPAD2, GAMEPAD3}
