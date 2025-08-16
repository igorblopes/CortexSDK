import { SenseScoreModelDB } from '../interfaces-db';
import { SenseScoreDB } from '../infra/database/cortext-db-sense-score';

export class SenseServices {

    constructor(private senseScoreDB: SenseScoreDB){}

    async getAllSenseScore(): Promise<SenseScoreModelDB[]> {
        return await this.senseScoreDB.getAllSenseScore();
    }

    async getLevelByScore(score: string): Promise<string> {
        return await this.senseScoreDB.findLevelByScore(score);
    }

}