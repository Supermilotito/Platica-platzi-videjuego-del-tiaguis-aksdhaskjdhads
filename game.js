// Variables globales
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timeInterval;

const playerPosition = { x: undefined, y: undefined };
const giftPosition = { x: undefined, y: undefined };
let enemyPositions = [];

// Event Listeners
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

// Helper Functions
function fixNumber(n) {
  return Number(n.toFixed(2));
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvasSize = Math.floor(canvasSize);
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  elementsSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART']);
  spanLives.innerHTML = '';
  heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

// Game Functions
function startGame() {
  console.log({ canvasSize, elementsSize });
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  const map = maps[level];
  if (!map) {
    gameWin();
    return;
  }
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  console.log({ map, mapRows, mapRowCols });
  showLives();
  enemyPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize);
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);
      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({ x: posX, y: posY });
      }
      game.fillText(emoji, posX, posY);
    });
  });
  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  if (giftCollision) {
    levelWin();
    return;
  }
  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });
  if (enemyCollision) {
    levelFail();
    return;
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log('Como escapaste?? Solo es suerte...');
  level++;
  startGame();
}

function levelFail() {
  console.log('Ohio tiene enemigos...');
  lives--;
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log('¡Terminaste el juego!');
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'Escapaste más rapido de ohio, COMO??!?!?!';
    } else {
      pResult.innerHTML = 'Te dije, Imposible escapar.';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'ESCAPASTE?? ESO ES SOLO SUERTE!! SUPERAME EN LA SIGUIENTE PARTIDA >:D)';
  }
  console.log({ recordTime, playerTime });
}

// Movement Functions
function moveByKeys(event) {
  switch (event.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      break;
  }
}

function moveUp() {
  console.log('bro quiere moverse para arriba 💀');
  if (playerPosition.y - elementsSize < elementsSize) {
    console.log('ESTAS INTENTANDO SALIR DE OHIO??');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}

function moveLeft() {
  console.log('bro quiere moverse a la izquierda 💀');
  if (playerPosition.x - elementsSize < elementsSize) {
    console.log('ESTAS INTENTANDO SALIR DE OHIO??');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  console.log('bro quiere moverse a la derecha 💀');
  if (playerPosition.x + elementsSize > canvasSize) {
    console.log('ESTAS INTENTANDO SALIR DE OHIO??');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}

function moveDown() {
  console.log('bro quiere moverse para abajo 💀');
  if (playerPosition.y + elementsSize > canvasSize) {
    console.log('ESTAS INTENTANDO SALIR DE OHIO??');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}
