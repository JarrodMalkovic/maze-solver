import { board } from '../main.js';

const delayed = (function() {
  let queue = [];

  function processQueue() {
    if (queue.length > 0) {
      setTimeout(function() {
        queue.shift().cb();
        processQueue();
      }, queue[0].delay);
    }
  }

  return function delayed(delay, cb) {
    queue.push({ delay: delay, cb: cb });

    if (queue.length === 1) {
      processQueue();
    }
  };
})();

const drawOperations = (operations, operationCount, delay = 10) => {
  let nodeClass;
  delay === 0 ? (nodeClass = 'visited-no-animation') : (nodeClass = 'visited');
  setTimeout(function() {
    for (let i = 0; i < operations.length; i++) {
      let node = document.getElementById(
        `${operations[i][0]}-${operations[i][1]}`
      );
      if (node) {
        node.classList.add(nodeClass);
      }
    }
  }, operationCount * delay);
};

const drawPath = function(path, c) {
  let newPath = path.slice(1, path.length - 1);
  console.log('Drawing Path...');
  newPath.forEach(function(node, index) {
    setTimeout(function() {
      document.getElementById(`${node[0]}-${node[1]}`).classList.add('path');
      if (index === newPath.length - 1) {
        board.setSearchingFalse();
      }
    }, c * 10 + 45 * index);
  });

  console.log('Done!');
};

export { delayed, drawOperations, drawPath };
