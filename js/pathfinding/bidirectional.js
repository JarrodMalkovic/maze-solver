import { board } from '../main.js';
import { drawOperations, drawPath } from '../utils/utils.js';
import { showNotification } from '../utils/notifications.js';

const bidirectional = (grid, delay = 10) => {
  board.clearPath();
  board.setSearchingTrue();

  const startNode = board.getStartNode();
  const endNode = board.getEndNode();

  if (!startNode || !endNode) {
    showNotification(true, 'You must first declare a start and end node');
  } else {
    const path = findPath(startNode, endNode, delay);
    if (Object.keys(path[0]).length > 0) {
      const startConstructedPath = constructPath(path[1], path[0]);
      const endConstructedPath = constructPath(path[2], path[0]);
      startConstructedPath.push(path[0].split('-'));

      const totalPath = startConstructedPath.concat(
        endConstructedPath.reverse()
      );

      drawPath(totalPath, path[3]);
    } else {
      setTimeout(function () {
        board.setSearchingFalse();
        showNotification(true, 'No path found');
      }, path[2] * delay);
    }
  }
};

const findPath = (start, end, delay) => {
  const startQueue = [[start]];
  const startNodeSet = new Set();
  const endQueue = [[end]];
  const endNodeSet = new Set();
  const startCameFrom = {};
  const endCameFrom = {};

  let endOperationCount = 0;
  let startOperationCount = 0;

  while (startQueue.length && endQueue.length) {
    const startNodePath = startQueue.shift();
    const startNodeFrontier = startNodePath[startNodePath.length - 1];

    const endNodePath = endQueue.shift();
    const endNodeFrontier = endNodePath[endNodePath.length - 1];

    startNodeSet.add(startNodeFrontier.join('-'));
    endNodeSet.add(endNodeFrontier.join('-'));

    if (
      endNodeSet.has(startNodeFrontier.join('-')) ||
      startNodeFrontier.join('-') === end.join('-')
    ) {
      return [
        startNodeFrontier.join('-'),
        startCameFrom,
        endCameFrom,
        Math.max(endOperationCount, startOperationCount),
      ];
    } else if (
      startNodeSet.has(endNodeFrontier.join('-')) ||
      endNodeFrontier.join('-') === start.join('-')
    ) {
      return [
        endNodeFrontier.join('-'),
        startCameFrom,
        endCameFrom,
        Math.max(endOperationCount, startOperationCount),
      ];
    }

    startOperationCount += BFS(
      startNodeFrontier,
      startQueue,
      startNodeSet,
      startNodePath,
      startCameFrom,
      startOperationCount
    );

    endOperationCount += BFS(
      endNodeFrontier,
      endQueue,
      endNodeSet,
      endNodePath,
      endCameFrom,
      endOperationCount
    );
  }

  return [{}, null, Math.max(endOperationCount, startOperationCount)];
};

const BFS = (node, queue, visitedSet, path, cameFrom, operationCount) => {
  const neighbours = getNeighbours(node);
  let operations = [];
  let count = 0;

  for (let neighbour of neighbours) {
    const idString = neighbour.join('-');
    if (!visitedSet.has(idString)) {
      visitedSet.add(idString);
      operations.push(neighbour);
      queue.push(path.concat([neighbour]));
      cameFrom[idString] = node.join('-');
      count++;
    }
  }

  drawOperations(operations, operationCount + count);
  return count;
};

const getNeighbours = (node) => {
  const neighbours = [];

  const directions = [
    [node[0] + 1, node[1]],
    [node[0], node[1] + 1],
    [node[0] - 1, node[1]],
    [node[0], node[1] - 1],
  ];

  for (let i = 0; i < directions.length; i++) {
    if (
      !(
        directions[i][0] < 0 ||
        directions[i][0] >= board.numberCols() ||
        directions[i][1] < 0 ||
        directions[i][1] >= board.numberRows() ||
        board.GridValue([directions[i][0], directions[i][1]]) !== 0
      )
    ) {
      neighbours.push(directions[i]);
    }
  }

  return neighbours;
};

const constructPath = (cameFrom, finalNode) => {
  let path = [];
  while (finalNode) {
    path.push(finalNode.toString().split('-'));
    finalNode = cameFrom[finalNode.toString()];
  }
  return path.reverse();
};

export { bidirectional };
