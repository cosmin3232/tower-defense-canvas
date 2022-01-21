import { ctx, config } from '../utils/utils.js';
import { Projectile } from "./Projectile.js";
export class Defender {
    constructor(x, y) {
        this.defenderImage = new Image();
        this.x = x;
        this.y = y;
        this.width = config.cellSize - config.cellGap * 2;
        this.height = config.cellSize - config.cellGap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 16;
        this.spriteWidth = 300;
        this.spriteHeight = 240;
        this.chosenDefender = config.chosenDefender;
    }
    draw() {
        if (this.chosenDefender === 1) {
            ctx.drawImage(config.defenderTypes[0], 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
        else if (this.chosenDefender === 2) {
            ctx.drawImage(config.defenderTypes[1], 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(String(Math.floor(this.health)), this.x + 15, this.y + 30);
    }
    update() {
        if (config.frame % 8 === 0) {
            if (this.frameX < this.maxFrame)
                this.frameX++;
            else
                this.frameX = this.minFrame;
            if (this.frameX === 15)
                this.shootNow = true;
        }
        if (this.shooting) {
            this.minFrame = 0;
            this.maxFrame = 15;
        }
        else {
            this.minFrame = 17;
            this.maxFrame = 23;
        }
        if (this.shooting && this.shootNow) {
            if (this.timer % 100 === 0) {
                config.projectiles.push(new Projectile(this.x + 70, this.y + 50));
                this.shootNow = false;
            }
        }
    }
}
//# sourceMappingURL=Defender.js.map