class Board {
  constructor() {
    this.windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    this.windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    this.numRows = Math.ceil(this.windowHeight / 30);
    this.numCols = Math.ceil(this.windowWidth / 30);

    this.removingWalls = false;
    this.drawingWalls = false;
    this.movingStartNode = false;
    this.movingEndNode = false;

    this.grid = [[]];
    this.prevX;
    this.prevY;
    this.searching = false;
  }
  GridVisited(pos) {
    if (
      pos[0] < this.numCols &&
      pos[0] >= 0 &&
      pos[1] >= 0 &&
      pos[1] < this.numRows
    ) {
      return (this.grid[pos[0]][pos[1]] = -1);
    } else {
      console.log(
        'ERROR: The node you are trying to mark as visited is out of range!'
      );
    }
  }
  getSearching() {
    return this.searching;
  }

  setSearchingTrue() {
    this.searching = true;
  }

  setSearchingFalse() {
    this.searching = false;
  }

  GridValue(pos) {
    if (
      pos[0] < this.numCols &&
      pos[0] >= 0 &&
      pos[1] >= 0 &&
      pos[1] < this.numRows
    ) {
      return this.grid[pos[0]][pos[1]];
    }
  }

  numberCols() {
    return this.numCols;
  }

  numberRows() {
    return this.numRows;
  }

  get SearchValue() {
    return this.search;
  }

  set SearchValue(value) {
    if (typeof value === 'boolean') {
      this.search = value;
      return this.search;
    }
  }

  createGrid(cols = this.numCols, rows = this.numRows) {
    for (let x = 0; x < cols; x++) {
      this.grid[x] = [];
      for (let y = 0; y < rows; y++) {
        this.grid[x][y] = 0;
      }
    }
  }

