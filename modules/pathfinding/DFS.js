import { board } from '../main.js';
import { drawOperations, drawPath } from '../utils/utils.js';
import { showNotification } from '../utils/notifications.js';

const DFS = () => {
  board.clearPath();
  board.setSearchingTrue();
  const startNode = board.getStartNode();
  const endNode = board.getEndNode();
  if (!startNode || !endNode) {
    showNotification(true, 'You must first declare a start and end node');
  } else {
    console.log('Searching...');
    const path = findPathDFS(startNode, endNode);
    if (path[0].length > 0) {
      drawPath(path[0], path[1]);
    } else {
      setTimeout(function() {
        board.setSearchingFalse();
        showNotification(true, 'No path found');
      }, path[1] * 10);
    }
  }
};

const findPathDFS = (startNode, endNode) => {
  let operationCount = 0;
  let stack = [];
  let path = [];
  stack.push(startNode);
  while (stack.length > 0) {
    path.push(stack.pop());
    let vertex = path[path.length - 1];
    let operations = [];
    operationCount++;
    operations.push([vertex[0], vertex[1]]);

    let neighbours = [
      [vertex[0] - 1, vertex[1]],
      [vertex[0], vertex[1] - 1],
      [vertex[0] + 1, vertex[1]],
      [vertex[0], vertex[1] + 1]
    ];

    for (let i = 0; i < neighbours.length; i++) {
      if (neighbours[i][0] === endNode[0] && neighbours[i][1] === endNode[1]) {
        drawOperations([vertex], operationCount);
        return [path.concat([endNode]), operationCount];
      }

      if (
        neighbours[i][0] < 0 ||
        neighbours[i][0] >= board.numberCols() ||
        neighbours[i][1] < 0 ||
        neighbours[i][1] >= board.numberRows() ||
        board.GridValue([neighbours[i][0], neighbours[i][1]]) !== 0
      ) {
        continue;
      }

      if (board.GridValue([vertex[0], vertex[1]]) === 0) {
        board.GridVisited([vertex[0], vertex[1]]);
      }

      stack.push(neighbours[i]);
    }
    drawOperations(operations, operationCount);
  }
  return [[], operationCount];
};

export { DFS };
