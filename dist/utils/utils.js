export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 820;
export const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked: false,
};
export const config = {
    totalHP: 1000,
    cellSize: 200,
    cellGap: 3,
    winningScore: 50,
    gameGrid: [],
    defenders: [],
    enemies: [],
    enemiesPositions: [],
    projectiles: [],
    resources: [],
    enemiesInterval: 600,
    numberOfResources: 300,
    frame: 0,
    score: 0,
    gameOver: false,
    chosenDefender: 1,
    amounts: [Math.floor(Math.random() * 100) + 1],
    floatingMessages: [],
    defenderTypes: [],
};
export function collision(first, second) {
    if (!(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.width ||
        first.y + first.height < second.y)) {
        return true;
    }
}
//# sourceMappingURL=utils.js.map