import {
    canvas,
    mouse,
    config,
    ctx
} from "../utils/utils.js";
import {Defender} from "./Defender.js";
import {FloatingMessage} from "./FloatingMessage.js";

export class Game {
    private canvasPosition: DOMRect;
    constructor() {
        this.canvasPosition = canvas.getBoundingClientRect();
    }

    public draw(): void {
        if (!mouse) return;
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

    public rangeArea(): void {
        if (mouse.x === undefined && mouse.y === undefined) return;
        const range = 150;
        ctx.beginPath();
        ctx.globalAlpha = 0.2;
        if (typeof mouse.x === "number" && typeof mouse.y === "number") {
            ctx.arc(mouse.x, mouse.y, range, 0, 2 * Math.PI);
            Game.isTowerAllowed(mouse.x, mouse.y) ? ctx.fillStyle = 'white' : ctx.fillStyle = 'red';
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    public addTower(event: MouseEvent, activeTower: number): void {
        const defenderCost = 100;
        if (
            Game.isTowerAllowed(mouse.x || 0, mouse.y || 0)
            && config.numberOfResources >= defenderCost) {
            config.defenders.push(new Defender((mouse.x || 0) - config.cellSize * 5, (mouse.y || 0) - config.cellSize * 5, activeTower));
            config.numberOfResources -= defenderCost;
        } else if (config.numberOfResources < defenderCost) {
            if (mouse.x != null && mouse.y != null) {
                config.floatingMessages.push(new FloatingMessage('Need more resources.', mouse.x, mouse.y, 25, 'black'));
            }
        } else {
            if (mouse.x != null && mouse.y != null) {
                config.floatingMessages.push(new FloatingMessage('You can not place a defender here.', mouse.x, mouse.y, 25, 'black'));
            }
        }
    }

    private static isTowerAllowed(x: number, y: number): boolean {
        if (x > 210 && x < 390 && y > 0) return false;
        else if (x > 210 && x < 1080 && y < 152) return false;
        else if (x > 914 && x < 1080 && y < 425) return false;
        else if (x < 1047 && x > 572 && y > 291 && y < 426) return false;
        else if (x < 774 && x > 582 && y > 423) return false;
        else if (x > 649 && y > 519) return false;
        else {
            for (let i = 0, len = config.defenders.length; i < len; i++) {
                if (Math.abs(Number(x - (config.defenders[i].x || 0) < 50 && Math.abs((config.defenders[i].y || 0) - y) < 50))) {
                    return false;
                }
            }
        }
        return true;
    }

}