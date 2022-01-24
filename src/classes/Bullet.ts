import {config, ctx} from "../utils/utils.js";
import {Enemy} from "./Enemy.js";

export class Bullet {
    public x: number;
    public y: number;
    public damage: number;
    public target: any;
    public speed: number;
    public bulletImage: string;
    public frameX: number;
    public frameY: number;
    public minFrame: number;
    public maxFrame: number;
    public spriteWidth: number;
    public spriteHeight: number;

    constructor(x: number, y: number, target: Enemy, damage: number, speed: number, bulletImage: string) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.target = target;
        this.speed = speed;
        this.bulletImage = bulletImage;
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 6;
        this.spriteWidth = 196 / 7;
        this.spriteHeight = 36;
    }

    public draw(): void {
        const image = new Image();
        image.src = this.bulletImage;
        // ctx.fillStyle = 'black';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        // ctx.fillStyle = 'black';
        // ctx.fill();
        ctx.drawImage(image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, 50, 50);
    }

    public update(t: Date): void {
        const movingSpeed = this.speed * Number(t);

        if (config.frame % 4 === 0) {
            this.frameX++;
        }

        const xDist = this.target.x + config.cellSize/2 - this.x;
        const yDist = this.target.y + config.cellSize/2 - this.y;
        const dist = Math.sqrt(xDist*xDist + yDist*yDist);

        if (dist < movingSpeed) {
            this.x = this.target.x + config.cellSize/2;
            this.y = this.target.y + config.cellSize/2;
        } else {
            this.x = this.x + movingSpeed * xDist/dist;
            this.y = this.y + movingSpeed * yDist/dist;
        }
    }

    public checkCollision(): boolean {
        if (
            this.x < this.target.x + config.cellSize
            && this.x + this.speed > this.target.x
            && this.y < this.target.y + config.cellSize
            && this.y + this.speed > this.target.y
        ) {
            this.target.health -= this.damage;
            return true;
        }
        return false;
    }
}
