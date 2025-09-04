import * as sqlite3 from 'sqlite3';
import { SenseScoreModelDB } from '../../interfaces-db';
import { IUpdateSenseScore } from '../../interfaces';

export class SenseScoreDB {

    constructor(private db: sqlite3.Database){}

    getLevelFromScore(score: number){
        if(score <= 39) return "allow";
        if(score > 39 && score <= 79) return "review";
        if(score > 79) return "deny";

        return "deny";
    }


    async getAllSenseScore(): Promise<SenseScoreModelDB[]> {
        let allSenseScore: SenseScoreModelDB[] = [];

        return await new Promise<SenseScoreModelDB[]>((resolve, reject) => {
            this.db.all(
                `
                SELECT * FROM sense_score
                ` 
                ,(err: any, rows: any[]) => {
                    if(err) {
                        reject(err);
                    }   

                    for(let row of rows) {
                        allSenseScore.push({
                            id: row.id,
                            min_score: row.min_score,
                            max_score: row.max_score,
                            level: row.level
                        });
                    }
                    
                    resolve(allSenseScore);
                }
                    
            )
        });
    }

    async setUpdateSenseScore(request: IUpdateSenseScore): Promise<SenseScoreModelDB> {
        
        let context = this;
        return await new Promise<SenseScoreModelDB>((resolve, reject) => {
            this.db.run(
                `
                    UPDATE sense_score set min_score = '${request.minScore}', max_score = '${request.maxScore}' WHERE id = '${request.id}'
                ` 
                ,function (err) {

                    if(err) reject(err);

                    context.getById(request.id)
                        .then((resp) => resolve(resp))
                        .catch((err) => reject(err))
                }
            );
                    
        });
    }


    async getById(id: any): Promise<SenseScoreModelDB> {
        return await new Promise<SenseScoreModelDB>((resolve, reject) => {

            this.getAllSenseScore()
                .then((resp: SenseScoreModelDB[]) =>{

                    let out = resp.filter(f => f.id == id);
                    resolve(out[0]);

                })
                .catch((err) => reject(err))
        });
    }


    async getMapAllSenseScore(): Promise<Map<number, string>> {
        return await new Promise<Map<number, string>>((resolve, reject) => {
            try{

                this.getAllSenseScore()
                    .then((allScores) => {

                        let map: Map<number, string> = new Map<number, string>();
                    
                        for(let score of allScores){
                            for(let i = score.min_score; i < score.max_score; i++){
                                map.set(i, score.level);
                            }
                        }

                        resolve(map);

                    })
                    .catch((err) => reject(err))

                
            }catch(err){
                reject(err)
            }
        });
    }
     

    


}