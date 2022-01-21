import {ctx} from "../utils/utils.js";

export class FloatingMessage {
    public value: string;
    public x: number;
    public y: number;
    public size: number;
    public lifeSpan: number;
    public color: string;
    public opacity: number;

    constructor(value: string, x: number, y: number, size: number, color: string) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.color = color;
        this.opacity = 1;
    }
    public update(): void {
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > 0.03) this.opacity -= 0.03;
    }
    public draw(): void {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Arial';
        ctx.fillText(this.value, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}