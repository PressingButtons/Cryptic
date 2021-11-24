import * as screenModifier from './utils/screenModifier.js';
import main from './drivers/test01.js';

const app = jev => {
  screenModifier.fitToScreen( );
  $(window).resize(screenModifier.fitToScreen);
  main( );
}

$(document).ready(app);
