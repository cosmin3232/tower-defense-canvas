import {config, canvas, ctx} from "../utils/utils.js";

export class Resource {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public amount: number;

    constructor() {
        this.x = Math.random() * (canvas.width - config.cellSize);
        this.y = 0;
        this.width = 30;
        this.height = 30;
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

    public update(): void {
        this.y++;
    }
}