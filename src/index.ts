import {UnitCardModel} from "./models/unit-card.model.js";
import {collision, config, canvas, ctx, mouse} from './utils/utils.js';
import {Defender} from "./classes/Defender.js";
import {Cell} from "./classes/Cell.js";
import {Resource} from "./classes/Resource.js";
import {FloatingMessage} from "./classes/FloatingMessage.js";
import {Enemy} from "./classes/Enemy.js";
import {Projectile} from "./classes/Projectile";
import {enemies as allEnemies} from "./minions/enemies.js";

const cellSize: number = config.cellSize;
const cellGap: number = config.cellGap;
const winningScore: number = config.winningScore;
const gameGrid: Array<Cell> = config.gameGrid;
const defenders: Array<Defender> = config.defenders;
const enemies: Array<Enemy> = config.enemies;
const enemiesPositions: Array<number> = config.enemiesPositions;
const projectiles: Array<Projectile> = config.projectiles;
const resources: Array<Resource> = config.resources;
let enemiesInterval: number = config.enemiesInterval;
let numberOfResources: number = config.numberOfResources;
let score: number = config.score;
let gameOver: boolean = config.gameOver;
let chosenDefender: number = config.chosenDefender;
const cellClass: Cell = new Cell(canvas.width, canvas.height);

const controlsBar = {
    width: canvas.width,
    height: 100,
}

canvas.addEventListener('mousedown', function() {
    mouse.clicked = true;
});

canvas.addEventListener('mouseup', function() {
    mouse.clicked = false;
});

let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e: MouseEvent) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

function handleGameGrid(): void {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}

function handleProjectiles(): void {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}

const defender1: HTMLImageElement = new Image();
defender1.src = './images/vikingi.png';
config.defenderTypes.push(defender1);

const defender2: HTMLImageElement = new Image();
defender2.src = './images/vikingi2.jpg';
config.defenderTypes.push(defender2);


function handleDefenders(): void {
    for (let i = 0; i < defenders.length; i++) {

        defenders[i].draw();
        defenders[i].update();

        defenders[i].shooting = enemiesPositions.indexOf(defenders[i].y) !== -1;

        for (let j = 0; j < enemies.length; j++) {
            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}

const card1: UnitCardModel = {
    x: 10,
    y: 10,
    width: 194/2,
    height: 194/2,
}
const card2: UnitCardModel = {
    x: 120,
    y: 10,
    width: 194/2,
    height: 194/2,
}


function chooseDefender(): void {
    let card1Stroke: string;
    let card2Stroke: string;

    if (collision(mouse, card1) && mouse.clicked) {
        chosenDefender = 1;
    } else if (collision(mouse, card2) && mouse.clicked) {
        chosenDefender = 2;
    }

    if (chosenDefender === 1) {
        card1Stroke = 'gold';
        card2Stroke = 'black';
    } else if (chosenDefender === 2) {
        card1Stroke = 'black';
        card2Stroke = 'gold';
    } else {
        card1Stroke = 'black';
        card2Stroke = 'black';
    }

    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1Stroke;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(defender1, 0, 0, 300, 240, card1.x, card1.y, card1.width, card1.height);
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
    ctx.strokeStyle = card2Stroke;
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
    ctx.drawImage(defender2, 0, 0, 300, 240, card2.x, card2.y, card2.width, card2.height);

}

const floatingMessages: Array<FloatingMessage> = config.floatingMessages;

function handleFloatingMessages(): void {
    for (let i = 0; i < floatingMessages.length; i++) {
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i].lifeSpan >= 50) {
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}

function handleEnemies(): void {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        enemies[i].update();
        switch (true) {
            case enemies[i].x === 260 && enemies[i].y > 150:
                enemies[i].actualDirection = enemies[i].enemyDirection.up
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
            const gainedResources: number = enemies[i].maxHealth/10;
            floatingMessages.push(new FloatingMessage('+' + gainedResources, enemies[i].x, enemies[i].y, 30, 'black'));
            floatingMessages.push(new FloatingMessage('+' + gainedResources, 250, 50, 30, 'gold'));
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex: number = enemiesPositions.indexOf(enemies[i].y);
            enemiesPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if (config.frame % enemiesInterval === 0 && score < winningScore && enemies.length < 5) {
        const verticalPosition: number = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        const randomArray = Math.floor(Math.random() * allEnemies.length);
        enemies.push(new Enemy(
            allEnemies[randomArray].type,
            allEnemies[randomArray].name,
            allEnemies[randomArray].health,
            allEnemies[randomArray].speed,
            allEnemies[randomArray].imagePositions
        ));
        enemiesPositions.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -= 50;
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

function handleGameStatus(): void {
    ctx.fillStyle = 'red';
    ctx.font = '30px Gope';
    ctx.fillText(`Score: ${numberOfResources}   Resources: ${numberOfResources}   Total HP: ${config.totalHP}`, 230, 60);
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '60px Gope';
        ctx.fillText('Game Over', 135, 530);
    }
    if (score >= winningScore && enemies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.fonnt = '60px Gope';
        ctx.fillText('Level completed', 130, 530);
        ctx.font = '30px Gope';
        ctx.fillText('You win with: ' + score + ' points', 134, 570);
    }
}

canvas.addEventListener('click', function () {
    // @ts-ignore
    const gridPositionX: number = mouse.x - (mouse.x % cellSize) + cellGap;
    // @ts-ignore
    const gridPositionY: number = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i = 0;  i < defenders.length; i++) {
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) {
            return;
        }
    }
    const defenderCost = 100;
    if (numberOfResources >= defenderCost && cellClass.get(1, 3) !== 1) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    } else {
        if (mouse.x != null && mouse.y != null) {
            floatingMessages.push(new FloatingMessage('need more resources', mouse.x, mouse.y, 15, 'blue'));
        }
    }
});

function drawMap(): void {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
    const background: HTMLImageElement = new Image();
    background.src = './images/background.png';
    ctx.drawImage(background, 0, controlsBar.height);
    requestAnimationFrame(drawMap);
}
drawMap();

function animate(): void {
    handleGameGrid();
    handleDefenders();
    // handleResources();
    handleProjectiles();
    handleEnemies();
    handleGameStatus();
    handleFloatingMessages();
    chooseDefender();
    config.frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function createGrid(): void {
    // for (let y = cellSize; y < canvas.height; y += cellSize) {
    //     for (let x = 0; x < canvas.width; x += cellSize) {
    //         gameGrid.push(new Cell(x, y, canvas.width, canvas.height));
    //     }
    // }
    // cellClass.draw();
    // const vvv = cellClass.set(2, 12, 1);
    // console.log(vvv);
    // const testThing: number = cellClass.get(1, 3);
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x+=cellSize) {
        for (let y = 0; y <= canvas.height; y+=cellSize) {
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.fillText(`${x} si ${y}`, x, y);
        }
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.beginPath();
    for (let y = 0; y <= canvas.height; y+=cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.strokeStyle = 'rgb(20,20,20)';
    ctx.lineWidth = 1;
    ctx.stroke();
    requestAnimationFrame(createGrid);
}
createGrid();

window.addEventListener('resize', function() {
    canvasPosition = canvas.getBoundingClientRect();
});