  tableCreate() {
    this.createGrid();
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.classList.add('board');
    let tbl = document.createElement('table');
    tbl.classList.add('table');
    let tbdy = document.createElement('tbody');
    for (let y = 0; y < this.numRows; y++) {
      let tr = document.createElement('tr');
      for (let x = 0; x < this.numCols; x++) {
        let td = document.createElement('td');
        // Setting the start and end nodes
        if (x === 4 && y === Math.ceil(this.numRows / 2) - 2) {
          this.grid[x][y] = 3;
          td.classList.add('startNode');
        } else if (
          y === Math.ceil(this.numRows / 2) - 2 &&
          x === this.numCols - 5
        ) {
          td.classList.add('endNode');
          this.grid[x][y] = 4;
        }
        td.id = `${x}-${y}`;
        tr.appendChild(td);
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    div.appendChild(tbl);
    body.appendChild(div);
  }

  clearPrevStartNodes() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (this.grid[x][y] === 3) {
          this.grid[x][y] = 0;
          document.getElementById(`${x}-${y}`).classList.remove('startNode');
        }
      }
    }
  }

  clearPrevEndNodes() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (this.grid[x][y] === 4) {
          this.grid[x][y] = 0;
          document.getElementById(`${x}-${y}`).classList.remove('endNode');
        }
      }
    }
  }

  setGridWall(pos) {
    if (
      pos[0] < this.numCols &&
      pos[0] >= 0 &&
      pos[1] >= 0 &&
      pos[1] < this.numRows
    ) {
      this.grid[pos[0]][pos[1]] = 1;
    }
  }

  generateRandomWalls() {
    console.log('Generating Random Walls...');
    this.setSearchingTrue();
    let numWalls = 0;
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (Math.random() < 0.3 && this.grid[x][y] === 0) {
          this.setGridWall([x, y]);
          numWalls++;
          setTimeout(function() {
            document.getElementById(`${x}-${y}`).classList.add('wall');
          }, numWalls * 3);
        }
      }
    }
    // Required to bind 'this' to 'this_' as 'this' is not within the scope of the setTimeout function!
    const this_ = this;
    setTimeout(function() {
      this_.setSearchingFalse();
    }, numWalls * 3);
  }

  // recursiveBacktracker() {
  //   let stack = [];
  //   stack.push([0, 0]);
  //   this.grid[0][0] = -1;
  //   while (stack.length > 0) {
  //     console.log('itt');
  //     let currentCell = stack.pop();
  //     let neighbours = [
  //       [currentCell[0] + 2, currentCell[1]],
  //       [currentCell[0] - 2, currentCell[1]],
  //       [currentCell[0], currentCell[1] + 2],
  //       [currentCell[0], currentCell[1] + 2]
  //     ];
  //     for (let i = 0; i < neighbours.length; i++) {
  //       if (
  //         neighbours[i][0] >= 0 &&
  //         neighbours[i][0] < this.numCols - 2 &&
  //         neighbours[i][1] >= 0 &&
  //         neighbours[i][1] < this.numRows - 2 &&
  //         this.grid[neighbours[i][0]][neighbours[i][1]] === 0
  //       ) {
  //         stack.push(currentCell);
  //         let dx;
  //         currentCell[0] > neighbours[i][0]
  //           ? (dx = currentCell[0] - neighbours[i][0])
  //           : (dx = neighbours[i][0] - currentCell[0]);
  //         let dy;
  //         currentCell[0] > neighbours[i][0]
  //           ? (dy = currentCell[0] - neighbours[i][0])
  //           : (dy = neighbours[i][0] - currentCell[0]);
  //         let wall = [currentCell[0] + dx, currentCell[1] + dy];
  //         console.log(wall);
  //         this.grid[wall[0]][wall[1]] = 0;
  //         this.grid[neighbours[i][0]][neighbours[i][1]] = -1;
  //         document
  //           .getElementById(`${wall[0]}-${wall[1]}`)
  //           .classList.remove('wall');
  //         stack.push(currentCell);
  //         stack.push(neighbours[i]);
  //         break;
  //       }
  //     }
  //   }
  // }

  //Clear walls
  clearWalls() {
    console.log('Clearing Walls...');
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (this.grid[x][y] === 1) {
          this.grid[x][y] = 0;
          document.getElementById(`${x}-${y}`).classList.remove('wall');
        }
      }
    }
  }

  //clear Path
  clearPath() {
    console.log('Clearing Path...');
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (this.grid[x][y] === -1) {
          this.grid[x][y] = 0;
        }
        document.getElementById(`${x}-${y}`).classList.remove('path');
        document.getElementById(`${x}-${y}`).classList.remove('visited');
        document.getElementById(`${x}-${y}`).classList.add('unvisited');
      }
    }
  }

  getEndNode() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (this.grid[x][y] === 4) {
          return [x, y];
        }
      }
    }
    return false;
  }

  getStartNode() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numCols; x++) {
        if (this.grid[x][y] === 3) {
          return [x, y];
        }
      }
    }
    return false;
  }

  mouseListeners() {
    let table = document.querySelector('table');

    const handleMouseDown = e => {
      if (!this.searching) {
        let x = ~~(e.clientX / 30);
        let y = ~~(
          (e.clientY - document.querySelector('.navigation').clientHeight) /
          30
        );
        console.log('x');
        let id = document.getElementById(`${x}-${y}`);
        if (this.prevX !== x || this.prevY !== y) {
          if (this.drawingWalls && this.grid[x][y] === 0) {
            id.classList.add('wall');
            this.grid[x][y] = 1;
          } else if (this.removingWalls && this.grid[x][y] === 1) {
            id.classList.remove('wall');
            this.grid[x][y] = 0;
          } else if (this.movingStartNode && this.grid[x][y] === 0) {
            this.clearPrevStartNodes();
            this.grid[x][y] = 3;
            id.classList.add('startNode');
          } else if (this.movingEndNode && this.grid[x][y] == 0) {
            this.clearPrevEndNodes();
            this.grid[x][y] = 4;
            id.classList.add('endNode');
          }
          this.prevX = x;
          this.prevY = y;
        }
      }
    };

    table.addEventListener('mousedown', e => {
      if (!this.searching) {
        let x = ~~(e.clientX / 30);
        let y = ~~(
          (e.clientY - document.querySelector('.navigation').clientHeight) /
          30
        );
        let id = document.getElementById(`${x}-${y}`);
        if (id.classList.contains('startNode')) {
          this.movingStartNode = true;
        } else if (id.classList.contains('endNode')) {
          this.movingEndNode = true;
        } else if (id.classList.contains('wall')) {
          this.removingWalls = true;
          this.grid[x][y] = 0;
          id.classList.toggle('wall');
        } else {
          this.grid[x][y] = 1;
          this.drawingWalls = true;
          id.classList.toggle('wall');
        }
        this.prevX = x;
        this.prevY = y;
        this.clearPath();
      }

      table.addEventListener('mousemove', handleMouseDown, true);
    });

    table.addEventListener('mouseup', e => {
      this.removingWalls = false;
      this.drawingWalls = false;
      this.movingStartNode = false;
      this.movingEndNode = false;
      table.removeEventListener('mousemove', handleMouseDown, true);
    });
  }

  unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden'; // firefox, chrome
    document.body.scroll = 'no'; // ie only
  }
}

