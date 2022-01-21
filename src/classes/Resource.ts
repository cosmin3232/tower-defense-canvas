import {config, canvas, ctx} from "../utils/utils.js";

export class Resource {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public amount: number;

    constructor() {
        this.x = Math.random() * (canvas.width - config.cellSize);
        this.y = (Math.floor(Math.random() * 5)  + 1) * config.cellSize + 25;
        this.width = config.cellSize * 0.6;
        this.height = config.cellSize * 0.6;
        this.amount = Math.floor(Math.random() * 100) + 1;
    }
    public draw(): void {
        const resourceImg: HTMLImageElement = new Image();
        resourceImg.src = '../images/coin.jpg';
        ctx.drawImage(resourceImg, 0, 0, 60, 60, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(String(this.amount), this.x + 15, this.y + 15);
    }
}