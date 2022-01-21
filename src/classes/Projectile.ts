import {ctx} from "../utils/utils.js";

export class Projectile {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public power: number;
    public speed: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
    }
    public update(): void {
        this.x += this.speed;
    }
    public draw(): void {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}