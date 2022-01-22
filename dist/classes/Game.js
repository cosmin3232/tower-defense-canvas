import { canvas, config, ctx, mouse } from "../utils/utils.js";
export class Game {
    constructor() {
        this.canvasPosition = canvas.getBoundingClientRect();
    }
    mouseDown() {
        canvas.addEventListener('mousedown', () => {
            mouse.clicked = true;
        });
    }
    mouseUp() {
        canvas.addEventListener('mouseup', () => {
            mouse.clicked = false;
        });
    }
    mouseMove() {
        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.x - this.canvasPosition.left;
            mouse.y = e.y - this.canvasPosition.top;
        });
    }
    mouseLeave() {
        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }
    resizeCanvasOnBrowserResize() {
        window.addEventListener('resize', () => {
            this.canvasPosition = canvas.getBoundingClientRect();
        });
    }
    handleGameStatus() {
        ctx.fillStyle = 'red';
        ctx.font = '30px Gope';
        ctx.fillText(`Score: ${config.numberOfResources}   Resources: ${config.numberOfResources}   Total HP: ${config.totalHP}`, 230, 60);
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
}
//# sourceMappingURL=Game.js.map