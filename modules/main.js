import { Board } from './board.js';
import { setUpButtons } from './buttons.js';

const board = new Board();

setUpButtons();
board.tableCreate();
board.unloadScrollBars();
board.mouseListeners();

export { board };
