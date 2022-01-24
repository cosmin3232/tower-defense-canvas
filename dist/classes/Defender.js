import { ctx, config } from '../utils/utils.js';
import { defenders } from "../minions/defenders.js";
import { Bullet } from "./Bullet.js";
export class Defender {
    constructor(x, y, type) {
        this.defenderImage = new Image();
        this.rateOfFire = 1.0 * 1000;
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
        this.bullet = defenders[type].bulletImage;
        this.showRay = false;
        this.shootAllowed = true;
        this.cost = defenders[type].cost;
        // # these properties are for animations
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 10;
        this.spriteWidth = 100;
        this.spriteHeight = 140;
        this.angle = 0;
        this.xFire = 0;
        this.yFire = 0;
    }
    draw() {
        const defenderImage = new Image();
        defenderImage.src = this.img;
        const xPos = this.x || 0;
        const yPos = this.y || 0;
        ctx.drawImage(defenderImage, 0, 0, 100, 100, xPos, yPos, 100 - config.cellGap * 2, 100 - config.cellGap * 2);
    }
    update() {
        if (config.frame % 5 === 0) {
            if (this.frameX < this.maxFrame)
                this.frameX++;
            else
                this.frameX = this.minFrame;
        }
    }
    enemyInRange(enemy) {
        const xPos = this.x || 0;
        const yPos = this.y || 0;
        const distance = (enemy.x - xPos) * (enemy.x - xPos + config.cellSize) + (enemy.y - yPos) * (enemy.y - yPos + config.cellSize);
        return (distance < (this.range * this.range));
    }
    possibleTargets(possibleTargets) {
        return possibleTargets[0];
    }
    findTarget() {
        if (config.enemies.length === 0) {
            this.target = null;
            return;
        }
        if (this.target && (this.target.health <= 0 || !this.enemyInRange(this.target))) {
            this.target = null;
        }
        if (this.target) {
            return;
        }
        const possibleTargets = config.enemies.filter(this.enemyInRange, this);
        if (possibleTargets.length > 0) {
            this.target = this.possibleTargets(possibleTargets);
        }
    }
    findUnitCoords() {
        if (!this.target)
            return false;
        const xDist = this.target.x - (this.x || 0);
        const yDist = this.target.y - (this.y || 0);
        const dist = Math.sqrt(xDist * xDist + yDist * yDist);
        this.angle = Math.atan2(yDist, xDist) + Math.PI / 2;
        this.xFire = (this.x || 0) + config.cellSize * xDist / dist;
        this.yFire = (this.y || 0) + config.cellSize * yDist / dist;
    }
    fire(t) {
        this.rateOfFire -= Number(t);
        if (this.target && this.rateOfFire <= 0) {
            config.bullets.push(new Bullet(this.xFire, this.yFire, this.target, 1, 4 * 20 / 1000, this.bullet));
            ctx.save();
            ctx.lineWidth = this.rayWidth;
            ctx.strokeStyle = this.rayColor;
            ctx.beginPath();
            ctx.moveTo((this.x || 0) + 20, (this.y || 0) + 20);
            ctx.lineTo(this.target.x + 60, this.target.y + 40);
            ctx.stroke();
            ctx.restore();
            this.rateOfFire = 1.0 * 1000;
        }
    }
}
//# sourceMappingURL=Defender.js.map