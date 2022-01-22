import { config, ctx } from "../utils/utils.js";
export class Enemy {
    constructor(x, y, type, name, health, speed, enemyDirection) {
        this.x = x;
        this.y = y;
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
    update() {
        if (config.frame % 10 === 0) {
            if (this.frameX < this.maxFrame)
                this.frameX++;
            else
                this.frameX = this.minFrame;
        }
    }
    draw() {
        const enemyImage = new Image();
        enemyImage.src = this.actualDirection;
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Gope';
        ctx.fillText(`${this.name} (${Math.round(this.health)})`, this.x - 10, this.y + 25);
    }
}
//# sourceMappingURL=Enemy.js.map