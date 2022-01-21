import {config, ctx, mouse, collision, canvas} from "../utils/utils.js";

export class Cell {
    public rows: number;
    public cols: number;
    public length: number;
    public cells: Int8Array;

    constructor(width: number, height: number, private cellSize: number = config.cellSize) {
        this.cols = ~~(width / cellSize);
        this.rows = ~~(height / cellSize);
        this.length = this.rows * this.cols;
        this.cells = new Int8Array(this.length);
    }
    public draw(): void {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.strokeRect(150, 150, config.cellSize, config.cellSize);
            // ctx.arc(this.x, this.y, config.cellSize, 0, 2 * Math.PI);
            // ctx.stroke();
        }
    }

    public set(col: number, row: number, value: number): this
    {
        this.cells[this.offset(row, col)] = value;
        return this;
    }

    private offset(row: number, col: number): number
    {
        return row * this.cols + col;
    }

    public get(col: number, row: number): number
    {
        return this.cells[this.offset(row, col)];
    }
}