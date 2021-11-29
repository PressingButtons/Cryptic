const InputReader = function(controller) {

  const DOUBLE_THRESOLD = 340;

  let log = [];

  let fresh = true;

  let lastPressed = [];

  let inputs = {
    left:  {active: false, double: true, button: "d3"},
    right: {active: false, double: true, button: "d4"},
    up:    {active: false, double: true, button: "d1"},
    down:  {active: false, double: true, button: "d2"},
    btnA:  {active: false, button: "f3"},
    btnB:  {active: false, button: "f4"},
    btnC:  {active: false, button: "f1"},
    btnD:  {active: false, button: "f2"},
    btnL:  {active: false, button: "l1"},
    btnR:  {active: false, button: "r1"}
  }

  const keyIsDown = key => {
    return controller.buttons[inputs[key].button].active;
  }

  const logButtons = (timestamp = 0) => {
    let activeButtons = [];
    const lastSet = lastPressed[lastPressed.length - 1] || null;
    //directional
    if(keyIsDown('right') && !keyIsDown('up') && !keyIsDown('down')) activeButtons.push(parseDirection('right', timestamp));
    else if(keyIsDown('right') && keyIsDown('up') && !keyIsDown('down')) activeButtons.push(parseDirection('up_right', timestamp));
    else if(keyIsDown('right') && !keyIsDown('up') && keyIsDown('down')) activeButtons.push(parseDirection('down_right', timestamp));
    //
    if(keyIsDown('left') && !keyIsDown('up') && !keyIsDown('down')) activeButtons.push(parseDirection('left', timestamp));
    if(keyIsDown('left') && keyIsDown('up') && !keyIsDown('down')) activeButtons.push(parseDirection('up_left', timestamp));
    if(keyIsDown('left') && !keyIsDown('up') && keyIsDown('down')) activeButtons.push(parseDirection('down_left', timestamp));
    ///
    if(keyIsDown('up') && !keyIsDown('left') && !keyIsDown('right')) activeButtons.push(parseDirection('up', timestamp));
    if(keyIsDown('down') && !keyIsDown('left') && !keyIsDown('right')) activeButtons.push(parseDirection('down', timestamp));
    //nondirectional
    if(keyIsDown('btnA')) activeButtons.push('A');
    if(keyIsDown('btnB')) activeButtons.push('B');
    if(keyIsDown('btnC')) activeButtons.push('C');
    if(keyIsDown('btnD')) activeButtons.push('D');
    if(keyIsDown('btnL')) activeButtons.push('L');
    if(keyIsDown('btnR')) activeButtons.push('R');
    //
    if(activeButtons.length > 0) {
      fresh = false;
      let buttonSet = {time: timestamp, set: activeButtons};
      let compare = compareSets(buttonSet.set)
      if(!compare) {
        if(log.length == 10) {
          log.shift( );
        }
        log.push(buttonSet);
      }
      else {
        compare.time = timestamp;
      }
    } else {
      fresh = true;
    }
  }

  const compareSets = (set) => {
    if(log.length == 0) return false;
    const prev = log[log.length - 1];
    if(prev.set.length != set.length) return false;
    for (let key of prev.set) {
      if(set.indexOf(key) == -1) return false;
    }
    return prev;
  }

  const inPrevious = (last, type) => {
    if(last)
    for(const entry of last.set) {
      let matches = entry.match(type);
      if(matches != null && matches.length > 0) return true;
    }
    return false;
  }

  const parseDirection = (type, timestamp) => {
    let lastSet = log[log.length - 1] || null;
    if(lastSet != null) {
      //console.log('here', timestamp - lastSet.time < DOUBLE_THRESOLD, inPrevious(lastSet, type))
      if(timestamp - lastSet.time < DOUBLE_THRESOLD && inPrevious(lastSet, type) && fresh) {
        return 'dbl_' + type;
      }
    }
    return type;
  }

  const update = timestamp => {
    logButtons(timestamp);
  }

  return {
    get log( ) { return [...log]; },
    update: update
  }

}

export default InputReader;
