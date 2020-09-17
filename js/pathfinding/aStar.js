import { board } from '../main.js';
import { drawOperations, drawPath } from '../utils/utils.js';
import { showNotification } from '../utils/notifications.js';

const aStar = (grid, delay = 10) => {
  board.clearPath();
  board.setSearchingTrue();

  const startNode = board.getStartNode();
  const endNode = board.getEndNode();

  if (!startNode || !endNode) {
    showNotification(true, 'You must first declare a start and end node');
  } else {
    const path = findPath(startNode, endNode, delay);
    if (Object.keys(path[0]).length > 0) {
      let constructedPath = constructPath(path[0], path[1]);
      console.log(constructedPath.length);
      drawPath(constructedPath, path[2]);
    } else {
      setTimeout(function () {
        board.setSearchingFalse();
        showNotification(true, 'No path found');
      }, path[2] * delay);
    }
  }
};

const constructPath = (cameFrom, finalNode) => {
  let path = [];
  while (finalNode) {
    path.push(finalNode.toString().split(','));
    finalNode = cameFrom[finalNode.toString()];
  }
  return path.reverse();
};

const findPath = (start, end, delay) => {
  let openSet = new Set();
  let cameFrom = {};
  let fScore = {};
  let gScore = {};
  let operationCount = 0;

  for (let row = 0; row < board.numberCols(); row++) {
    for (let col = 0; col < board.numberRows(); col++) {
      gScore[row + ',' + col] = Infinity;
      fScore[row + ',' + col] = Infinity;
    }
  }

  gScore[start] = 0;
  fScore[start] = getHCost(start, end);

  openSet.add(start);

  while (openSet.size > 0) {
    let current = lowestFCost(Array.from(openSet), start, end, fScore);

    if (board.GridValue(current) === 0) {
      board.GridVisited(current);
    }

    openSet.delete(current);

    const neighbours = [
      [current[0] - 1, current[1]],
      [current[0], current[1] - 1],
      [current[0] + 1, current[1]],
      [current[0], current[1] + 1],
    ];

    for (let neighbour of neighbours) {
      if (neighbour[0] == end[0] && neighbour[1] == end[1]) {
        cameFrom[neighbour] = current.toString();
        return [cameFrom, neighbour, operationCount];
      }

      if (
        neighbour[0] < 0 ||
        neighbour[0] >= board.numberCols() ||
        neighbour[1] < 0 ||
        neighbour[1] >= board.numberRows() ||
        board.GridValue(neighbour) !== 0
      ) {
        continue;
      }

      operationCount++;

      let tentative_gScore = gScore[current] + 10;

      const neighboursGScore = gScore[neighbour];

      if (tentative_gScore < neighboursGScore) {
        cameFrom[neighbour] = current.toString();
        gScore[neighbour] = tentative_gScore;
        fScore[neighbour] = gScore[neighbour] + getHCost(neighbour, end);
        if (!openSet.has(neighbour)) {
          openSet.add(neighbour);
        }
      }

      drawOperations([neighbour], operationCount, delay);
    }
  }

  return [{}, null, operationCount];
};

const lowestFCost = (arr, start, end, fCostObj) => {
  let lowestCost = Infinity;
  let currentMin;

  arr.forEach((node) => {
    if (fCostObj[node] < lowestCost) {
      currentMin = node;
      lowestCost = fCostObj[node];
    }
  });

  return currentMin;
};

// FCost is the sum of both the HCost and GCost
const getFCost = (current, start, end) => {
  return getHCost(current, end) + getGCost(current, start);
};

// HCost is the estimated distance from the current node to the end node
const getHCost = (current, end) => {
  let dx = (current[0] - end[0]) * 10;
  let dy = (current[1] - end[1]) * 10;
  return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
};

// GCost is the distance between the current node and the start get
const getGCost = (current, start) => {
  let dx = (current[0] - start[0]) * 10;
  let dy = (current[1] - start[1]) * 10;
  return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
};

const getDistance = (current, neighbour) => {
  let dx = (current[0] - neighbour[0]) * 10;
  let dy = (current[1] - neighbour[1]) * 10;
  return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
};

export { aStar };
