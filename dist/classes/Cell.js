import { config, ctx, mouse, collision } from "../utils/utils.js";
export class Cell {
    constructor(width, height, cellSize = config.cellSize) {
        this.cellSize = cellSize;
        this.cols = ~~(width / cellSize);
        this.rows = ~~(height / cellSize);
        this.length = this.rows * this.cols;
        this.cells = new Int8Array(this.length);
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.strokeRect(150, 150, config.cellSize, config.cellSize);
            // ctx.arc(this.x, this.y, config.cellSize, 0, 2 * Math.PI);
            // ctx.stroke();
        }
    }
    set(col, row, value) {
        this.cells[this.offset(row, col)] = value;
        return this;
    }
    offset(row, col) {
        return row * this.cols + col;
    }
    get(col, row) {
        return this.cells[this.offset(row, col)];
    }
}
//# sourceMappingURL=Cell.js.map