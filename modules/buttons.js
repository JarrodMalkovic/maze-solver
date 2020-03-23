import { board } from './main.js';
import { aStar } from './aStar.js';
import { BFS } from './BFS.js';
import { DFS } from './DFS.js';
import { showNotification } from './notifications.js';

//Setting up buttons
const clearWallsButtons = document.querySelectorAll('.clearWallsButton');
const clearPathButtons = document.querySelectorAll('.clearPathButton');
const generateWallsButtons = document.querySelectorAll('.generateWallsButton');
const dropdownSelector = document.querySelector('.dropdown-content');
const visualizeButtons = document.querySelectorAll('.visualizeButton');
const menuButton = document.querySelector('.icon');
const dropdownButton = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');

let algorithm = '';

const setUpButtons = () => {
  clearWallsButtons.forEach(button => {
    button.addEventListener('click', e => {
      if (!board.getSearching()) {
        board.clearPath();
        board.clearWalls();
      }
    });
  });

  dropdownButton.addEventListener(
    'click',
    e => {
      console.log('clicked');
      console.log(dropdownContent);
      let dropdownButtons = dropdownContent.getElementsByTagName('*');
      console.log(dropdownButtons);
      for (let i = 0; i < dropdownButtons.length; ++i) {
        e = dropdownButtons[i];
        e.classList.toggle('showContent');
      }
    }
    // for (let i = 0; i < e.length; i++) {
    //   console.log('xd');
    //   dropdownButton[i].addEventListener('click', function() {
    //     this.classList.toggle('active');
    //     var dropdownContent = this.nextElementSibling;
    //     if (dropdownContent.style.display === 'block') {
    //       dropdownContent.style.display = 'none';
    //     } else {
    //       dropdownContent.style.display = 'block';
    //     }
    //   });
    // }
  );

  menuButton.addEventListener('click', e => {
    console.log('Click!');
    const navbar = document.querySelector('.navigation');
    if (navbar.className === 'navigation') {
      console.log('adding respo');
      navbar.className += ' responsive';
    } else {
      navbar.className = 'navigation';
    }
  });

  clearPathButtons.forEach(button => {
    button.addEventListener('click', e => {
      if (!board.getSearching()) {
        board.clearPath();
      }
    });
  });

  generateWallsButtons.forEach(button => {
    button.addEventListener('click', e => {
      if (!board.getSearching()) {
        board.clearPath();
        board.clearWalls();
        board.generateRandomWalls();
      }
    });
  });

  dropdownSelector.addEventListener('click', e => {
    algorithm = e.target.id;
    visualizeButtons.forEach(button => {
      button.innerHTML = `Visualize ${algorithm}`;
    });
  });

  visualizeButtons.forEach(button => {
    button.addEventListener('click', e => {
      if (!board.getSearching()) {
        switch (algorithm) {
          case 'BFS':
            BFS();
            break;
          case 'A*':
            aStar();
            break;
          case 'DFS':
            DFS();
            break;
          default:
            showNotification(true, 'You must first select an algorithm!');
        }
      }
    });
  });
};

export { setUpButtons };

// import { search } from './main.js';
// import { clearPath, generateRandomWalls, clearWalls } from './board.js';
// import { aStar } from './aStar.js';
// import { BFS } from './BFS.js';
// import { DFS } from './DFS.js';
// import { showNotification } from './notifications.js';

// //setting up buttons
// const clearWallsButtons = document.querySelectorAll('.clearWallsButton');
// const clearPathButtons = document.querySelectorAll('.clearPathButton');
// const generateWallsButtons = document.querySelectorAll('.generateWallsButton');
// const dropdownSelector = document.querySelector('.dropdown-content');
// const visualizeButtons = document.querySelectorAll('.visualizeButton');

// let algorithm = '';

// const setUpButtons = () => {
//   clearWallsButtons.forEach(button => {
//     button.addEventListener('click', e => {
//       if (!search) {
//         clearPath();
//         clearWalls();
//       }
//     });
//   });

//   clearPathButtons.forEach(button => {
//     button.addEventListener('click', e => {
//       if (!search) {
//         clearPath();
//       }
//     });
//   });

//   generateWallsButtons.forEach(button => {
//     button.addEventListener('click', e => {
//       clearPath();
//       clearWalls();
//       generateRandomWalls();
//       setTimeout(function() {}, 2000);
//     });
//   });

//   dropdownSelector.addEventListener('click', e => {
//     algorithm = e.target.id;
//     visualizeButtons.forEach(button => {
//       button.innerHTML = `Visualize ${algorithm}`;
//     });
//   });

//   visualizeButtons.forEach(button => {
//     button.addEventListener('click', e => {
//       if (!search) {
//         switch (algorithm) {
//           case 'BFS':
//             BFS();
//             break;
//           case 'A*':
//             aStar();
//             break;
//           case 'DFS':
//             DFS();
//             break;
//           default:
//             showNotification(true, 'You must first select an algorithm!');
//         }
//       }
//     });
//   });
// };

// export { setUpButtons };