export { Board };
// this.windowWidth =
//   window.innerWidth ||
//   document.documentElement.clientWidth ||
//   document.body.clientWidth;

// const windowHeight =
//   (window.innerHeight ||
//     document.documentElement.clientHeight ||
//     document.body.clientHeight) - 46;

// const numRows = Math.ceil(windowHeight / 30);
// const numCols = Math.ceil(windowWidth / 30);

// let removingWalls = false;
// let drawingWalls = false;
// let movingStartNode = false;
// let movingEndNode = false;

// let grid = [[]];

// let prevX;
// let prevY;

// let search = false;

// const setGridVisited = (x, y) => {
//   if (x < numCols && x >= 0 && y >= 0 && y < numRows) {
//     grid[x][y] = -1;
//   }
// };

// const setGridWall = (x, y) => {
//   if (x < numCols && x >= 0 && y >= 0 && y < numRows) {
//     grid[x][y] = 1;
//   }
// };

// const getGridValue = (x, y) => {
//   if (x < numCols && x >= 0 && y >= 0 && y < numRows) {
//     return grid[x][y];
//   }
// };

// const getNumberCols = () => {
//   return numCols;
// };

// const getNumberRows = () => {
//   return numRows;
// };

// const getSearchValue = () => {
//   return search;
// };

// const setSearchValue = value => {
//   if (typeof value === 'boolean') {
//     search = value;
//     return search;
//   }
// };

// const createGrid = (cols = numCols, rows = numRows) => {
//   for (let x = 0; x < cols; x++) {
//     grid[x] = [];
//     for (let y = 0; y < rows; y++) {
//       grid[x][y] = 0;
//     }
//   }
// };

// const tableCreate = () => {
//   createGrid();
//   let body = document.getElementsByTagName('body')[0];
//   let div = document.createElement('div');
//   div.classList.add('board');
//   let tbl = document.createElement('table');
//   tbl.classList.add('table');
//   let tbdy = document.createElement('tbody');
//   for (let y = 0; y < numRows; y++) {
//     let tr = document.createElement('tr');
//     for (let x = 0; x < numCols; x++) {
//       let td = document.createElement('td');
//       // Setting the start and end nodes
//       if (x === 4 && y === Math.ceil(numRows / 2) - 2) {
//         grid[x][y] = 3;
//         td.classList.add('startNode');
//       } else if (y === Math.ceil(numRows / 2) - 2 && x === numCols - 5) {
//         td.classList.add('endNode');
//         grid[x][y] = 4;
//       }
//       td.id = `${x}-${y}`;
//       tr.appendChild(td);
//     }
//     tbdy.appendChild(tr);
//   }
//   tbl.appendChild(tbdy);
//   div.appendChild(tbl);
//   body.appendChild(div);
// };

