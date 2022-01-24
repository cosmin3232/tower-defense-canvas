import {MouseModel} from "../models/mouse.model.js";
import {ConfigModel} from "../models/config.model.js";

export const canvas: any | null = <HTMLCanvasElement>document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

export const mouse: MouseModel = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked: false,
}

export const config: ConfigModel = {
    totalHP: 1000,
    cellSize: 10,
    cellGap: 3,
    winningScore: 50,
    defenders: [],
    enemies: [],
    enemiesPositions: [],
    bullets: [],
    resources: [],
    enemiesInterval: 60,
    numberOfResources: 300,
    frame: 0,
    score: 0,
    gameOver: false,
    chosenDefender: 1,
    amounts: [Math.floor(Math.random() * 100) + 1],
    floatingMessages: [],
    defenderTypes: [],
}

export function collision(first: any, second: any) {
    if (
        !(first.x > second.x + second.width ||
            first.x + first.width < second.x ||
            first.y > second.y + second.width ||
            first.y + first.height < second.y)
    ) {
        return true;
    }
}

