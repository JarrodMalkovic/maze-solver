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
