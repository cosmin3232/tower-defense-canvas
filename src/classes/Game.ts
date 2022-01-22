import {canvas, config, ctx, mouse} from "../utils/utils.js";

export class Game {
    private canvasPosition: DOMRect;
    constructor() {
        this.canvasPosition = canvas.getBoundingClientRect();
    }

    public mouseDown(): void {
        canvas.addEventListener('mousedown', () => {
            mouse.clicked = true;
        });
    }

    public mouseUp(): void {
        canvas.addEventListener('mouseup', () => {
            mouse.clicked = false;
        });
    }

    public mouseMove(): void {
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            mouse.x = e.x - this.canvasPosition.left;
            mouse.y = e.y - this.canvasPosition.top;
        });
    }

    public mouseLeave(): void {
        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    public resizeCanvasOnBrowserResize(): void {
        window.addEventListener('resize', () => {
            this.canvasPosition = canvas.getBoundingClientRect();
        });
    }

    public handleGameStatus(): void {
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