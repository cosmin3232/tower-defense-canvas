import {Defender} from "../classes/Defender.js";
import {Enemy} from "../classes/Enemy.js";
import {Resource} from "../classes/Resource.js";
import {FloatingMessage} from "../classes/FloatingMessage.js";
import {Bullet} from "../classes/Bullet.js";

export interface ConfigModel {
    totalHP: number;
    cellSize: number;
    cellGap: number;
    winningScore: number;
    defenders: Array<Defender>;
    enemies: Array<Enemy>;
    enemiesPositions: Array<number>;
    bullets: Array<Bullet>;
    resources: Array<Resource>;
    enemiesInterval: number;
    numberOfResources: number;
    frame: number;
    score: number;
    gameOver: boolean;
    chosenDefender: number;
    amounts: Array<number>;
    floatingMessages: Array<FloatingMessage>;
    defenderTypes: Array<HTMLImageElement>;
}