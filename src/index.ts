import {collision, config, canvas, ctx, mouse} from './utils/utils.js';
import {Resource} from "./classes/Resource.js";
import {FloatingMessage} from "./classes/FloatingMessage.js";
import {Enemy} from "./classes/Enemy.js";
import {enemies as allEnemies} from "./minions/enemies.js";
import {defenders as allDefenders} from "./minions/defenders.js";
import {Game} from "./classes/Game.js";

const game = new Game();
const activeTower: number = Math.floor(Math.random() * allDefenders.length);
let chooseTower: number;
let updateStats = false;

game.mouseDown();
game.mouseUp();

game.mouseMove();
game.mouseLeave();

const handleFloatingMessages = (): void => {
    for (let i = 0; i < config.floatingMessages.length; i++) {
        config.floatingMessages[i].draw();
        config.floatingMessages[i].update();
        if (config.floatingMessages[i].lifeSpan >= 50) {
            config.floatingMessages.splice(i, 1);
            i--;
        }
    }
}

const lastMovePoint: Date = new Date();
const handleBullets = () => {
    for (let i = 0; i < config.bullets.length; i++) {
        config.bullets[i].draw();
        config.bullets[i].update(lastMovePoint);
        if (config.bullets[i].checkCollision()) {
            config.bullets.splice(i, 1);
            i--;
        }

    }
}
const handleEnemies = (): void =>  {
    for (let i = 0; i < config.enemies.length; i++) {
        config.enemies[i].draw();
        config.enemies[i].update();
        switch (true) {
            case config.enemies[i].x === 230 + config.enemies[i].randomNumber && config.enemies[i].y > 50 + config.enemies[i].randomNumber:
                config.enemies[i].actualDirection = config.enemies[i].enemyDirection.up
                config.enemies[i].y -= config.enemies[i].speed;
                break;
            case config.enemies[i].y === 50 + config.enemies[i].randomNumber && config.enemies[i].x < 900:
                config.enemies[i].x += config.enemies[i].speed;
                config.enemies[i].actualDirection = config.enemies[i].enemyDirection.right;
                break;
            case config.enemies[i].x === 900 && config.enemies[i].y < 290:
                config.enemies[i].y += config.enemies[i].speed;
                config.enemies[i].actualDirection = config.enemies[i].enemyDirection.down;
                break;
            case config.enemies[i].y === 290 && config.enemies[i].x > 660:
                config.enemies[i].x -= config.enemies[i].speed;
                config.enemies[i].actualDirection = config.enemies[i].enemyDirection.left;
                break;
            case config.enemies[i].x === 660 && config.enemies[i].y < 580:
                config.enemies[i].y += config.enemies[i].speed;
                config.enemies[i].actualDirection = config.enemies[i].enemyDirection.down;
                break;
            case config.enemies[i].y === 580 && config.enemies[i].x > 600 && config.enemies[i].x < canvas.width - 80:
                config.enemies[i].x += config.enemies[i].speed;
                config.enemies[i].actualDirection = config.enemies[i].enemyDirection.right;
                break;
        }
        if (config.enemies[i].x === canvas.width - 80) {
            config.totalHP--;
            config.enemies[i].health--;
        }
        if (config.enemies[i].x < 0 || config.totalHP === 0) {
            config.gameOver = true;
        }
        if (config.enemies[i].health <= 0) {
            const gainedResources: number = config.enemies[i].maxHealth/10;
            config.floatingMessages.push(new FloatingMessage('+' + gainedResources, config.enemies[i].x, config.enemies[i].y, 30, 'black'));
            config.floatingMessages.push(new FloatingMessage('+' + gainedResources, 250, 50, 30, 'gold'));
            updateStats = true;
            config.numberOfResources += gainedResources;
            config.score += gainedResources;
            const findThisIndex: number = config.enemiesPositions.indexOf(config.enemies[i].y);
            config.enemiesPositions.splice(findThisIndex, 1);
            config.enemies.splice(i, 1);
            i--;
        }
    }
    if (config.frame % config.enemiesInterval === 0 && config.score < config.winningScore && config.enemies.length < 10) {
        const verticalPosition: number = Math.floor(Math.random() * 5 + 1) * config.cellSize + config.cellGap;
        const randomArray = Math.floor(Math.random() * allEnemies.length);
        config.enemies.push(new Enemy(230, 750,
            allEnemies[randomArray].type,
            allEnemies[randomArray].name,
            allEnemies[randomArray].health,
            allEnemies[randomArray].speed,
            allEnemies[randomArray].imagePositions
        ));
        config.enemiesPositions.push(verticalPosition);
    }
}

const handleDefenders = (): void => {
    for (let i = 0; i < config.defenders.length; i++) {
        config.defenders[i].draw();
        config.defenders[i].update();
        config.defenders[i].findTarget();
        config.defenders[i].findUnitCoords();
        config.defenders[i].fire(lastMovePoint);
    }
}

const handleResources = (): void => {
    if (config.frame % 500 === 0 && config.score < config.winningScore) {
        config.resources.push(new Resource());
    }
    for (let i = 0; i < config.resources.length; i++) {
        config.resources[i].draw();
        config.resources[i].update();
        if (config.resources[i] && mouse.x && mouse.y && collision(config.resources[i], mouse)) {
            updateStats = true;
            config.numberOfResources += config.resources[i].amount;
            config.floatingMessages.push(new FloatingMessage('+' + config.resources[i].amount, config.resources[i].x, config.resources[i].y, 30, 'black'));
            config.resources.splice(i, 1);
            i--;
        } else if (config.resources[i].y > canvas.height) {
            config.floatingMessages.push(new FloatingMessage('Lost: ' + config.resources[i].amount, 250, 50, 30, 'gold'));
            config.resources.splice(i, 1);
            i--;
        }
    }
}

function handleGameStatus(): void {
        if (config.gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '60px Gope';
        ctx.fillText('Game Over', 135, 530);
    }
    if (config.score >= config.winningScore && config.enemies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.fonnt = '60px Gope';
        ctx.fillText('Level completed', 130, 530);
        ctx.font = '30px Gope';
        ctx.fillText('You win with: ' + config.score + ' points', 134, 570);
    }
}

const updateGameStatus = (): void => {
    document.getElementById('container__stats--resources')!.innerHTML = 'Resources: ' + config.numberOfResources;
    document.getElementById('container__stats--score')!.innerHTML = 'Score: ' + config.score;
    document.getElementById('container__stats--totalHP')!.innerHTML = 'Total HP: ' + config.totalHP;

    if (updateStats) {
        updateStats = false;
        document.getElementById('container__stats--resources')!.innerHTML = 'Resources: ' + config.numberOfResources;
    }
}

function drawMap(): void {
    const background: HTMLImageElement = new Image();
    background.src = './images/background.png';
    ctx.drawImage(background, 0, 0);
    requestAnimationFrame(drawMap);
}
drawMap();

function animate(): void {
    handleDefenders();
    handleEnemies();
    handleBullets();
    handleGameStatus();
    handleFloatingMessages();
    handleResources();
    updateGameStatus();
    if (chooseTower) {
        game.rangeArea();
    }
    config.frame++;
    if (!config.gameOver) requestAnimationFrame(animate);
}

window.onload = () => {
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', (event: MouseEvent) => {
    updateStats = true;
    game.addTower(event, activeTower);
}, false);


game.resizeCanvasOnBrowserResize();