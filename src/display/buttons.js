import { board } from '../index.js';
import { aStar } from '../pathfinding/aStar.js';
import { BFS } from '../pathfinding/BFS.js';
import { DFS } from '../pathfinding/DFS.js';
import { bidirectional } from '../pathfinding/bidirectional.js';
import { showNotification } from '../utils/notifications.js';

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
    clearWallsButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (!board.getSearching()) {
                board.clearPath();
                board.clearWalls();
            }
        });
    });

    dropdownButton.addEventListener('click', (e) => {
        let dropdownButtons = dropdownContent.getElementsByTagName('*');
        for (let i = 0; i < dropdownButtons.length; ++i) {
            e = dropdownButtons[i];
            e.classList.toggle('showContent');
        }
    });

    menuButton.addEventListener('click', (e) => {
        const navbar = document.querySelector('.navigation');
        if (navbar.className === 'navigation') {
            navbar.className += ' responsive';
        } else {
            navbar.className = 'navigation';
        }
    });

    clearPathButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (!board.getSearching()) {
                board.clearPath();
            }
        });
    });

    generateWallsButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (!board.getSearching()) {
                board.clearPath();
                board.clearWalls();
                board.generateRandomWalls();
            }
        });
    });

    dropdownSelector.addEventListener('click', (e) => {
        algorithm = e.target.id;
        visualizeButtons.forEach((button) => {
            button.innerHTML = `Visualize ${algorithm}`;
        });
    });

    visualizeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
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
                    case 'Bidirectional Search':
                        bidirectional();
                        break;
                    default:
                        showNotification(true, 'You must first select an algorithm!');
                }
            }
        });
    });
};

export { setUpButtons };
