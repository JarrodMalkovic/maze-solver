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
      console.log(path);
      let constructedPath = constructPath(path[0], path[1]);
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
  let closedSet = new Set();
  let cameFrom = {};
  let fScore = {};
  let gScore = {};
  let operationCount = 0;

  openSet.add(start);
  gScore[start] = 0;
  fScore[start] = getHCost(start, end);

  while (openSet.size > 0) {
    let current = lowestFCost(Array.from(openSet), start, end, fScore);

    openSet.delete(current);
    closedSet.add(current);

    const neighbours = [
      [current[0] - 1, current[1]],
      [current[0], current[1] - 1],
      [current[0] + 1, current[1]],
      [current[0], current[1] + 1],
    ];

    for (let i = 0; i < neighbours.length; i++) {
      if (neighbours[i][0] == end[0] && neighbours[i][1] == end[1]) {
        cameFrom[neighbours[i]] = current.toString();
        return [cameFrom, neighbours[i], operationCount];
      }

      if (
        neighbours[i][0] < 0 ||
        neighbours[i][0] >= board.numberCols() ||
        neighbours[i][1] < 0 ||
        neighbours[i][1] >= board.numberRows() ||
        board.GridValue(neighbours[i]) !== 0 ||
        closedSet.has(neighbours[i])
      ) {
        continue;
      }

      board.GridVisited(neighbours[i]);
      operationCount++;

      let tentative_gScore = gScore[current] || getGCost(current, start);
      tentative_gScore += 10;

      if (
        tentative_gScore < gScore[neighbours[i]] ||
        tentative_gScore < getGCost(neighbours[i], start) ||
        !openSet.has(neighbours[i])
      ) {
        cameFrom[neighbours[i]] = current.toString();
        gScore[neighbours[i]] = tentative_gScore;
        fScore[neighbours[i]] = tentative_gScore + getHCost(neighbours[i], end);
        if (!openSet.has(neighbours[i])) {
          openSet.add(neighbours[i]);
        }
      }
      drawOperations([neighbours[i]], operationCount, delay);
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
    } else if (getFCost(node, start, end) < lowestCost) {
      currentMin = node;
      lowestCost = getFCost(node, start, end);
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

// GCost is the distance between the current node and the start node
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
