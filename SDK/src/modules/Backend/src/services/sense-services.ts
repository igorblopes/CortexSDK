import { SenseScoreModelDB } from '../interfaces-db';
import { SenseScoreDB } from '../infra/database/cortext-db-sense-score';
import { IUpdateSenseScore } from '../interfaces';

export class SenseServices {

    constructor(private senseScoreDB: SenseScoreDB){}

    async getAllSenseScore(): Promise<SenseScoreModelDB[]> {
        return await this.senseScoreDB.getAllSenseScore();
    }

    async setUpdateSenseScore(request: IUpdateSenseScore): Promise<SenseScoreModelDB> {
        return await this.senseScoreDB.setUpdateSenseScore(request);
    }

    async getLevelByScore(score: number): Promise<string | undefined> {
        return await new Promise<string | undefined>((resolve, reject) => {
            
            this.senseScoreDB.getMapAllSenseScore()
                .then((resp: Map<number, string>) => {
                    let response = resp.get(score);
                    resolve(response);
                })
                .catch((err) => reject(err));

        });
        
    }

}