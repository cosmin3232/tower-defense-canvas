import { config, canvas, ctx, mouse } from './utils/utils.js';
import { Defender } from "./classes/Defender.js";
// import {Resource} from "./classes/Resource.js";
import { FloatingMessage } from "./classes/FloatingMessage.js";
import { Enemy } from "./classes/Enemy.js";
import { enemies as allEnemies } from "./minions/enemies.js";
import { defenders as allDefenders } from "./minions/defenders.js";
import { Game } from "./classes/Game.js";
const cellSize = config.cellSize;
const cellGap = config.cellGap;
const winningScore = config.winningScore;
const defenders = config.defenders;
const enemies = config.enemies;
const enemiesPositions = config.enemiesPositions;
// const resources: Array<Resource> = config.resources;
let enemiesInterval = config.enemiesInterval;
let numberOfResources = config.numberOfResources;
let score = config.score;
let gameOver = config.gameOver;
const game = new Game();
const controlsBar = {
    width: canvas.width,
    height: 100,
};
game.mouseDown();
game.mouseUp();
game.mouseMove();
game.mouseLeave();
const floatingMessages = config.floatingMessages;
function handleFloatingMessages() {
    for (let i = 0; i < floatingMessages.length; i++) {
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i].lifeSpan >= 50) {
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}
function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        enemies[i].update();
        switch (true) {
            case enemies[i].x === 260 && enemies[i].y > 150:
                enemies[i].actualDirection = enemies[i].enemyDirection.up;
                enemies[i].y -= enemies[i].speed;
                break;
            case enemies[i].y === 150 && enemies[i].x < 900:
                enemies[i].x += enemies[i].speed;
                enemies[i].actualDirection = enemies[i].enemyDirection.right;
                break;
            case enemies[i].x === 900 && enemies[i].y < 390:
                enemies[i].y += enemies[i].speed;
                enemies[i].actualDirection = enemies[i].enemyDirection.down;
                break;
            case enemies[i].y === 390 && enemies[i].x > 660:
                enemies[i].x -= enemies[i].speed;
                enemies[i].actualDirection = enemies[i].enemyDirection.left;
                break;
            case enemies[i].x === 660 && enemies[i].y < 680:
                enemies[i].y += enemies[i].speed;
                enemies[i].actualDirection = enemies[i].enemyDirection.down;
                break;
            case enemies[i].y === 680 && enemies[i].x > 600 && enemies[i].x < canvas.width - 80:
                enemies[i].x += enemies[i].speed;
                enemies[i].actualDirection = enemies[i].enemyDirection.right;
                break;
        }
        if (enemies[i].x === canvas.width - 80) {
            config.totalHP--;
            enemies[i].health--;
        }
        if (enemies[i].x < 0 || config.totalHP === 0) {
            gameOver = true;
        }
        if (enemies[i].health <= 0) {
            const gainedResources = enemies[i].maxHealth / 10;
            floatingMessages.push(new FloatingMessage('+' + gainedResources, enemies[i].x, enemies[i].y, 30, 'black'));
            floatingMessages.push(new FloatingMessage('+' + gainedResources, 250, 50, 30, 'gold'));
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemiesPositions.indexOf(enemies[i].y);
            enemiesPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if (config.frame % enemiesInterval === 0 && score < winningScore && enemies.length < 10) {
        const verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        const randomArray = Math.floor(Math.random() * allEnemies.length);
        enemies.push(new Enemy(260, 750, allEnemies[randomArray].type, allEnemies[randomArray].name, allEnemies[randomArray].health, allEnemies[randomArray].speed, allEnemies[randomArray].imagePositions));
        enemiesPositions.push(verticalPosition);
        if (enemiesInterval > 120)
            enemiesInterval -= 50;
    }
}
function handleDefenders() {
    for (let i = 0; i < defenders.length; i++) {
        const towerRange = defenders[i].range;
        defenders[i].draw();
        for (let j = 0; j < enemies.length; j++) {
            const distance = Math.abs(enemies[j].x - (defenders[i].x || 0)) + Math.abs(enemies[j].y - (defenders[i].y || 0));
            if (distance < towerRange) {
                defenders[i].shoot(enemies[j]);
                break;
            }
        }
    }
}
// function handleResources(): void {
//     if (config.frame % 500 === 0 && score < winningScore) {
//         resources.push(new Resource());
//     }
//     for (let i = 0; i < resources.length; i++) {
//         resources[i].draw();
//         if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
//             numberOfResources += resources[i].amount;
//             floatingMessages.push(new FloatingMessage('+' + resources[i].amount, resources[i].x, resources[i].y, 30, 'black'));
//             floatingMessages.push(new FloatingMessage('+' + resources[i].amount, 250, 50, 30, 'gold'));
//             resources.splice(i, 1);
//             i--;
//         }
//     }
// }
canvas.addEventListener('mousedown', function () {
    const mouseX = mouse.x || 0;
    const mouseY = mouse.y || 0;
    const gridPositionX = mouseX - (mouseX % cellSize);
    const gridPositionY = mouseY - (mouseY % cellSize);
    if (gridPositionY < cellSize)
        return;
    for (let i = 0; i < defenders.length; i++) {
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) {
            return;
        }
    }
    const defenderCost = 100;
    const randomArray = Math.floor(Math.random() * allDefenders.length);
    if (numberOfResources >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY, randomArray));
        console.log(defenders);
        numberOfResources -= defenderCost;
    }
    else {
        if (mouse.x != null && mouse.y != null) {
            floatingMessages.push(new FloatingMessage('need more resources', mouse.x, mouse.y, 15, 'blue'));
        }
    }
});
function drawMap() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    const background = new Image();
    background.src = './images/background.png';
    ctx.drawImage(background, 0, controlsBar.height);
    requestAnimationFrame(drawMap);
}
drawMap();
function animate() {
    // handleResources();
    handleEnemies();
    handleDefenders();
    game.handleGameStatus();
    handleFloatingMessages();
    config.frame++;
    if (!gameOver)
        requestAnimationFrame(animate);
}
animate();
game.resizeCanvasOnBrowserResize();
//# sourceMappingURL=index.js.map