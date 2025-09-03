import * as sqlite3 from 'sqlite3';
import { SenseScoreModelDB } from '../../interfaces-db';

export class SenseScoreDB {

    constructor(private db: sqlite3.Database){}

    async findLevelByScore(score: string): Promise<string> {
    
        let level: string = "";
        

        await this.db.all<string>(`
            SELECT level FROM sense_score WHERE score = ${score}
        `, function(err, rows) {

            if (err) {
                console.error('Erro ao Buscar:', err.message);
                return;
            }
            
            level = rows[0];
            

        });

        return level;
    }

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