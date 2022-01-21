import {config, canvas, ctx} from "../utils/utils.js";
import {EnemyImagesModel} from "../models/enemy-images.model.js";

export class Enemy {
    public x: number;
    public y: number;
    public name: string;
    public type: string;
    public width: number;
    public height: number;
    public speed: number;
    public movement: number;
    public health: number;
    public maxHealth: number;
    public enemyDirection: EnemyImagesModel;
    public frameX: number;
    public frameY: number;
    public minFrame: number;
    public maxFrame: number;
    public spriteWidth: number;
    public spriteHeight: number;
    public actualDirection: string;


    constructor(type: string, name: string, health: number, speed: number, enemyDirection: EnemyImagesModel) {
        this.x = 260;
        this.y = 750;
        this.type = type;
        this.name = name;
        this.width = 100 - config.cellGap * 2;
        this.height = 100 - config.cellGap * 2;
        this.speed = speed;
        this.movement = this.speed;
        this.health = health;
        this.maxHealth = this.health;
        this.enemyDirection = enemyDirection;
        this.actualDirection = enemyDirection.up;
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 2;
        this.spriteWidth = 45;
        this.spriteHeight = 50;
    }
    public update(): void {
        if (config.frame % 10 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
    }
    public draw(): void {
        const enemyImage = new Image();
        enemyImage.src = this.actualDirection;
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Gope';
        ctx.fillText(`${this.name} (${this.health})`, this.x - 10, this.y + 25);
    }
}