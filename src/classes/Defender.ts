import {ctx, config} from '../utils/utils.js';
import {defenders} from "../minions/defenders.js";
import {Enemy} from "./Enemy.js";
import {FloatingMessage} from "./FloatingMessage.js";

export class Defender {
    public x: number | undefined;
    public y: number | undefined;
    public width: number;
    public height: number;
    // public frameX: number;
    // public frameY: number;
    // public minFrame: number;
    // public maxFrame: number;
    // public spriteWidth: number;
    // public spriteHeight: number;
    public defenderImage: HTMLImageElement = new Image();
    public range: number;
    public damage: number;
    public frequency: number;
    public rayColor: string;
    public rayWidth: number;
    public img: string;
    public showRay: boolean;
    public shootAllowed: boolean;
    public cost: number;


    constructor(x: number | undefined, y: number | undefined, type: number) {
        this.x = x;
        this.y = y;
        this.width = config.cellSize - config.cellGap * 2;
        this.height = config.cellSize - config.cellGap * 2;
        this.range = defenders[type].range;
        this.damage = defenders[type].damage;
        this.frequency = defenders[type].frequency;
        this.rayColor = defenders[type].rayColor;
        this.rayWidth = defenders[type].rayWidth;
        this.img = defenders[type].image;
        this.showRay = false;
        this.shootAllowed = true;
        this.cost = defenders[type].cost;
        // # these properties are for animations
        // this.frameX = 0;
        // this.frameY = 0;
        // this.minFrame = 0;
        // this.maxFrame = 16;
        // this.spriteWidth = 300;
        // this.spriteHeight = 240;
    }

    draw() {
        const defenderImage = new Image();
        defenderImage.src = this.img;
        const xPos = this.x || 0;
        const yPos = this.y || 0;
        ctx.drawImage(defenderImage, 0, 0, 100, 100, xPos, yPos, 60, 60);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(String(Math.floor(this.range)), xPos + 15, yPos + 30);
    }
    // update() {
    //     if (config.frame % 8 === 0) {
    //         if (this.frameX < this.maxFrame) this.frameX++;
    //         else this.frameX = this.minFrame;
    //         if (this.frameX === 15) this.shootNow = true;
    //     }
    //     if (this.shooting) {
    //         this.minFrame = 0;
    //         this.maxFrame = 15;
    //     } else {
    //         this.minFrame = 17;
    //         this.maxFrame = 23;
    //     }
    //     if (this.shooting && this.shootNow) {
    //         if (this.timer % 100 === 0) {
    //             config.projectiles.push(new Projectile(this.x + 70, this.y + 50));
    //             this.shootNow = false;
    //         }
    //     }
    // }

    public shoot(enemy: Enemy): void {
        if (this.shootAllowed) {
            this.shootAllowed = false;
            this.showRay = true;

            if (enemy.health <= 0) {
                const gainedResources: number = enemy.maxHealth/10;
                config.floatingMessages.push(new FloatingMessage('+' + gainedResources, enemy.x, enemy.y, 30, 'black'));
                config.floatingMessages.push(new FloatingMessage('+' + gainedResources, 250, 50, 30, 'gold'));
                config.numberOfResources += gainedResources;
                config.score += gainedResources;
                const findThisIndex: number = config.enemiesPositions.indexOf(enemy.y);
                config.enemiesPositions.splice(findThisIndex, 1);
            }

            setTimeout((that: Defender) => {
                return () => {
                    that.shootAllowed = true;
                }
            }, this.frequency);
        }

        if (this.showRay) {
            enemy.health -= this.damage / 60;
            if (this.x && this.y) {
                ctx.save();
                ctx.lineWidth = this.rayWidth;
                ctx.strokeStyle = this.rayColor;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y+0.5);
                ctx.lineTo(enemy.x, enemy.y);
                ctx.stroke();
                ctx.restore();

                setTimeout((that: Defender) => {
                    return () => {
                        that.showRay = false;
                    }
                }, this.frequency/2);
            }
        }
    }
}