// const clearPrevStartNodes = () => {
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       if (grid[x][y] === 3) {
//         grid[x][y] = 0;
//         document.getElementById(`${x}-${y}`).classList.remove('startNode');
//       }
//     }
//   }
// };

// const clearPrevEndNodes = () => {
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       if (grid[x][y] === 4) {
//         grid[x][y] = 0;
//         document.getElementById(`${x}-${y}`).classList.remove('endNode');
//       }
//     }
//   }
// };
// const unloadScrollBars = () => {
//   document.documentElement.style.overflow = 'hidden'; // firefox, chrome
//   document.body.scroll = 'no'; // ie only
// };

// tableCreate();

// const table = document.querySelector('table');

//setting up drawing walls
// table.addEventListener('mousedown', e => {
//   if (!search) {
//     let x = ~~(e.clientX / 30);
//     let y = ~~((e.clientY - 46) / 30);
//     let id = document.getElementById(`${x}-${y}`);
//     if (id.classList.contains('startNode')) {
//       movingStartNode = true;
//     } else if (id.classList.contains('endNode')) {
//       movingEndNode = true;
//     } else if (id.classList.contains('wall')) {
//       removingWalls = true;
//       grid[x][y] = 0;
//       id.classList.toggle('wall');
//     } else {
//       grid[x][y] = 1;
//       drawingWalls = true;
//       id.classList.toggle('wall');
//     }
//     prevX = x;
//     prevY = y;
//     clearPath();
//   }
// });

// table.addEventListener('mousemove', e => {
//   // if (!search) {
//   let x = ~~(e.clientX / 30);
//   let y = ~~((e.clientY - 46) / 30);
//   let id = document.getElementById(`${x}-${y}`);
//   if (prevX !== x || prevY !== y) {
//     if (drawingWalls && grid[x][y] === 0) {
//       id.classList.add('wall');
//       grid[x][y] = 1;
//     } else if (removingWalls && grid[x][y] === 1) {
//       id.classList.remove('wall');
//       grid[x][y] = 0;
//     } else if (movingStartNode && grid[x][y] === 0) {
//       clearPrevStartNodes();
//       grid[x][y] = 3;
//       id.classList.add('startNode');
//     } else if (movingEndNode && grid[x][y] == 0) {
//       clearPrevEndNodes();
//       grid[x][y] = 4;
//       id.classList.add('endNode');
//     }
//     prevX = x;
//     prevY = y;
//   }
// });

// window.addEventListener('mouseup', e => {
//   removingWalls = false;
//   drawingWalls = false;
//   movingStartNode = false;
//   movingEndNode = false;
// });

//generate random walls
// const generateRandomWalls = () => {
//   console.log('Generating Random Walls...');
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       let random = Math.random();
//       if (random < 0.1 && grid[x][y] === 0) {
//         setGridWall(x, y);
//         delayed(
//           1,
//           (function(y, x) {
//             return function() {
//               document.getElementById(`${x}-${y}`).classList.add('wall');
//             };
//           })(y, x)
//         );
//       }
//     }
//   }
// };

// //clear walls
// const clearWalls = () => {
//   console.log('Clearing Walls...');
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       if (grid[x][y] === 1) {
//         grid[x][y] = 0;
//         document.getElementById(`${x}-${y}`).classList.remove('wall');
//       }
//     }
//   }
// };

// //clear Path
// const clearPath = () => {
//   console.log('Clearing Path...');
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       if (grid[x][y] === -1) {
//         grid[x][y] = 0;
//       }
//       document.getElementById(`${x}-${y}`).classList.remove('path');
//       document.getElementById(`${x}-${y}`).classList.remove('visited');
//       document.getElementById(`${x}-${y}`).classList.add('unvisited');
//     }
//   }
// };

// const getEndNode = () => {
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       if (grid[x][y] === 4) {
//         return [x, y];
//       }
//     }
//   }
//   return false;
// };

// const getStartNode = () => {
//   for (let y = 0; y < numRows; y++) {
//     for (let x = 0; x < numCols; x++) {
//       if (grid[x][y] === 3) {
//         return [x, y];
//       }
//     }
//   }
//   return false;
// };

// export {
//   tableCreate,
//   unloadScrollBars,
//   clearPath,
//   getNumberRows,
//   getNumberCols,
//   clearWalls,
//   generateRandomWalls,
//   getEndNode,
//   getStartNode,
//   createGrid,
//   setGridVisited,
//   getGridValue
// };
